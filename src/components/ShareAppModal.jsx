import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { X, Share2, Copy, Check } from "lucide-react";

export default function ShareAppModal({ onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin + window.location.pathname;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, appUrl, {
        width: 220,
        margin: 1,
        color: { dark: "#111827", light: "#ffffff" },
      });
    }
  }, [appUrl]);

  const shareText = `Salades Pro — mes recettes de salades protéinées meal-prep : ${appUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Salades Pro", text: shareText, url: appUrl });
      } catch {
        // partage annulé, rien à faire
      }
    } else {
      handleWhatsApp();
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-30 bg-black/50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:w-96 p-5 pb-8 sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Partager l'appli</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4 break-all">
          {appUrl}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg py-2.5 text-sm font-medium active:scale-[0.98] transition"
          >
            <Share2 size={16} />
            Partager
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 text-sm font-medium active:scale-[0.98] transition"
          >
            WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="w-11 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg active:scale-[0.98] transition"
            aria-label="Copier le lien"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
