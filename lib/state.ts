import { EVS } from "@/data/evs";
import { MAX_F, MIN_F, type Unit } from "@/lib/range";

export interface AppState {
  car: number;
  trim: number;
  tempF: number;
  unit: Unit;
}

export const DEFAULT_STATE: AppState = { car: 0, trim: EVS[0].best, tempF: 20, unit: "F" };

type Params = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Reads ?car=r1t&trim=2&t=20&unit=C, falling back to defaults for anything missing or invalid. */
export function parseState(params: Params): AppState {
  const carIdx = EVS.findIndex((e) => e.id === first(params.car));
  const car = carIdx >= 0 ? carIdx : DEFAULT_STATE.car;

  const trimRaw = Number(first(params.trim));
  const trim =
    Number.isInteger(trimRaw) && trimRaw >= 0 && trimRaw < EVS[car].trims.length ? trimRaw : EVS[car].best;

  const tRaw = Number(first(params.t));
  const tempF = Number.isFinite(tRaw) && first(params.t) !== "" ? Math.min(MAX_F, Math.max(MIN_F, tRaw)) : DEFAULT_STATE.tempF;

  const unit: Unit = first(params.unit) === "C" ? "C" : "F";
  return { car, trim, tempF, unit };
}

export function toQuery({ car, trim, tempF, unit }: AppState): string {
  const q = new URLSearchParams({ car: EVS[car].id, trim: String(trim), t: String(Math.round(tempF)) });
  if (unit === "C") q.set("unit", "C");
  return q.toString();
}
