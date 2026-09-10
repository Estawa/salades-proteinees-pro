// Ajuste une quantité d'ingrédient selon le nombre de portions désiré,
// avec un arrondi lisible (évite les 3.33333 g).
export function scaleAmount(amount, baseServings, desiredServings) {
  if (amount == null) return null;
  const scaled = (amount * desiredServings) / baseServings;
  // Arrondi à 1 décimale, en enlevant le .0 inutile
  const rounded = Math.round(scaled * 10) / 10;
  return rounded;
}

export function formatAmount(amount) {
  if (amount == null) return "";
  return Number.isInteger(amount) ? String(amount) : String(amount).replace(".", ",");
}

export function formatIngredientLine(ing, baseServings, desiredServings) {
  const scaled = scaleAmount(ing.amount, baseServings, desiredServings);
  const amountStr = formatAmount(scaled);
  const unitStr = ing.unit ? ` ${ing.unit}` : "";
  return `${amountStr}${unitStr} ${ing.name}`.trim();
}

export function buildShareText(recipe, desiredServings) {
  const lines = [
    `${recipe.title} — ${desiredServings} portion${desiredServings > 1 ? "s" : ""}`,
    "",
    "Ingrédients :",
    ...recipe.ingredients.map(
      (ing) => `- ${formatIngredientLine(ing, recipe.baseServings, desiredServings)}`
    ),
    "",
    "Préparation :",
    ...recipe.steps.map((s, i) => `${i + 1}. ${s}`),
  ];
  return lines.join("\n");
}
