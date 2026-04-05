/** Relative luminance (sRGB) for contrast hints — higher ratio = easier to scan. */
function parseRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim();
  const m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.exec(h);
  if (!m) return null;
  let s = m[1];
  if (s.length === 3) {
    s = s
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (s.length === 8) s = s.slice(0, 6);
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  const linear = [rgb.r, rgb.g, rgb.b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/** WCAG-style contrast ratio between two hex colours (ignores alpha on 8-digit hex). */
export function contrastRatio(hexFg: string, hexBg: string): number | null {
  const a = parseRgb(hexFg);
  const b = parseRgb(hexBg);
  if (!a || !b) return null;
  const l1 = luminance(a) + 0.05;
  const l2 = luminance(b) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}
