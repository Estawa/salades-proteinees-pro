import { Star } from "lucide-react";

// Note de 1 à 5. Toucher la note déjà donnée l'efface.
export default function RatingStars({ rating, onChange, size = 24 }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Ma note">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = rating != null && n <= rating;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(rating === n ? null : n)}
            className="p-0.5 active:scale-90 transition"
            aria-label={`${n} sur 5`}
            aria-checked={rating === n}
            role="radio"
          >
            <Star
              size={size}
              className={on ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
            />
          </button>
        );
      })}
    </div>
  );
}
