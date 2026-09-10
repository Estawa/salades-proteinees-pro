import { useState } from "react";
import { Minus, Plus, Share2, Copy, Check } from "lucide-react";
import { buildShareText } from "../utils/scaling";

export default function ServingsAndShare({ recipe, servings, onServingsChange }) {
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText(recipe, servings);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text: shareText });
      } catch {
        // partage annulé par l'utilisateur, rien à faire
      }
    } else {
      handleWhatsApp();
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Portions</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onServingsChange(Math.max(1, servings - 1))}
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800"
            aria-label="Moins de portions"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center font-semibold">{servings}</span>
          <button
            onClick={() => onServingsChange(servings + 1)}
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800"
            aria-label="Plus de portions"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg py-2 text-sm font-medium active:scale-[0.98] transition"
        >
          <Share2 size={16} />
          Partager
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2 text-sm font-medium active:scale-[0.98] transition"
        >
          WhatsApp
        </button>
        <button
          onClick={handleCopy}
          className="w-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg active:scale-[0.98] transition"
          aria-label="Copier"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}
