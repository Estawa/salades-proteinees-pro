import { ImageOff } from "lucide-react";
import ProteinBadge from "./ProteinBadge";

export default function RecipeCard({ recipe, photo, price, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 active:scale-[0.98] transition"
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
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
          {recipe.category}
        </p>
        <h3 className="font-semibold leading-snug mt-0.5">{recipe.title}</h3>
      </div>
    </button>
  );
}

