import type { ReactNode } from "react";

/** A green highway guide sign. */
export function SignPlate({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sign-plate ${className}`}>
      <div className="sign-face">{children}</div>
    </div>
  );
}

export interface SignRow {
  place: string;
  detail?: string;
  miles: number;
  current?: boolean;
}

/** A distance sign: one line per destination, miles flush right, as on a real highway sign. */
export function DistanceSign({ rows }: { rows: SignRow[] }) {
  return (
    <SignPlate>
      <ul className="m-0 grid list-none gap-3 px-5 py-4 sm:px-7 sm:py-5">
        {rows.map((r) => (
          <li key={r.place} className="flex items-baseline justify-between gap-6">
            <span className="min-w-0">
              <span className={`block text-xl font-bold sm:text-2xl ${r.current ? "underline decoration-lane decoration-4 underline-offset-[6px]" : ""}`}>
                {r.place}
              </span>
              {r.detail && <span className="block text-sm text-white/75">{r.detail}</span>}
            </span>
            <span className="text-3xl font-extrabold tabular-nums sm:text-4xl">{r.miles}</span>
          </li>
        ))}
      </ul>
    </SignPlate>
  );
}
