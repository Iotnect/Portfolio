const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync(require('node:path').join(__dirname, '../src/lib/ambientVideo.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText;
const controller = {};
new Function('exports', compiled)(controller);
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

function fixture(t) {
  const original = {};
  for (const key of ['document', 'window', 'IntersectionObserver', 'setTimeout', 'clearTimeout']) original[key] = global[key];
  const document = Object.assign(new EventTarget(), { hidden: false });
  const window = Object.assign(new EventTarget(), { innerWidth: 390, innerHeight: 844 });
  const timers = new Map();
  let sequence = 0, intersection;
  class Video extends EventTarget {
    currentTime = 12;
    duration = 60;
    readyState = 4;
    paused = true;
    error = null;
    playCalls = 0;
    loads = 0;
    playResult = () => Promise.resolve();
    getBoundingClientRect() { return { top: 100, bottom: 300, left: 0, right: 390 }; }
    play() { this.playCalls++; this.paused = false; return this.playResult(); }
    pause() { const wasPlaying = !this.paused; this.paused = true; if (wasPlaying) this.dispatchEvent(new Event('pause')); }
    load() { this.loads++; this.currentTime = 0; this.readyState = 0; }
  }
  global.document = document;
  global.window = window;
  global.IntersectionObserver = class { constructor(callback) { intersection = callback; } observe() {} disconnect() {} };
  global.setTimeout = callback => { timers.set(++sequence, callback); return sequence; };
  global.clearTimeout = id => timers.delete(id);
  const video = new Video();
  const states = [];
  const recovery = controller.attachAmbientVideo(video, state => states.push(state));
  t.after(() => {
    recovery.dispose();
    for (const key of Object.keys(original)) {
      if (original[key] === undefined) delete global[key]; else global[key] = original[key];
    }
  });
  return {
    video, document, window, states, recovery, timers,
    visibility(hidden) { document.hidden = hidden; document.dispatchEvent(new Event('visibilitychange')); },
    intersect(visible) { intersection([{ isIntersecting: visible }]); },
    tick() { const next = timers.entries().next().value; if (next) { timers.delete(next[0]); next[1](); } },
  };
}

test('resumes muted inline playback after leaving and returning to the browser', async t => {
  const f = fixture(t); await flush();
  f.visibility(true);
  assert.equal(f.video.paused, true);
  assert.equal(f.timers.size, 0);
  f.visibility(false); await flush();
  assert.equal(f.video.playCalls, 2);
  assert.equal(f.video.paused, false);
  assert.equal(f.video.muted, true);
  assert.equal(f.video.playsInline, true);
});

test('resumes after pagehide/pageshow restoration and ignores obsolete play promises', async t => {
  const f = fixture(t); await flush();
  f.window.dispatchEvent(new Event('pagehide'));
  let resolve;
  f.video.playResult = () => new Promise(done => { resolve = done; });
  f.window.dispatchEvent(new Event('pageshow'));
  const oldResolve = resolve;
  f.visibility(true); f.visibility(false);
  const currentResolve = resolve;
  oldResolve(); await flush();
  currentResolve(); await flush();
  assert.equal(f.video.paused, false);
  assert.equal(f.video.loads, 0);
});

test('reloads a frozen decoder only once and restores playback position', async t => {
  const f = fixture(t); await flush();
  f.tick(); await flush();
  assert.equal(f.video.loads, 1);
  f.video.readyState = 4;
  f.video.dispatchEvent(new Event('loadedmetadata'));
  assert.equal(f.video.currentTime, 12);
  f.video.dispatchEvent(new Event('canplay')); await flush();
  f.tick(); await flush();
  assert.equal(f.video.loads, 1);
  assert.equal(f.states.at(-1), true);
});

test('healthy progress and looping do not reload the video', async t => {
  const f = fixture(t); await flush();
  f.video.currentTime = 14;
  f.video.dispatchEvent(new Event('timeupdate'));
  f.video.currentTime = 12;
  f.video.dispatchEvent(new Event('timeupdate'));
  f.tick();
  assert.equal(f.video.loads, 0);
  assert.equal(f.states.at(-1), false);
});

test('gives slow buffering time to recover rather than immediately reloading', async t => {
  const f = fixture(t); await flush();
  f.video.readyState = 1;
  f.tick(); f.tick(); f.tick();
  assert.equal(f.video.loads, 0);
  f.video.readyState = 4; f.video.currentTime += 1;
  f.tick();
  assert.equal(f.video.loads, 0);
});

test('stays paused off screen and exposes a gesture retry when autoplay is blocked', async t => {
  const f = fixture(t); await flush();
  f.intersect(false);
  const before = f.video.playCalls;
  f.window.dispatchEvent(new Event('focus'));
  assert.equal(f.video.playCalls, before);
  f.video.playResult = () => Promise.reject(Object.assign(new Error('Blocked'), { name: 'NotAllowedError' }));
  f.intersect(true); await flush();
  assert.equal(f.states.at(-1), true);
  assert.equal(f.timers.size, 0);
  f.video.playResult = () => Promise.resolve();
  f.recovery.retry(); await flush();
  assert.equal(f.states.at(-1), false);
});
