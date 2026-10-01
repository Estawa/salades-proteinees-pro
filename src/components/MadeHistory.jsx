import { useState } from "react";
import { CalendarCheck, X } from "lucide-react";
import { todayISO, formatDateFr, formatDaysAgo } from "../utils/dates";

// Historique "Déjà faite" : une date par préparation.
export default function MadeHistory({ dates = [], onChange }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...dates].sort().reverse();
  const today = todayISO();
  const doneToday = dates.includes(today);
  const visible = showAll ? sorted : sorted.slice(0, 3);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm">
          <p className="font-medium">Déjà faite</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {sorted.length === 0
              ? "Jamais préparée pour l'instant"
              : `${sorted.length} fois · dernière ${formatDaysAgo(sorted[0])}`}
          </p>
        </div>
        <button
          onClick={() => !doneToday && onChange([...dates, today])}
          disabled={doneToday}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${
            doneToday
              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          }`}
        >
          <CalendarCheck size={16} />
          {doneToday ? "Faite aujourd'hui" : "Je l'ai faite"}
        </button>
      </div>

      {sorted.length > 0 && (
        <ul className="mt-2 space-y-1">
          {visible.map((d) => (
            <li
              key={d}
              className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300"
            >
              <span className="capitalize">{formatDateFr(d)}</span>
              <button
                onClick={() => onChange(dates.filter((x) => x !== d))}
                className="p-1 rounded-full text-gray-400 active:bg-gray-100 dark:active:bg-gray-800"
                aria-label={`Supprimer la date ${formatDateFr(d)}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {sorted.length > 3 && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-1 text-xs text-gray-500 dark:text-gray-400 underline underline-offset-2"
        >
          {showAll ? "Réduire" : `Voir les ${sorted.length} dates`}
        </button>
      )}
    </div>
  );
}
