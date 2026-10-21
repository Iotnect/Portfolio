export function getAuroraLayout(width: number, height: number, deviceDpr: number, requestedDpr?: number) {
  // Keep the desktop wave proportions on tall phone screens, instead of
  // stretching the wave crests and fog to match the full portrait height.
  const fieldHeight = Math.min(height, width / 1.6);
  const ratio = Math.min(
    requestedDpr ?? deviceDpr,
    2.5,
    Math.sqrt(2_500_000 / Math.max(1, width * height)),
  );
  return { fieldHeight, ratio: Math.max(0.5, ratio), columnStep: width <= 760 ? 2 : 5 };
}
