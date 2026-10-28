import { RangeApp } from "@/components/RangeApp";
import { Method } from "@/components/Method";
import { parseState } from "@/lib/state";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const initial = parseState(await searchParams);

  return (
    <main>
      <RangeApp initial={initial} />
      <Method />
    </main>
  );
}
