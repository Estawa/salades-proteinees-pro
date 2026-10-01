import { get, set } from "idb-keyval";
import { scaleAmount, formatAmount } from "./scaling";

// Liste de courses : les salades choisies pour la semaine (id -> nombre de portions)
// et les articles déjà cochés. Tout reste sur l'appareil (IndexedDB).

const PLAN_KEY = "plan";
const CHECKED_KEY = "shoppingChecked";

export async function getPlan() {
  return (await get(PLAN_KEY)) || {};
}
export async function savePlan(plan) {
  await set(PLAN_KEY, plan);
}
export async function getChecked() {
  return (await get(CHECKED_KEY)) || {};
}
export async function saveChecked(checked) {
  await set(CHECKED_KEY, checked);
}

const normalize = (s) => s.trim().toLowerCase();

// Additionne les ingrédients identiques (même nom + même unité) des salades choisies.
export function buildShoppingList(plan, recipes) {
  const map = new Map();
  for (const [id, servings] of Object.entries(plan)) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const key = `${normalize(ing.name)}|${ing.unit || ""}`;
      const qty = scaleAmount(ing.amount, recipe.baseServings, servings) ?? 0;
      const item = map.get(key) || {
        key,
        name: ing.name,
        unit: ing.unit || "",
        amount: 0,
        recipes: [],
      };
      item.amount = Math.round((item.amount + qty) * 10) / 10;
      if (!item.recipes.includes(recipe.title)) item.recipes.push(recipe.title);
      map.set(key, item);
    }
  }
  // Les articles à l'unité (concombre, œufs…) s'achètent entiers : arrondi au-dessus
  for (const item of map.values()) {
    if (!item.unit) item.amount = Math.ceil(item.amount - 0.05);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export function formatShoppingItem(item) {
  const unit = item.unit ? ` ${item.unit}` : "";
  return `${formatAmount(item.amount)}${unit} ${item.name}`.trim();
}

export function buildShoppingText(items, plan, recipes) {
  const chosen = Object.entries(plan)
    .map(([id, n]) => {
      const r = recipes.find((x) => x.id === id);
      return r ? `- ${r.title} (${n} portion${n > 1 ? "s" : ""})` : null;
    })
    .filter(Boolean);
  return [
    "Liste de courses — Salades Pro",
    "",
    "Salades :",
    ...chosen,
    "",
    "À acheter :",
    ...items.map((it) => `☐ ${formatShoppingItem(it)}`),
  ].join("\n");
}
