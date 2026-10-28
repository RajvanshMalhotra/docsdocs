import { SOURCES } from "@/data/evs";

const POINTS: [string, string][] = [
  ["Starting point", "Each trim's EPA combined range, treated as its range in mild weather (about 65–77°F)."],
  [
    "At freezing",
    "Recurrent's winter study of 18,000+ cars measured the share of mild-weather range each model keeps at 32°F and below: Model 3 with heat pump 87%, R1T 81%, Bolt 69%.",
  ],
  [
    "Colder than that",
    "Losses compound. Retention is the freezing figure raised to a power that rises from 1 at 32°F to 2.4 at −4°F and 3 at −20°F, following the shape of AAA and Geotab cold-weather curves.",
  ],
  [
    "In the heat",
    "Air conditioning and battery cooling cost about 3% at 85°F, 9% at 95°F and 16% at 105°F, between Geotab's fleet data and AAA's lab worst case of 17% at 95°F.",
  ],
  [
    "What it can't see",
    "Speed, wind, cabin temperature, preconditioning, tire pressure and battery age all change real range. Treat results as a planning estimate within about 10%.",
  ],
  [
    "Likely conservative",
    "Recurrent's Bolt figure comes from the 2017–2023 model; the 2027 Bolt has a new LFP pack and went 290 miles in Edmunds' mild-weather test. Gen 2 R1Ts added a heat pump.",
  ],
];

export function Method() {
  return (
    <div className="gutter">
      <section
        aria-labelledby="m-h"
        className="mx-auto mt-24 grid max-w-[1180px] gap-x-16 gap-y-8 border-t-4 border-ink pt-10 pb-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
      >
        <div className="grid content-start gap-3">
          <h2 id="m-h" className="m-0 text-3xl font-extrabold tracking-tight">
            How the prediction works
          </h2>
          <p className="m-0 text-muted">Data checked October 2026.</p>
        </div>
        <div className="grid gap-8">
          <dl className="m-0 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {POINTS.map(([head, body]) => (
              <div key={head}>
                <dt className="text-lg font-extrabold">{head}</dt>
                <dd className="m-0 max-w-[52ch] text-muted">{body}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="m-0 mb-2 text-lg font-extrabold">Sources</h3>
            <ul className="m-0 grid list-none gap-1 p-0 sm:grid-cols-2">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="font-semibold text-ink underline decoration-lane decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
