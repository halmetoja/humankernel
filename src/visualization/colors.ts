/**
 * Resolution-to-color gradient mapping for the representational network visualization.
 *
 * Maps resolution (0-1) to a color gradient:
 *   1.0 → green (#4caf50) - full resolution
 *   0.5 → yellow (#ffeb3b) - partial compression
 *   0.0 → red (#f44336) - fully compressed
 *
 * Color is NEVER the sole means of conveying information (WCAG AA).
 * Node state is always also communicated via text labels, aria attributes,
 * and node size/opacity changes.
 */

/** Color stop definition for the resolution gradient */
interface ColorStop {
  position: number;
  r: number;
  g: number;
  b: number;
}

/** Parse hex color to RGB components */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16),
  };
}

/** Convert RGB components to hex string */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** The three gradient stops */
const COLOR_STOPS: ColorStop[] = [
  { position: 0.0, ...hexToRgb('#f44336') }, // red - compressed
  { position: 0.5, ...hexToRgb('#ffeb3b') }, // yellow - partial
  { position: 1.0, ...hexToRgb('#4caf50') }, // green - full resolution
];

/**
 * Map a resolution value (0-1) to a hex color string.
 * Linearly interpolates between the defined color stops.
 *
 * @param resolution - Value between 0 and 1 (clamped if out of range)
 * @returns Hex color string (e.g., "#4caf50")
 */
export function resolutionToColor(resolution: number): string {
  // Clamp to [0, 1]
  const clamped = Math.max(0, Math.min(1, resolution));

  // Find the two stops to interpolate between
  let lower = COLOR_STOPS[0]!;
  let upper = COLOR_STOPS[COLOR_STOPS.length - 1]!;

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (clamped >= COLOR_STOPS[i]!.position && clamped <= COLOR_STOPS[i + 1]!.position) {
      lower = COLOR_STOPS[i]!;
      upper = COLOR_STOPS[i + 1]!;
      break;
    }
  }

  // Calculate interpolation factor within this segment
  const range = upper.position - lower.position;
  const t = range === 0 ? 0 : (clamped - lower.position) / range;

  // Linear interpolation
  const r = lower.r + t * (upper.r - lower.r);
  const g = lower.g + t * (upper.g - lower.g);
  const b = lower.b + t * (upper.b - lower.b);

  return rgbToHex(r, g, b);
}

/**
 * Get a human-readable resolution state label.
 * Used alongside color to ensure color is not the sole information channel.
 *
 * @param resolution - Value between 0 and 1
 * @returns Descriptive state label
 */
export function resolutionStateLabel(resolution: number): string {
  if (resolution >= 0.8) return 'Full resolution';
  if (resolution >= 0.5) return 'Partial compression';
  if (resolution >= 0.3) return 'Significant compression';
  return 'Highly compressed';
}

/**
 * Get the CSS custom property name for a resolution level.
 * Maps to the existing theme variables.
 */
export function resolutionCssVar(resolution: number): string {
  if (resolution >= 0.7) return '--accent';
  if (resolution >= 0.4) return '--warning';
  return '--danger';
}
