import Link from "next/link";
import BestRecordSummary from "@/components/BestRecordSummary";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#071013] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">
            NFL Perfect Season Draft Game
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-normal text-white sm:text-7xl">
            Draft 8 players. Build a perfect NFL roster. Try to go{" "}
            <span className="whitespace-nowrap">17-0.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Build a compact star roster, watch the season simulation unfold,
            and chase the kind of perfect run that defines a dynasty.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/draft"
              className="rounded-md bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-emerald-300"
            >
              Start Draft
            </Link>
            <Link
              href="/results"
              className="rounded-md border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/10"
            >
              View Results
            </Link>
          </div>
          <BestRecordSummary />
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            ["8", "draft picks"],
            ["17", "game target"],
            ["0", "losses allowed"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="border-l-4 border-emerald-400 bg-white/[0.06] p-5"
            >
              <div className="text-4xl font-black text-white">{value}</div>
              <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-300">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
