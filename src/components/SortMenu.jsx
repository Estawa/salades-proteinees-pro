import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check, Star } from "lucide-react";

const OPTIONS = [
  { id: "default", label: "Ordre par défaut" },
  { id: "fav-first", label: "Favorites en premier", short: "Favorites d'abord" },
  { id: "rating-desc", label: "Mieux notées", short: "Mieux notées" },
  { id: "least-recent", label: "Pas faite depuis longtemps", short: "Pas faite récemment" },
  { id: "protein-desc", label: "Protéines : + au -" },
  { id: "protein-asc", label: "Protéines : - au +" },
  { id: "price-asc", label: "Prix : + économique" },
  { id: "price-desc", label: "Prix : + cher" },
  { id: "alpha", label: "Alphabétique" },
];

export default function SortMenu({
  value,
  onChange,
  favoritesOnly = false,
  onFavoritesOnlyChange,
  favoriteCount = 0,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = OPTIONS.find((o) => o.id === value) ?? OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${
          favoritesOnly
            ? "border-amber-400 text-gray-800 dark:text-gray-100"
            : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
        }`}
      >
        {favoritesOnly ? (
          <Star size={14} className="fill-amber-400 text-amber-400" />
        ) : (
          <ArrowUpDown size={14} />
        )}
        {current.short ?? current.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg z-20 overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-[11px] uppercase tracking-wide text-gray-400 font-medium">
            Afficher
          </p>
          <button
            onClick={() => {
              onFavoritesOnlyChange?.(!favoritesOnly);
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left active:bg-gray-100 dark:active:bg-gray-800"
          >
            <span className="flex items-center gap-2">
              <Star
                size={14}
                className={favoritesOnly ? "fill-amber-400 text-amber-400" : "text-gray-400"}
              />
              Mes favorites uniquement
              <span className="text-xs text-gray-400">({favoriteCount})</span>
            </span>
            {favoritesOnly && <Check size={14} />}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-800 mt-1" />
          <p className="px-3 pt-2.5 pb-1 text-[11px] uppercase tracking-wide text-gray-400 font-medium">
            Trier par
          </p>
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left active:bg-gray-100 dark:active:bg-gray-800"
            >
              {opt.label}
              {value === opt.id && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
