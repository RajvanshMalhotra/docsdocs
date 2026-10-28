import { groundAt } from "@/lib/sky";

/** The road is drawn to scale: 0 to ROAD_MAX miles across the full width. */
export const ROAD_MAX = 450;
const MARKERS = [50, 100, 150, 200, 250, 300, 350, 400];
const pct = (mi: number) => `${(Math.min(mi, ROAD_MAX) / ROAD_MAX) * 100}%`;

interface Props {
  predicted: number;
  epa: number;
  tempF: number;
}

export function Road({ predicted, epa, tempF }: Props) {
  const lost = epa - predicted;

  return (
    <div className="relative" role="img" aria-label={`Road drawn to scale: the car stops at ${predicted} miles; the EPA rating is ${epa} miles.`}>
      {/* Mile posts and the EPA flag stand on the shoulder above the road. */}
      <div className="relative h-12">
        {MARKERS.map((m) => (
          <div
            key={m}
            className={`absolute bottom-0 flex -translate-x-1/2 flex-col items-center ${m % 100 ? "max-sm:hidden" : ""}`}
            style={{ left: pct(m) }}
          >
            <span className="rounded-[3px] border border-white bg-sign px-1.5 pt-0.5 text-[0.7rem] leading-tight font-bold text-white tabular-nums">
              {m}
            </span>
            <span className="h-3 w-[3px] bg-post" />
          </div>
        ))}
        <div className="absolute bottom-0 flex flex-col items-start" style={{ left: pct(epa) }}>
          <span className="-translate-x-[3px] rounded-r-[3px] bg-white px-1.5 pt-0.5 text-[0.7rem] leading-tight font-extrabold whitespace-nowrap text-asphalt">
            EPA {epa}
          </span>
          <span className="h-5 w-[3px] bg-white" />
        </div>
      </div>

      <div className="relative h-16 overflow-hidden bg-asphalt sm:h-20">
        <span className="absolute inset-x-0 top-2 h-[3px] bg-white/75" />
        <span className="road-dash absolute inset-x-0 top-1/2 h-1 -translate-y-1/2" />
        <span className="absolute inset-x-0 bottom-2 h-[3px] bg-white/75" />

        {lost > 0 && (
          <div
            className="lost-hatch absolute inset-y-0 flex items-center justify-center overflow-hidden"
            style={{ left: pct(predicted), width: `${(lost / ROAD_MAX) * 100}%` }}
          >
            <span className="rounded bg-asphalt/80 px-2 pt-0.5 text-xs font-bold whitespace-nowrap text-white tabular-nums">
              −{lost} mi
            </span>
          </div>
        )}

        {/* Full-width layer slid by a percentage of the road, so the car moves with a transform. */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${pct(predicted)})` }}
        >
          <Car className="absolute bottom-[14%] left-0 w-14 -translate-x-full sm:w-[72px]" />
        </div>
      </div>

      <div className="h-7 transition-colors duration-700" style={{ backgroundColor: groundAt(tempF) }} />
    </div>
  );
}

function Car({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 28" className={className} aria-hidden>
      <path d="M3 21V15Q5 11.5 13 10.5L21 4.5Q23 3 27 3H41Q45 3 48 5.5L53.5 10Q60 11 61.5 14.5V21Z" fill="#f4f4f2" />
      <path d="M23.5 6.2Q25 5 27.5 5H35V10H19.5Z" fill="#7f97ae" />
      <path d="M37 5H41Q44 5 46.5 7L50 10H37Z" fill="#7f97ae" />
      <rect x="58" y="13" width="3.5" height="2.5" rx="1" fill="#f2b705" />
      <circle cx="15" cy="21" r="5" fill="#141518" stroke="#f4f4f2" strokeWidth="2" />
      <circle cx="49" cy="21" r="5" fill="#141518" stroke="#f4f4f2" strokeWidth="2" />
    </svg>
  );
}
