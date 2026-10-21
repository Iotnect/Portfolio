/** Resume an ambient demo after backgrounding or back/forward-cache restoration. */
export function attachAmbientVideo(video: HTMLVideoElement, onBlocked: (blocked: boolean) => void) {
  let disposed = false;
  let suspended = document.hidden;
  const rect = video.getBoundingClientRect();
  let inView = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending = false;
  let generation = 0;
  let reloaded = false;
  let restoreTime: number | undefined;
  let progressVersion = 0;
  let previousTime = video.currentTime;
  let bufferingChecks = 0;

  const active = () => !disposed && !document.hidden && !suspended && inView;
  const clearTimer = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined; };
  const watchProgress = () => {
    if (timer !== undefined || !active()) return;
    const startTime = video.currentTime;
    const startProgress = progressVersion;
    timer = setTimeout(() => {
      timer = undefined;
      if (!active()) return;
      const advanced = progressVersion !== startProgress || Math.abs(video.currentTime - startTime) > 0.04;
      if (!video.paused && advanced) { onBlocked(false); return; }
      if (video.readyState < 2 && !video.error && bufferingChecks++ < 3) {
        watchProgress();
        return;
      }
      if (reloaded) { onBlocked(true); return; }
      // Some mobile decoders stay frozen even after play() succeeds. Reload
      // only this media element once, retaining its previous playback position.
      reloaded = true;
      restoreTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      generation++;
      pending = false;
      try { video.load(); attempt(); } catch { onBlocked(true); }
    }, 1800);
  };
  const attempt = () => {
    if (!active() || pending) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const token = ++generation;
    pending = true;
    // Start the watchdog before play() resolves; suspended decoders can leave
    // the play promise pending indefinitely.
    watchProgress();
    try {
      const result = video.play();
      Promise.resolve(result).then(() => {
        if (disposed || token !== generation) return;
        pending = false;
        if (!active()) { video.pause(); return; }
        onBlocked(false);
      }).catch((error: unknown) => {
        if (disposed || token !== generation) return;
        pending = false;
        if (!active()) return;
        if (error instanceof Error && error.name === 'NotAllowedError') {
          clearTimer();
          onBlocked(true);
        } else {
          watchProgress();
        }
      });
    } catch {
      pending = false;
      onBlocked(true);
    }
  };
  const suspend = () => {
    generation++;
    pending = false;
    reloaded = false;
    bufferingChecks = 0;
    clearTimer();
    video.pause();
  };
  const wake = () => { suspended = false; attempt(); };
  const visibility = () => {
    suspended = document.hidden;
    if (suspended) suspend(); else attempt();
  };
  const pagehide = () => { suspended = true; suspend(); };
  const metadata = () => {
    if (restoreTime === undefined) return;
    const saved = restoreTime;
    restoreTime = undefined;
    try {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.min(saved, Math.max(0, video.duration - 0.1));
      }
    } catch { /* Playback may continue from the start if seeking is unavailable. */ }
    // Restoring a saved timestamp is a seek, not evidence that frames resumed.
    previousTime = video.currentTime;
    clearTimer();
    watchProgress();
  };
  const pause = () => { if (active()) attempt(); };
  const progress = () => {
    if (Math.abs(video.currentTime - previousTime) > 0.001) progressVersion++;
    previousTime = video.currentTime;
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) attempt(); else suspend();
  });
  observer.observe(video);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pageshow', wake);
  window.addEventListener('pagehide', pagehide);
  window.addEventListener('focus', wake);
  video.addEventListener('loadedmetadata', metadata);
  video.addEventListener('canplay', attempt);
  video.addEventListener('pause', pause);
  video.addEventListener('waiting', watchProgress);
  video.addEventListener('stalled', watchProgress);
  video.addEventListener('timeupdate', progress);
  attempt();

  return {
    retry() {
      reloaded = false;
      bufferingChecks = 0;
      generation++;
      pending = false;
      clearTimer();
      wake();
    },
    dispose() {
      disposed = true;
      generation++;
      clearTimer();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pageshow', wake);
      window.removeEventListener('pagehide', pagehide);
      window.removeEventListener('focus', wake);
      video.removeEventListener('loadedmetadata', metadata);
      video.removeEventListener('canplay', attempt);
      video.removeEventListener('pause', pause);
      video.removeEventListener('waiting', watchProgress);
      video.removeEventListener('stalled', watchProgress);
      video.removeEventListener('timeupdate', progress);
      video.pause();
    },
  };
}
