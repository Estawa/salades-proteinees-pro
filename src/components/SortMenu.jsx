import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check } from "lucide-react";

const OPTIONS = [
  { id: "default", label: "Ordre par défaut" },
  { id: "protein-desc", label: "Protéines : + au -" },
  { id: "protein-asc", label: "Protéines : - au +" },
  { id: "price-asc", label: "Prix : + économique" },
  { id: "price-desc", label: "Prix : + cher" },
  { id: "alpha", label: "Alphabétique" },
];

export default function SortMenu({ value, onChange }) {
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 whitespace-nowrap"
      >
        <ArrowUpDown size={14} />
        {current.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg z-20 overflow-hidden">
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
