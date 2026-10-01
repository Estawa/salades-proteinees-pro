import { Star } from "lucide-react";

// Étoile "favorite" réutilisée sur les cartes (variant="overlay", posée sur la photo)
// et dans la fiche recette (variant="plain", dans la barre du haut).
export default function FavoriteButton({ favorite, onToggle, variant = "plain" }) {
  const base =
    variant === "overlay"
      ? "p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-sm"
      : "p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className={`${base} active:scale-90 transition`}
      aria-label={favorite ? "Retirer des favorites" : "Ajouter aux favorites"}
      aria-pressed={favorite}
    >
      <Star
        size={variant === "overlay" ? 18 : 20}
        className={
          favorite
            ? "fill-amber-400 text-amber-400"
            : "text-gray-500 dark:text-gray-400"
        }
      />
    </button>
  );
}
