"use client";

import { useEffect, useState } from "react";
import { fmtTemp, MAX_F, MIN_F, toC, toF, type Unit } from "@/lib/range";
import { thermoGradient } from "@/lib/sky";

const PRESETS: [string, number][] = [
  ["Deep freeze", -4],
  ["Snow day", 20],
  ["Freezing", 32],
  ["Mild", 70],
  ["Heat wave", 100],
];

interface Props {
  tempF: number;
  unit: Unit;
  onTemp: (f: number) => void;
}

export function TempControl({ tempF, unit, onTemp }: Props) {
  const shown = Math.round(unit === "F" ? tempF : toC(tempF));
  // Keep a draft so typing "-" or clearing the field doesn't snap back mid-edit.
  const [draft, setDraft] = useState(String(shown));
  useEffect(() => setDraft(String(shown)), [shown]);

  const fromUnit = (v: number) => Math.min(MAX_F, Math.max(MIN_F, unit === "F" ? v : toF(v)));
  const min = unit === "F" ? MIN_F : Math.round(toC(MIN_F));
  const max = unit === "F" ? MAX_F : Math.round(toC(MAX_F));
  const step = (d: number) => onTemp(fromUnit(shown + d));

  return (
    <div className="grid gap-4">
      <label htmlFor="temp" className="text-base font-semibold">
        Outside temperature
      </label>
      <div className="flex items-center gap-4">
        <div className="flex items-start">
          <input
            id="temp"
            type="number"
            inputMode="numeric"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const v = parseFloat(e.target.value);
              if (!Number.isNaN(v)) onTemp(fromUnit(v));
            }}
            onBlur={() => setDraft(String(shown))}
            style={{ width: `${Math.max(1, draft.length) + 0.15}ch` }}
            className="temp-input rounded-md bg-transparent p-0 text-[clamp(3.5rem,9vw,6rem)] leading-[0.9] font-black tracking-tight tabular-nums outline-offset-4"
          />
          <span className="pt-2 text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold">°{unit}</span>
        </div>
        <div className="flex gap-2">
          {[
            [-1, "−", "Colder by one degree"],
            [1, "+", "Warmer by one degree"],
          ].map(([d, sym, label]) => (
            <button
              key={sym}
              type="button"
              aria-label={label as string}
              onClick={() => step(d as number)}
              className="on-sky-line on-sky-fill grid size-12 cursor-pointer place-items-center rounded-full text-2xl font-bold"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>
      <input
        id="temp-slider"
        type="range"
        aria-label="Temperature slider"
        min={min}
        max={max}
        step={1}
        value={Math.min(max, Math.max(min, shown))}
        onChange={(e) => onTemp(fromUnit(Number(e.target.value)))}
        className="thermo"
        style={{ ["--thermo" as string]: thermoGradient }}
      />
      <div className="flex flex-wrap gap-2" aria-label="Example conditions">
        {PRESETS.map(([name, f]) => (
          <button
            key={name}
            type="button"
            aria-pressed={Math.round(tempF) === f}
            onClick={() => onTemp(f)}
            className="on-sky-line cursor-pointer rounded-full px-3 pt-1.5 pb-1 text-sm font-semibold aria-pressed:border-transparent aria-pressed:bg-sign aria-pressed:text-white"
          >
            {name}, {fmtTemp(f, unit)}
          </button>
        ))}
      </div>
    </div>
  );
}
