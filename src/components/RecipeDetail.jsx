import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PhotoCapture from "./PhotoCapture";
import ProteinBadge from "./ProteinBadge";
import ServingsAndShare from "./ServingsAndShare";
import PriceEditor from "./PriceEditor";
import { formatIngredientLine } from "../utils/scaling";

export default function RecipeDetail({ recipe, photo, onPhotoChange, price, onPriceChange, onBack }) {
  const [servings, setServings] = useState(recipe.baseServings);

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
        <h2 className="font-semibold truncate">{recipe.title}</h2>
      </div>

      <div className="px-4 pt-4">
        <PhotoCapture recipeId={recipe.id} photo={photo} onPhotoChange={onPhotoChange} />

        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
              {recipe.category}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{recipe.desc}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <ProteinBadge grams={recipe.proteinPerServing} size="lg" />
          <PriceEditor price={price} onPriceChange={onPriceChange} />
        </div>

        <div className="mt-4">
          <ServingsAndShare recipe={recipe} servings={servings} onServingsChange={setServings} />
        </div>

        <section className="mt-6">
          <h3 className="font-semibold mb-2">
            Ingrédients ({servings} portion{servings > 1 ? "s" : ""})
          </h3>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className={`px-3 py-2 text-sm ${
                  i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-950"
                }`}
              >
                {formatIngredientLine(ing, recipe.baseServings, servings)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="font-semibold mb-2">Préparation</h3>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {recipe.notes && (
          <section className="mt-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <p className="text-sm italic text-gray-700 dark:text-gray-300">
              <span className="font-semibold not-italic">Astuce : </span>
              {recipe.notes}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

