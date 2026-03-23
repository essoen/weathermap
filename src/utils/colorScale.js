/**
 * Convert a 0-1 score to an RGBA color string.
 * 0 = red, 0.5 = yellow, 1 = green
 */
export function scoreToColor(score, opacity = 0.4) {
  const s = Math.max(0, Math.min(1, score));

  let r, g, b;
  if (s < 0.5) {
    // Red → Yellow
    const t = s / 0.5;
    r = 220;
    g = Math.round(60 + 160 * t);
    b = 40;
  } else {
    // Yellow → Green
    const t = (s - 0.5) / 0.5;
    r = Math.round(220 - 180 * t);
    g = Math.round(220 - 40 * t);
    b = Math.round(40 + 60 * t);
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
