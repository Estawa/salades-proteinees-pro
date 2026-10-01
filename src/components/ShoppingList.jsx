import { useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, Share2, Copy, Check, ShoppingCart, X } from "lucide-react";
import { buildShoppingList, formatShoppingItem, buildShoppingText } from "../utils/shopping";

export default function ShoppingList({
  recipes,
  plan,
  onPlanChange,
  checked,
  onCheckedChange,
  onOpenRecipe,
  onBack,
}) {
  const [copied, setCopied] = useState(false);
  const [hideChecked, setHideChecked] = useState(false);
  const items = useMemo(() => buildShoppingList(plan, recipes), [plan, recipes]);
  const chosen = Object.entries(plan)
    .map(([id, n]) => ({ recipe: recipes.find((r) => r.id === id), servings: n }))
    .filter((x) => x.recipe);

  const doneCount = items.filter((it) => checked[it.key]).length;
  const text = buildShoppingText(
    items.filter((it) => !checked[it.key]),
    plan,
    recipes
  );

  const setServings = (id, n) => onPlanChange({ ...plan, [id]: Math.max(1, n) });
  const remove = (id) => {
    const next = { ...plan };
    delete next[id];
    onPlanChange(next);
  };
  const toggle = (key) => onCheckedChange({ ...checked, [key]: !checked[key] });

  const clearAll = () => {
    if (window.confirm("Vider la liste de courses (salades et articles cochés) ?")) {
      onPlanChange({});
      onCheckedChange({});
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Liste de courses", text });
      } catch {
        /* annulé */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-10">
      <div className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold flex-1">Liste de courses</h2>
        {chosen.length > 0 && (
          <button
            onClick={clearAll}
            className="p-2 rounded-full text-gray-500 active:bg-gray-200 dark:active:bg-gray-800"
            aria-label="Vider la liste"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {chosen.length === 0 ? (
        <div className="px-6 pt-16 text-center text-gray-500 dark:text-gray-400">
          <ShoppingCart size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
          <p className="font-medium text-gray-700 dark:text-gray-200">Liste vide</p>
          <p className="text-sm mt-1">
            Ouvrez une salade et touchez « Ajouter à ma liste de courses ». Les ingrédients
            de toutes les salades choisies seront additionnés ici.
          </p>
        </div>
      ) : (
        <div className="px-4 pt-4">
          <section>
            <h3 className="font-semibold mb-2">Salades choisies ({chosen.length})</h3>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {chosen.map(({ recipe, servings }) => (
                <div key={recipe.id} className="flex items-center gap-2 px-3 py-2">
                  <button
                    onClick={() => onOpenRecipe(recipe.id)}
                    className="flex-1 text-left text-sm font-medium leading-snug"
                  >
                    {recipe.title}
                  </button>
                  <button
                    onClick={() => setServings(recipe.id, servings - 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"
                    aria-label="Moins de portions"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{servings}</span>
                  <button
                    onClick={() => setServings(recipe.id, servings + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"
                    aria-label="Plus de portions"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => remove(recipe.id)}
                    className="p-1 text-gray-400"
                    aria-label={`Retirer ${recipe.title}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">
                À acheter{" "}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({doneCount}/{items.length} cochés)
                </span>
              </h3>
              {doneCount > 0 && (
                <button
                  onClick={() => setHideChecked((h) => !h)}
                  className="text-xs text-gray-500 dark:text-gray-400 underline underline-offset-2"
                >
                  {hideChecked ? "Afficher les cochés" : "Masquer les cochés"}
                </button>
              )}
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {items
                .filter((it) => !(hideChecked && checked[it.key]))
                .map((it, i) => {
                  const on = !!checked[it.key];
                  return (
                    <label
                      key={it.key}
                      className={`flex items-start gap-3 px-3 py-2 text-sm cursor-pointer ${
                        i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-950"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(it.key)}
                        className="mt-0.5 w-4 h-4 accent-gray-900 dark:accent-white shrink-0"
                      />
                      <span className={on ? "line-through text-gray-400" : ""}>
                        {formatShoppingItem(it)}
                        {it.recipes.length > 1 && (
                          <span className="block text-[11px] text-gray-400">
                            {it.recipes.length} salades
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
            </div>
          </section>

          <div className="flex gap-2 mt-4">
            <button
              onClick={share}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg py-2.5 text-sm font-medium active:scale-[0.98] transition"
            >
              <Share2 size={16} />
              Partager la liste
            </button>
            <button
              onClick={copy}
              className="w-11 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg active:scale-[0.98] transition"
              aria-label="Copier la liste"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Le partage n'envoie que les articles pas encore cochés.
          </p>
        </div>
      )}
    </div>
  );
}
