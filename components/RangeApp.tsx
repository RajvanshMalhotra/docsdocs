"use client";

import { useEffect, useState } from "react";
import { EVS } from "@/data/evs";
import { fmtTemp, predict } from "@/lib/range";
import { toQuery, type AppState } from "@/lib/state";
import { Scene } from "./Scene";
import { DistanceSign } from "./Sign";
import { RangeCurve } from "./RangeCurve";
import { SpecSheet } from "./SpecSheet";

export function RangeApp({ initial }: { initial: AppState }) {
  const [state, setState] = useState(initial);
  const { car, trim, tempF, unit } = state;
  const ev = EVS[car];

  // Keep the URL in step so any view can be bookmarked or shared.
  useEffect(() => {
    window.history.replaceState(null, "", `?${toQuery(state)}`);
  }, [state]);

  const update = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }));

  return (
    <>
      <Scene
        evs={EVS}
        car={car}
        trim={trim}
        tempF={tempF}
        unit={unit}
        onCar={(i) => update({ car: i, trim: EVS[i].best })}
        onTrim={(i) => update({ trim: i })}
        onTemp={(f) => update({ tempF: f })}
        onUnit={(u) => update({ unit: u })}
      />

      <div className="gutter">
        <div className="mx-auto grid max-w-[1180px] gap-24 pt-20">
          <section className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="grid content-start gap-5">
              <h2 className="m-0 text-3xl font-extrabold tracking-tight">All three at {fmtTemp(tempF, unit)}</h2>
              <DistanceSign
                rows={EVS.map((e, i) => {
                  const t = e.trims[e.best];
                  return {
                    place: e.name,
                    detail: `${t.name}, ${t.wheels}`,
                    miles: predict(t.epa, e.r32, tempF),
                    current: i === car,
                  };
                })}
              />
              <p className="m-0 max-w-[48ch] text-muted">
                Miles for each car&apos;s longest-range trim on standard wheels. The Model 3&apos;s heat pump is why it
                holds up best in the cold.
              </p>
            </div>
            <div className="grid content-start gap-5">
              <h2 className="m-0 text-3xl font-extrabold tracking-tight">
                {ev.name} {ev.trims[trim].name} from −20°F to 115°F
              </h2>
              <RangeCurve ev={ev} trim={ev.trims[trim]} tempF={tempF} unit={unit} />
            </div>
          </section>

          <section aria-labelledby="spec-h" className="grid gap-14">
            <div className="grid gap-3">
              <h2 id="spec-h" className="m-0 text-3xl font-extrabold tracking-tight">
                Every trim, every temperature
              </h2>
              <p className="m-0 max-w-[64ch] text-muted">
                EPA rating and predicted miles at five reference temperatures and yours. Your trim is highlighted.
              </p>
            </div>
            {EVS.map((e, i) => (
              <SpecSheet key={e.id} ev={e} selectedTrim={i === car ? trim : null} tempF={tempF} unit={unit} />
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
