import { get, set, keys } from "idb-keyval";

// Sauvegarde / restauration de toutes les données perso de l'appli
// (favorites, notes, prix, historique, photos, liste de courses) dans un fichier .json,
// pour ne rien perdre en changeant de téléphone.

const APP_ID = "salades-pro";

const isOurKey = (k) =>
  typeof k === "string" &&
  (k.startsWith("photo:") || k.startsWith("meta:") || k === "plan" || k === "shoppingChecked");

export async function exportBackup() {
  const all = (await keys()).filter(isOurKey);
  const data = {};
  for (const k of all) data[k] = await get(k);
  const payload = {
    app: APP_ID,
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  const json = JSON.stringify(payload);
  const date = new Date().toISOString().slice(0, 10);
  const fileName = `salades-pro-sauvegarde-${date}.json`;
  const file = new File([json], fileName, { type: "application/json" });

  // Sur téléphone : feuille de partage (Enregistrer dans Fichiers, Drive, mail…)
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Sauvegarde Salades Pro" });
      return { shared: true, count: all.length };
    } catch (e) {
      if (e?.name === "AbortError") return { cancelled: true };
      // sinon on tente le téléchargement classique
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { downloaded: true, count: all.length };
}

export async function importBackup(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Ce fichier n'est pas une sauvegarde valide.");
  }
  if (payload?.app !== APP_ID || typeof payload.data !== "object") {
    throw new Error("Ce fichier n'est pas une sauvegarde Salades Pro.");
  }
  const entries = Object.entries(payload.data).filter(([k]) => isOurKey(k));
  for (const [k, v] of entries) await set(k, v);
  return entries.length;
}

export async function getBackupStats() {
  const all = (await keys()).filter(isOurKey);
  return {
    photos: all.filter((k) => k.startsWith("photo:")).length,
    recipes: all.filter((k) => k.startsWith("meta:")).length,
  };
}
