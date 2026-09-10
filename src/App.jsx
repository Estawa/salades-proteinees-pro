import { useEffect, useMemo, useState } from "react";
import { Moon, Sun, Salad } from "lucide-react";
import recipesData from "./data/recipes.json";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import { getPhoto } from "./utils/photoStorage";

const CATEGORIES = ["Toutes", "Viande", "Poisson", "Végétarien"];

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState("Toutes");
  const [photos, setPhotos] = useState({});
  const [dark, setDark] = useState(() =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        recipesData.map(async (r) => [r.id, await getPhoto(r.id)])
      );
      setPhotos(Object.fromEntries(entries));
    })();
  }, []);

  const filtered = useMemo(() => {
    if (category === "Toutes") return recipesData;
    return recipesData.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
  }, [category]);

  const selected = recipesData.find((r) => r.id === selectedId);

  if (selected) {
    return (
      <RecipeDetail
        recipe={selected}
        photo={photos[selected.id]}
        onPhotoChange={(dataUrl) =>
          setPhotos((p) => ({ ...p, [selected.id]: dataUrl }))
        }
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Salad size={22} />
            <div>
              <h1 className="font-bold text-lg leading-tight">Salades Pro</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                by C. Guilhem · v1.1
              </p>
            </div>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800"
            aria-label="Changer de thème"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition ${
                category === c
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                  : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-4 grid grid-cols-2 gap-3">
        {filtered.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            photo={photos[r.id]}
            onClick={() => setSelectedId(r.id)}
          />
        ))}
      </main>
    </div>
  );
}
