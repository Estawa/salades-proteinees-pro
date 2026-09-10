import { useRef, useState } from "react";
import { Camera, ImageOff } from "lucide-react";
import { savePhoto } from "../utils/photoStorage";

export default function PhotoCapture({ recipeId, photo, onPhotoChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const dataUrl = await savePhoto(recipeId, file);
      onPhotoChange(dataUrl);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
      {photo ? (
        <img src={photo} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2">
          <ImageOff size={36} />
          <span className="text-sm">Pas encore de photo</span>
        </div>
      )}

      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="absolute bottom-3 right-3 flex items-center gap-2 bg-gray-900/85 dark:bg-gray-100/90 text-white dark:text-gray-900 px-3 py-2 rounded-xl text-sm font-medium shadow-lg active:scale-95 transition"
      >
        <Camera size={16} />
        {loading ? "Enregistrement…" : photo ? "Changer la photo" : "Prendre une photo"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
