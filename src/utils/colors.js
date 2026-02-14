import { Color } from 'three';

/**
 * Map magnetic latitude (degrees, 0-90) to a color.
 * Low latitude (large L-shell, outer belt) = warm (red/orange).
 * High latitude (small L-shell, inner belt) = cool (blue/cyan).
 */
export function latitudeToColor(latDeg) {
  const t = Math.abs(latDeg) / 90; // 0 at equator, 1 at pole
  // Warm-to-cool gradient: red -> orange -> cyan -> blue
  const hue = 0.0 + t * 0.55; // 0 = red, 0.55 = cyan
  const saturation = 0.85;
  const lightness = 0.55;
  return new Color().setHSL(hue, saturation, lightness);
}

/**
 * Map field strength magnitude to a color.
 * Weak field = blue, strong = red.
 */
export function fieldStrengthToColor(bMag, bMin, bMax) {
  const t = Math.min(1, Math.max(0, (bMag - bMin) / (bMax - bMin)));
  const hue = (1 - t) * 0.66; // 0.66 = blue, 0 = red
  return new Color().setHSL(hue, 0.9, 0.5);
}
