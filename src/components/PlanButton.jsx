import { ShoppingCart, Check } from "lucide-react";

// Ajoute / met à jour / retire la salade de la liste de courses, avec le nombre
// de portions choisi juste au-dessus.
export default function PlanButton({ planned, servings, onAdd, onRemove }) {
  if (planned == null) {
    return (
      <button
        onClick={() => onAdd(servings)}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 text-sm font-medium active:scale-[0.98] transition"
      >
        <ShoppingCart size={16} />
        Ajouter à ma liste de courses ({servings} portion{servings > 1 ? "s" : ""})
      </button>
    );
  }
  return (
    <div className="flex gap-2">
      <div className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
        <Check size={16} />
        Dans la liste ({planned} portion{planned > 1 ? "s" : ""})
      </div>
      {planned !== servings && (
        <button
          onClick={() => onAdd(servings)}
          className="px-3 rounded-lg border border-gray-300 dark:border-gray-700 text-sm active:scale-[0.98] transition"
        >
          Passer à {servings}
        </button>
      )}
      <button
        onClick={onRemove}
        className="px-3 rounded-lg border border-gray-300 dark:border-gray-700 text-sm active:scale-[0.98] transition"
      >
        Retirer
      </button>
    </div>
  );
}
