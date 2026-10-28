"use client";

import type { EV } from "@/data/evs";
import { fmtTemp, retention, type Unit } from "@/lib/range";
import { inkOn, skyAt } from "@/lib/sky";
import { useTweened } from "@/lib/useTweened";
import { Road } from "./Road";
import { SignPlate } from "./Sign";
import { Snow } from "./Snow";
import { TempControl } from "./TempControl";

interface Props {
  evs: EV[];
  car: number;
  trim: number;
  tempF: number;
  unit: Unit;
  onCar: (i: number) => void;
  onTrim: (i: number) => void;
  onTemp: (f: number) => void;
  onUnit: (u: Unit) => void;
}

/** The hero: a sky that takes the temperature's color, a sign with the answer, and the road drawn to scale. */
export function Scene({ evs, car, trim, tempF, unit, onCar, onTrim, onTemp, onUnit }: Props) {
  const ev = evs[car];
  const t = ev.trims[trim];
  const ret = retention(ev.r32, tempF);
  const miles = Math.round(t.epa * ret);
  const shown = Math.round(useTweened(miles));
  const lost = t.epa - miles;
  const cause = tempF < 65 ? "the cold" : "the heat";
  const snow = tempF < 32 ? Math.min(1, (32 - tempF) / 52) : 0;

  return (
    <header
      className="relative overflow-hidden transition-[background-color,color] duration-700"
      style={{ backgroundColor: skyAt(tempF), color: inkOn(tempF) }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-white/30" />
      <Snow intensity={snow} />

      <div className="gutter relative">
        <div className="mx-auto max-w-[1180px] pt-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="m-0 text-lg font-extrabold tracking-tight">Range by Weather</h1>
            <div role="group" aria-label="Temperature unit" className="on-sky-line flex overflow-hidden rounded-full">
              {(["F", "C"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  onClick={() => onUnit(u)}
                  className="cursor-pointer px-3.5 pt-1.5 pb-1 text-sm font-bold aria-pressed:bg-sign aria-pressed:text-white"
                >
                  °{u}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-x-16 gap-y-12 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-end">
            <div className="grid gap-9">
              <p className="m-0 max-w-[16ch] text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-extrabold tracking-tight">
                How far will your EV go in this weather?
              </p>

              <div className="grid gap-3">
                <div role="group" aria-label="Vehicle" className="flex flex-wrap gap-2">
                  {evs.map((e, i) => (
                    <button
                      key={e.id}
                      type="button"
                      aria-pressed={i === car}
                      onClick={() => onCar(i)}
                      className="on-sky-line on-sky-fill cursor-pointer rounded-lg px-4 pt-2.5 pb-2 text-base font-bold aria-pressed:border-transparent aria-pressed:bg-sign aria-pressed:text-white"
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
                <label htmlFor="trim" className="sr-only">
                  Trim and wheels
                </label>
                <select
                  id="trim"
                  value={trim}
                  onChange={(e) => onTrim(Number(e.target.value))}
                  className="on-sky-line w-full max-w-md cursor-pointer rounded-lg bg-transparent px-3 pt-2.5 pb-2 font-semibold [&_option]:text-[#1f2328]"
                >
                  {ev.trims.map((tr, i) => (
                    <option key={i} value={i}>
                      {ev.year} {tr.name}, {tr.wheels} wheels ({tr.epa} mi EPA)
                    </option>
                  ))}
                </select>
              </div>

              <TempControl tempF={tempF} unit={unit} onTemp={onTemp} />
            </div>

            <div aria-live="polite" className="grid justify-items-stretch">
              <SignPlate>
                <div className="flex items-end justify-between gap-6 px-6 pt-5 pb-4 sm:px-8">
                  <div className="min-w-0 pb-2">
                    <div className="text-2xl leading-tight font-bold sm:text-3xl">{ev.name}</div>
                    <div className="text-base text-white/80">
                      {t.name}, {t.wheels}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[clamp(4.5rem,11vw,8rem)] leading-[0.85] font-black tracking-tight tabular-nums">
                      {shown}
                    </div>
                    <div className="text-lg font-bold">
                      miles{unit === "C" && <span className="font-semibold text-white/80">, {Math.round(miles * 1.609)} km</span>}
                    </div>
                  </div>
                </div>
              </SignPlate>
              {/* Supplemental plate under the main sign, as on a real gantry. */}
              <SignPlate className="mx-auto mt-2 w-fit max-w-full !rounded-xl !p-1.5">
                <p className="m-0 px-4 pt-2 pb-1.5 text-center text-sm font-semibold sm:text-base">
                  {lost > 0
                    ? `At ${fmtTemp(tempF, unit)}: ${Math.round(ret * 100)}% of the ${t.epa} mi EPA rating, ${lost} mi lost to ${cause}`
                    : `At ${fmtTemp(tempF, unit)}: the full ${t.epa} mi EPA rating`}
                </p>
              </SignPlate>
              <div aria-hidden className="mx-auto flex h-10 w-3/5 justify-between">
                <span className="w-2.5 bg-post" />
                <span className="w-2.5 bg-post" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Road predicted={miles} epa={t.epa} tempF={tempF} />
    </header>
  );
}
