import type { TeamGrades as TeamGradesData } from "@/types/team";

type TeamGradesProps = {
  grades?: TeamGradesData;
  variant?: "light" | "dark";
};

const gradeLabels: { key: keyof TeamGradesData; label: string }[] = [
  { key: "overallPower", label: "Overall Power" },
  { key: "passingOffense", label: "Passing Offense" },
  { key: "rushingOffense", label: "Rushing Offense" },
  { key: "redZoneOffense", label: "Red Zone Offense" },
  { key: "explosiveness", label: "Explosiveness" },
  { key: "clockControl", label: "Clock Control" },
  { key: "defense", label: "Defense" },
  { key: "specialTeams", label: "Special Teams" },
  { key: "clutch", label: "Clutch" },
  { key: "consistency", label: "Consistency" },
];

const placeholderGrades = [
  { label: "Offense", grade: "--" },
  { label: "Defense", grade: "--" },
  { label: "Depth", grade: "--" },
  { label: "Identity", grade: "--" },
];

function getLetterGrade(score: number) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 65) return "C";
  if (score >= 60) return "D";
  return "F";
}

export default function TeamGrades({
  grades,
  variant = "light",
}: TeamGradesProps) {
  const dark = variant === "dark";
  const displayedGrades = grades
    ? gradeLabels.map((grade) => ({
        label: grade.label,
        score: grades[grade.key],
        grade: grades[grade.key].toFixed(1),
        letterGrade: getLetterGrade(grades[grade.key]),
      }))
    : placeholderGrades.map((grade) => ({
        ...grade,
        score: undefined,
        letterGrade: undefined,
      }));

  return (
    <section
      className={`rounded-lg p-5 shadow-sm ${
        dark ? "bg-white/[0.06] text-white" : "bg-white text-slate-950"
      }`}
    >
      <h2 className="text-lg font-black">Team Grades</h2>
      <div
        className={
          grades
            ? "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            : "mt-4 space-y-3"
        }
      >
        {displayedGrades.map((item) => (
          <div
            key={item.label}
            className={`rounded-md border px-3 py-3 ${
              dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <span
              className={`block text-xs font-bold uppercase tracking-wide ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {item.label}
            </span>
            <div className="mt-2 flex items-end justify-between gap-2">
              <span className="block text-2xl font-black text-emerald-400">
                {item.grade}
              </span>
              {item.letterGrade ? (
                <span className="rounded-md bg-emerald-300/10 px-2 py-1 text-sm font-black text-emerald-300">
                  {item.letterGrade}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
