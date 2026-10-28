type Curve = [x: number, y: number][];

/** Exponent applied to freezing retention; cold losses compound below 32°F. */
const COLD: Curve = [[-20, 3], [-4, 2.4], [14, 1.6], [32, 1], [50, 0.4], [65, 0]];
/** Fractional loss from cabin and battery cooling above 75°F, same for all cars. */
const HOT: Curve = [[75, 0], [85, 0.03], [95, 0.09], [105, 0.16], [115, 0.22]];

export const MIN_F = -20;
export const MAX_F = 115;

function lerp(pts: Curve, x: number): number {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return pts[pts.length - 1][1];
}

/** Share of EPA range kept at a given temperature (°F). */
export function retention(r32: number, f: number): number {
  if (f < 65) return Math.pow(r32, lerp(COLD, f));
  if (f > 75) return 1 - lerp(HOT, f);
  return 1;
}

export const predict = (epa: number, r32: number, f: number) => Math.round(epa * retention(r32, f));

export type Unit = "F" | "C";
export const toC = (f: number) => ((f - 32) * 5) / 9;
export const toF = (c: number) => (c * 9) / 5 + 32;
export const fmtTemp = (f: number, unit: Unit) =>
  unit === "F" ? `${Math.round(f)}°F` : `${Math.round(toC(f))}°C`;

export type Band = "frost" | "mild" | "sodium";
export const band = (f: number): Band => (f < 50 ? "frost" : f > 85 ? "sodium" : "mild");
