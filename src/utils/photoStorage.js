import { get, set, del, keys } from "idb-keyval";

// Chaque photo est stockée localement sur l'appareil (IndexedDB),
// indexée par l'id de la recette. Rien n'est envoyé sur un serveur :
// la photo prise avec le téléphone reste sur le téléphone.

const keyFor = (recipeId) => `photo:${recipeId}`;

export async function savePhoto(recipeId, file) {
  const dataUrl = await resizeImage(file, 1280, 0.82);
  await set(keyFor(recipeId), dataUrl);
  return dataUrl;
}

export async function getPhoto(recipeId) {
  return (await get(keyFor(recipeId))) || null;
}

export async function deletePhoto(recipeId) {
  await del(keyFor(recipeId));
}

export async function getAllPhotoKeys() {
  const all = await keys();
  return all.filter((k) => typeof k === "string" && k.startsWith("photo:"));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Redimensionne et compresse la photo prise au téléphone (souvent 3-4 Mo)
// pour garder l'application légère et rapide, même avec 25 photos stockées.
function resizeImage(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
