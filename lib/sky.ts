import { MAX_F, MIN_F } from "./range";

type RGB = [number, number, number];

/** Sky color by outside temperature (°F): polar night, overcast, clear day, heat haze. */
const SKY: [number, string][] = [
  [-20, "#1b2a4a"],
  [0, "#2f4c7a"],
  [20, "#7392bb"],
  [32, "#c2d0dd"],
  [50, "#b2d8f0"],
  [70, "#84c2ec"],
  [85, "#e4d8a6"],
  [100, "#eeae70"],
  [115, "#d76c45"],
];

const INK = "#1f2328";
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const STOPS = SKY.map(([f, h]) => [f, hex(h)] as const);
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
const css = ([r, g, b]: RGB) => `rgb(${r} ${g} ${b})`;

function skyRgb(f: number): RGB {
  if (f <= STOPS[0][0]) return STOPS[0][1];
  for (let i = 1; i < STOPS.length; i++) {
    const [f1, c1] = STOPS[i];
    if (f <= f1) {
      const [f0, c0] = STOPS[i - 1];
      return mix(c0, c1, (f - f0) / (f1 - f0));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

function luminance(rgb: RGB): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export const skyAt = (f: number) => css(skyRgb(f));

/** Text color with the better contrast against the sky at this temperature. */
export function inkOn(f: number): string {
  const bg = luminance(skyRgb(f));
  return contrast(bg, 1) >= contrast(bg, luminance(hex(INK))) ? "#ffffff" : INK;
}

/** Roadside: snow below freezing, dormant grass, green grass, then dry dirt in the heat. */
export const groundAt = (f: number) => (f < 32 ? "#eef2f5" : f < 50 ? "#a3a77c" : f <= 85 ? "#6e9a4e" : "#c9a467");

export const SKY_STOPS = SKY.map(([f, color]) => ({ offset: (f - MIN_F) / (MAX_F - MIN_F), color }));

export const thermoGradient = `linear-gradient(90deg, ${SKY_STOPS.map(
  (s) => `${s.color} ${(s.offset * 100).toFixed(1)}%`,
).join(", ")})`;
