import { get, set, keys } from "idb-keyval";

// Stocke des données personnalisées par recette (ex: prix estimé) en local,
// séparément des photos. Rien n'est envoyé sur un serveur.

const keyFor = (recipeId) => `meta:${recipeId}`;

export async function saveRecipeMeta(recipeId, meta) {
  await set(keyFor(recipeId), meta);
}

export async function getRecipeMeta(recipeId) {
  return (await get(keyFor(recipeId))) || {};
}

export async function getAllMeta() {
  const all = await keys();
  const metaKeys = all.filter((k) => typeof k === "string" && k.startsWith("meta:"));
  const entries = await Promise.all(
    metaKeys.map(async (k) => [k.replace("meta:", ""), await get(k)])
  );
  return Object.fromEntries(entries);
}
