import { useEffect, useMemo, useState } from "react";
import { Moon, Sun, Share2 } from "lucide-react";
import recipesData from "./data/recipes.json";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import SortMenu from "./components/SortMenu";
import ShareAppModal from "./components/ShareAppModal";
import { getPhoto } from "./utils/photoStorage";
import { getAllMeta, saveRecipeMeta } from "./utils/recipeMeta";

const CATEGORIES = ["Toutes", "Viande", "Poisson", "Végétarien"];

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState("Toutes");
  const [sortBy, setSortBy] = useState("default");
  const [photos, setPhotos] = useState({});
  const [meta, setMeta] = useState({});
  const [shareOpen, setShareOpen] = useState(false);
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
      setMeta(await getAllMeta());
    })();
  }, []);

  const handlePriceChange = async (recipeId, price) => {
    const newMeta = { ...(meta[recipeId] || {}), price };
    setMeta((m) => ({ ...m, [recipeId]: newMeta }));
    await saveRecipeMeta(recipeId, newMeta);
  };

  const filtered = useMemo(() => {
    let list = recipesData;
    if (category !== "Toutes") {
      list = list.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
    }
    const withPrice = (r) => meta[r.id]?.price ?? null;

    const sorted = [...list];
    switch (sortBy) {
      case "protein-desc":
        sorted.sort((a, b) => (b.proteinPerServing ?? 0) - (a.proteinPerServing ?? 0));
        break;
      case "protein-asc":
        sorted.sort((a, b) => (a.proteinPerServing ?? 0) - (b.proteinPerServing ?? 0));
        break;
      case "price-asc":
        sorted.sort((a, b) => {
          const pa = withPrice(a), pb = withPrice(b);
          if (pa == null && pb == null) return 0;
          if (pa == null) return 1;
          if (pb == null) return -1;
          return pa - pb;
        });
        break;
      case "price-desc":
        sorted.sort((a, b) => {
          const pa = withPrice(a), pb = withPrice(b);
          if (pa == null && pb == null) return 0;
          if (pa == null) return 1;
          if (pb == null) return -1;
          return pb - pa;
        });
        break;
      case "alpha":
        sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
        break;
      default:
        break;
    }
    return sorted;
  }, [category, sortBy, meta]);

  const selected = recipesData.find((r) => r.id === selectedId);

  if (selected) {
    return (
      <RecipeDetail
        recipe={selected}
        photo={photos[selected.id]}
        onPhotoChange={(dataUrl) =>
          setPhotos((p) => ({ ...p, [selected.id]: dataUrl }))
        }
        price={meta[selected.id]?.price ?? null}
        onPriceChange={(price) => handlePriceChange(selected.id, price)}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon-192.png" alt="" className="w-7 h-7 rounded-lg" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Salades Pro</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                by C. Guilhem · v1.3
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

        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
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
          <div className="flex items-center gap-2 shrink-0">
            <SortMenu value={sortBy} onChange={setSortBy} />
            <button
              onClick={() => setShareOpen(true)}
              className="p-1.5 rounded-full border border-gray-300 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800"
              aria-label="Partager l'application"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {shareOpen && <ShareAppModal onClose={() => setShareOpen(false)} />}

      <main className="px-4 pt-4 grid grid-cols-2 gap-3">
        {filtered.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            photo={photos[r.id]}
            price={meta[r.id]?.price ?? null}
            onClick={() => setSelectedId(r.id)}
          />
        ))}
      </main>
    </div>
  );
}
