import type { ReactNode } from "react";
import type { EV } from "@/data/evs";
import { fmtTemp, predict, type Unit } from "@/lib/range";
import { skyAt } from "@/lib/sky";

const COLS = [-4, 20, 32, 70, 100];

interface Props {
  ev: EV;
  selectedTrim: number | null;
  tempF: number;
  unit: Unit;
}

export function SpecSheet({ ev, selectedTrim, tempF, unit }: Props) {
  return (
    <article className="grid gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-4 border-ink pb-2">
        <h3 className="m-0 text-2xl font-extrabold tracking-tight">
          {ev.year} {ev.name}
        </h3>
        <span className="text-muted">{ev.trims.length} trims</span>
      </div>
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-8 gap-y-4">
        {ev.facts.map(([k, v]) => (
          <div key={k} className="grid">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="m-0 font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.95rem] tabular-nums">
          <thead>
            <tr className="text-sm text-muted">
              <Th left>Trim</Th>
              <Th>Wheels</Th>
              <Th>EPA</Th>
              {COLS.map((c) => (
                <Th key={c}>
                  <Swatch f={c} />
                  {fmtTemp(c, unit)}
                </Th>
              ))}
              <Th>
                <Swatch f={tempF} />
                Yours, {fmtTemp(tempF, unit)}
              </Th>
            </tr>
          </thead>
          <tbody>
            {ev.trims.map((t, i) => (
              <tr key={i} className={i === selectedTrim ? "bg-lane/25" : undefined}>
                <Td left>
                  <span className="font-bold">{t.name}</span>
                  {t.note && <span className="block text-sm text-muted">{t.note}</span>}
                </Td>
                <Td>{t.wheels}</Td>
                <Td>{t.epa}</Td>
                {COLS.map((c) => (
                  <Td key={c}>{predict(t.epa, ev.r32, c)}</Td>
                ))}
                <Td className="font-extrabold">{predict(t.epa, ev.r32, tempF)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function Swatch({ f }: { f: number }) {
  return (
    <span
      aria-hidden
      className="mr-1.5 inline-block size-2.5 rounded-full align-[0.05em] ring-1 ring-black/15"
      style={{ backgroundColor: skyAt(f) }}
    />
  );
}

const cell = "whitespace-nowrap border-b border-rule px-3 pt-2.5 pb-2";

function Th({ children, left }: { children: ReactNode; left?: boolean }) {
  return <th className={`${cell} align-bottom font-semibold ${left ? "text-left" : "text-right"}`}>{children}</th>;
}
function Td({ children, left, className = "" }: { children: ReactNode; left?: boolean; className?: string }) {
  return <td className={`${cell} ${left ? "text-left" : "text-right"} ${className}`}>{children}</td>;
}
