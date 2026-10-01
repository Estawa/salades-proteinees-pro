import { ImageOff, Star, ShoppingCart, CalendarCheck } from "lucide-react";
import { formatDaysAgo } from "../utils/dates";
import ProteinBadge from "./ProteinBadge";
import FavoriteButton from "./FavoriteButton";

export default function RecipeCard({
  recipe,
  photo,
  price,
  favorite,
  onToggleFavorite,
  rating,
  lastMadeISO,
  inPlan,
  onClick,
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="w-full h-full flex flex-col items-stretch justify-start text-left rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 active:scale-[0.98] transition"
      >
        <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-800">
          {photo ? (
            <img src={photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
              <ImageOff size={28} />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <ProteinBadge grams={recipe.proteinPerServing} size="sm" />
          </div>
          {price != null && (
            <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-900/90 text-xs font-semibold px-2 py-0.5 rounded-full">
              {price.toFixed(2)} €
            </div>
          )}
          {(rating != null || inPlan) && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              {inPlan && (
                <span className="bg-white/90 dark:bg-gray-900/90 p-1 rounded-full" title="Dans la liste de courses">
                  <ShoppingCart size={12} />
                </span>
              )}
              {rating != null && (
                <span className="flex items-center gap-0.5 bg-white/90 dark:bg-gray-900/90 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {rating}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
            {recipe.category}
          </p>
          <h3 className="font-semibold leading-snug mt-0.5">{recipe.title}</h3>
          {lastMadeISO && (
            <p className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              <CalendarCheck size={11} />
              Faite {formatDaysAgo(lastMadeISO)}
            </p>
          )}
        </div>
      </button>

      {/* Bouton séparé (et non imbriqué) pour ne pas ouvrir la fiche en touchant l'étoile */}
      <div className="absolute top-1.5 left-1.5">
        <FavoriteButton favorite={favorite} onToggle={onToggleFavorite} variant="overlay" />
      </div>
    </div>
  );
}
