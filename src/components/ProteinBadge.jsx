import { Dumbbell } from "lucide-react";

export default function ProteinBadge({ grams, size = "md" }) {
  const sizes = {
    sm: "text-base px-2.5 py-1 gap-1",
    md: "text-lg px-3 py-1.5 gap-1.5",
    lg: "text-3xl px-5 py-3 gap-2",
  };

  if (grams == null) return null;

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold shadow-md ${sizes[size]}`}
    >
      <Dumbbell className={size === "lg" ? "w-7 h-7" : "w-4 h-4"} strokeWidth={2.5} />
      <span>{grams} g</span>
      {size === "lg" && <span className="text-sm font-medium opacity-80 ml-1">de protéines / portion</span>}
    </div>
  );
}
