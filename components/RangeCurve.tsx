import type { EV, Trim } from "@/data/evs";
import { fmtTemp, MAX_F, MIN_F, retention, type Unit } from "@/lib/range";
import { SKY_STOPS } from "@/lib/sky";

const W = 640, H = 280, L = 40, R = 12, T = 16, B = 32;
const TICKS = [-20, 0, 32, 50, 70, 90, 115];

interface Props {
  ev: EV;
  trim: Trim;
  tempF: number;
  unit: Unit;
}

/** Range across temperatures; the fill uses the page's sky scale along the temperature axis. */
export function RangeCurve({ ev, trim, tempF, unit }: Props) {
  const x = (f: number) => L + ((f - MIN_F) / (MAX_F - MIN_F)) * (W - L - R);
  const maxY = Math.ceil(trim.epa / 50) * 50;
  const y = (m: number) => T + (1 - m / maxY) * (H - T - B);

  let line = "";
  for (let f = MIN_F; f <= MAX_F; f++) {
    line += `${f === MIN_F ? "M" : "L"}${x(f).toFixed(1)},${y(trim.epa * retention(ev.r32, f)).toFixed(1)}`;
  }
  const area = `${line}L${x(MAX_F)},${y(0)}L${x(MIN_F)},${y(0)}Z`;
  const f = Math.max(MIN_F, Math.min(MAX_F, tempF));
  const m = trim.epa * retention(ev.r32, f);
  const grid = Array.from({ length: maxY / 50 + 1 }, (_, i) => i * 50);

  return (
    <figure className="m-0 min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Predicted range across temperatures" className="block h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="sky-fill" gradientUnits="userSpaceOnUse" x1={x(MIN_F)} x2={x(MAX_F)} y1="0" y2="0">
            {SKY_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        {grid.map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="var(--rule)" />
            <text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize={12} fill="var(--muted)">{g}</text>
          </g>
        ))}
        {TICKS.map((tk) => (
          <text key={tk} x={x(tk)} y={H - 8} textAnchor="middle" fontSize={12} fill="var(--muted)">
            {fmtTemp(tk, unit)}
          </text>
        ))}
        <path d={area} fill="url(#sky-fill)" opacity={0.85} />
        <path d={line} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
        <line x1={L} x2={W - R} y1={y(trim.epa)} y2={y(trim.epa)} stroke="var(--ink)" strokeDasharray="3 4" opacity={0.6} />
        <text x={W - R} y={y(trim.epa) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill="var(--ink)">EPA {trim.epa} mi</text>
        <line x1={x(f)} x2={x(f)} y1={y(m)} y2={y(0)} stroke="var(--ink)" strokeWidth={1.5} />
        <circle cx={x(f)} cy={y(m)} r={7} fill="var(--sign)" stroke="var(--paper)" strokeWidth={3} />
        <text x={x(f) + (f > 80 ? -12 : 12)} y={y(m) - 10} textAnchor={f > 80 ? "end" : "start"} fontSize={13} fontWeight={800} fill="var(--ink)" stroke="var(--paper)" strokeWidth={4} paintOrder="stroke">
          {Math.round(m)} mi
        </text>
      </svg>
    </figure>
  );
}
