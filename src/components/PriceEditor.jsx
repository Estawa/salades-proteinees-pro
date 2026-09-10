import { useState } from "react";
import { Euro, Pencil, Check } from "lucide-react";

export default function PriceEditor({ price, onPriceChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(price ?? "");

  const save = () => {
    const num = parseFloat(String(draft).replace(",", "."));
    onPriceChange(Number.isFinite(num) ? num : null);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Euro size={16} className="text-gray-500" />
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Prix total (€)"
          className="w-24 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
        />
        <button
          onClick={save}
          className="p-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          aria-label="Valider le prix"
        >
          <Check size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
    >
      <Euro size={16} />
      {price != null ? (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {price.toFixed(2)} € au total
        </span>
      ) : (
        <span className="italic">Ajouter un prix estimé</span>
      )}
      <Pencil size={12} />
    </button>
  );
}
