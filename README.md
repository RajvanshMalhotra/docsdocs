# Range by Weather

Pick a Tesla Model 3, Rivian R1T or Chevy Bolt, enter the outside temperature, and see the predicted battery range.
Built with Next.js (App Router), React 19, TypeScript and Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Deploy to Vercel

Either:

- Push this folder to a GitHub repo, then import it at <https://vercel.com/new>. Vercel detects Next.js; no settings or
  environment variables are needed.
- Or from this folder: `npx vercel` (preview) and `npx vercel --prod` (production).

## How it works

| Path | What it holds |
| --- | --- |
| `data/evs.ts` | Every trim's EPA range, spec facts, freezing-range retention, and source links |
| `lib/range.ts` | The prediction model (pure functions) |
| `lib/state.ts` | Reads and writes the shareable URL (`?car=r1t&trim=2&t=20&unit=C`) |
| `components/` | Picker, temperature control, readout, range curve, comparison, spec sheets, method notes |
| `app/` | Layout, fonts, metadata, page (server-rendered from the URL) |

**Model.** EPA combined range is treated as mild-weather range. At 32°F each car keeps the share Recurrent measured
across 18,000+ vehicles (Model 3 with heat pump 87%, R1T 81%, Bolt 69%). Below freezing, losses compound: retention is
that figure raised to a power rising to 2.4 at −4°F and 3 at −20°F. Above 75°F, cooling costs about 3% at 85°F, 9% at
95°F and 16% at 105°F. See the method section on the page for caveats and sources.

Data checked October 2026.
