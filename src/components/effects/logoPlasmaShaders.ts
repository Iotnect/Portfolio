// Logo-shaped adaptation of the supplied CrystalizedBall effect: OGL full-screen
// pass, hot plasma rim and softened glow. The JPEG's coloured strokes replace
// the original circular boundary; no transparent derivative asset is needed.
export const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragment = `
precision highp float;
uniform sampler2D uLogo;
uniform vec2 uResolution;
uniform vec2 uLogoSize;
uniform vec2 uPointer;
uniform vec3 uColor;
uniform float uTime;
uniform float uCrackle;
uniform float uFill;
uniform float uSize;
uniform float uHover;
uniform float uStrength;
uniform float uReveal;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = mat2(1.6, -1.2, 1.2, 1.6) * p + 3.7;
    amplitude *= 0.5;
  }
  return value;
}
// JPEGs have no alpha. Saturation separates the purple logo from its white
// background, including its white internal cut-outs and antialiased edges.
float mask(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  vec3 ink = texture2D(uLogo, uv).rgb;
  float chroma = max(ink.r, max(ink.g, ink.b)) - min(ink.r, min(ink.g, ink.b));
  return smoothstep(0.08, 0.3, chroma);
}
float surround(vec2 uv, vec2 radius) {
  float value = 0.0;
  for (int i = 0; i < 8; i++) {
    float angle = float(i) * 0.78539816;
    value += mask(uv + vec2(cos(angle), sin(angle)) * radius);
  }
  return value * 0.125;
}
vec3 soften(vec3 x) {
  vec3 over = max(x - 0.6, 0.0);
  return min(x, 0.6) + 0.4 * (1.0 - exp(-over / 0.4));
}
void main() {
  // Object-fit: contain, retaining the JPEG's original aspect ratio.
  float fit = min(uResolution.x / uLogoSize.x, uResolution.y / uLogoSize.y) * uSize;
  vec2 extent = uLogoSize * fit;
  vec2 uv = (vUv - 0.5) * uResolution / extent + 0.5;
  vec2 pointerUV = (uPointer - 0.5) * uResolution / extent + 0.5;
  float nearPointer = exp(-dot(uv - pointerUV, uv - pointerUV) * 18.0) * uHover * uStrength;
  float t = uTime;
  float field = fbm(uv * 9.0 + vec2(t * 0.16, -t * 0.22));
  // A restrained local refraction preserves the logo silhouette and gaps.
  uv += vec2(sin(uv.y * 24.0 + t), cos(uv.x * 21.0 - t)) * nearPointer * 0.003;
  vec2 pixel = 1.0 / extent;
  float ink = mask(uv);
  float edge = abs(ink - surround(uv, pixel * (1.6 + field * uCrackle * 2.5)));
  float outer = (1.0 - ink);
  float halo = surround(uv, pixel * 7.0) * outer * 0.65
             + surround(uv, pixel * 16.0) * outer * 0.32
             + surround(uv, pixel * 30.0) * outer * 0.12;
  float flow = fbm(uv * 17.0 + vec2(field * 3.0, t * 0.28));
  float filament = pow(max(0.0, 1.0 - abs(flow - 0.5) * 26.0), 3.0);
  float ripple = 0.5 + 0.5 * sin(uv.y * 28.0 - uv.x * 15.0 + t * 1.7 + field * 8.0);
  float charge = 0.55 + 0.45 * ripple;
  vec3 original = texture2D(uLogo, clamp(uv, 0.0, 1.0)).rgb;
  vec3 purple = vec3(0.32, 0.06, 0.65);
  vec3 tint = mix(purple, uColor, smoothstep(0.0, 1.0, uv.y + field * 0.2));
  vec3 core = mix(original, tint, 0.48) * (0.75 + field * 0.4);
  vec3 hot = mix(uColor, vec3(1.0), 0.72);
  vec3 col = core * ink;
  col += hot * edge * (0.65 + uCrackle * charge * 1.5 + nearPointer);
  col += uColor * halo * (1.2 + charge * 0.7 + nearPointer * 2.0);
  col += mix(uColor, hot, 0.5) * filament * ink * uCrackle * uFill * (0.5 + nearPointer);
  // Sparse travelling glints live inside the logo, never in a surrounding ball.
  vec2 cell = uv * 105.0;
  float spark = pow(max(0.0, 1.0 - length(fract(cell) - 0.5) * 3.0), 6.0);
  spark *= step(0.97, hash(floor(cell))) * pow(0.5 + 0.5 * sin(t * 1.4 + hash(floor(cell)) * 40.0), 8.0);
  col += hot * spark * ink * 1.6;
  col *= uReveal;
  // Premultiplied transparency lets Aurora show through the logo's gaps and
  // surrounding glow instead of covering it with an opaque rectangle.
  vec3 shown = soften(col);
  float alpha = clamp(max(shown.r, max(shown.g, shown.b)), 0.0, 1.0);
  gl_FragColor = vec4(shown, alpha);
}
`;
