import { useEffect, useMemo, useState } from "react";
import {
  Moon,
  Sun,
  Share2,
  LayoutGrid,
  Beef,
  Fish,
  Leaf,
  Star,
  Search,
  X,
  ShoppingCart,
  HardDrive,
} from "lucide-react";
import recipesData from "./data/recipes.json";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import SortMenu from "./components/SortMenu";
import ShareAppModal from "./components/ShareAppModal";
import BackupModal from "./components/BackupModal";
import ShoppingList from "./components/ShoppingList";
import { getPhoto } from "./utils/photoStorage";
import { getAllMeta, saveRecipeMeta } from "./utils/recipeMeta";
import { getPlan, savePlan, getChecked, saveChecked } from "./utils/shopping";
import { lastMade } from "./utils/dates";

const CATEGORIES = [
  { id: "Toutes", label: "Toutes", Icon: LayoutGrid },
  { id: "Viande", label: "Viande", Icon: Beef },
  { id: "Poisson", label: "Poisson", Icon: Fish },
  { id: "Végétarien", label: "Végétarien", Icon: Leaf },
];

// Recherche sans tenir compte des accents ni des majuscules
const fold = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Texte dans lequel on cherche : titre, description et tous les ingrédients
const searchIndex = Object.fromEntries(
  recipesData.map((r) => [
    r.id,
    fold([r.title, r.desc, ...r.ingredients.map((i) => i.name)].join(" ")),
  ])
);

// Compare deux valeurs en envoyant toujours les "vides" (null) en fin de liste
const nullsLast = (a, b, cmp) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return cmp(a, b);
};

export default function App() {
  const [view, setView] = useState("list"); // "list" | "shopping"
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState("Toutes");
  const [sortBy, setSortBy] = useState("default");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState({});
  const [meta, setMeta] = useState({});
  const [plan, setPlan] = useState({});
  const [checked, setChecked] = useState({});
  const [shareOpen, setShareOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [dark, setDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const loadAll = async () => {
    const entries = await Promise.all(
      recipesData.map(async (r) => [r.id, await getPhoto(r.id)])
    );
    setPhotos(Object.fromEntries(entries));
    setMeta(await getAllMeta());
    setPlan(await getPlan());
    setChecked(await getChecked());
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Met à jour une partie des infos perso d'une salade (prix, favorite, note, historique…)
  const updateMeta = async (recipeId, patch) => {
    const newMeta = { ...(meta[recipeId] || {}), ...patch };
    setMeta((m) => ({ ...m, [recipeId]: newMeta }));
    await saveRecipeMeta(recipeId, newMeta);
  };

  const handleToggleFavorite = (recipeId) =>
    updateMeta(recipeId, { favorite: !meta[recipeId]?.favorite });

  const handlePlanChange = async (next) => {
    setPlan(next);
    await savePlan(next);
  };
  const handleCheckedChange = async (next) => {
    setChecked(next);
    await saveChecked(next);
  };

  const isFav = (id) => !!meta[id]?.favorite;
  const favoriteCount = recipesData.filter((r) => isFav(r.id)).length;
  const planCount = Object.keys(plan).length;

  const filtered = useMemo(() => {
    let list = recipesData;
    if (category !== "Toutes") {
      list = list.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (favoritesOnly) {
      list = list.filter((r) => meta[r.id]?.favorite);
    }
    const words = fold(query).split(/\s+/).filter(Boolean);
    if (words.length) {
      list = list.filter((r) => words.every((w) => searchIndex[r.id].includes(w)));
    }

    const priceOf = (r) => meta[r.id]?.price ?? null;
    const sorted = [...list];
    switch (sortBy) {
      case "protein-desc":
        sorted.sort((a, b) => (b.proteinPerServing ?? 0) - (a.proteinPerServing ?? 0));
        break;
      case "protein-asc":
        sorted.sort((a, b) => (a.proteinPerServing ?? 0) - (b.proteinPerServing ?? 0));
        break;
      case "price-asc":
        sorted.sort((a, b) => nullsLast(priceOf(a), priceOf(b), (x, y) => x - y));
        break;
      case "price-desc":
        sorted.sort((a, b) => nullsLast(priceOf(a), priceOf(b), (x, y) => y - x));
        break;
      case "fav-first":
        // Tri stable : les favorites remontent, l'ordre par défaut est conservé
        sorted.sort((a, b) => (meta[b.id]?.favorite ? 1 : 0) - (meta[a.id]?.favorite ? 1 : 0));
        break;
      case "rating-desc":
        sorted.sort((a, b) =>
          nullsLast(meta[a.id]?.rating ?? null, meta[b.id]?.rating ?? null, (x, y) => y - x)
        );
        break;
      case "least-recent":
        // Jamais faites d'abord, puis celles faites il y a le plus longtemps
        sorted.sort((a, b) => {
          const la = lastMade(meta[a.id]);
          const lb = lastMade(meta[b.id]);
          if (la == null && lb == null) return 0;
          if (la == null) return -1;
          if (lb == null) return 1;
          return la.localeCompare(lb);
        });
        break;
      case "alpha":
        sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
        break;
      default:
        break;
    }
    return sorted;
  }, [category, sortBy, meta, favoritesOnly, query]);

  const selected = recipesData.find((r) => r.id === selectedId);

  if (selected) {
    return (
      <RecipeDetail
        key={selected.id}
        recipe={selected}
        photo={photos[selected.id]}
        onPhotoChange={(dataUrl) => setPhotos((p) => ({ ...p, [selected.id]: dataUrl }))}
        price={meta[selected.id]?.price ?? null}
        onPriceChange={(price) => updateMeta(selected.id, { price })}
        favorite={isFav(selected.id)}
        onToggleFavorite={() => handleToggleFavorite(selected.id)}
        meta={meta[selected.id] || {}}
        onMetaChange={(patch) => updateMeta(selected.id, patch)}
        planned={plan[selected.id] ?? null}
        onPlanAdd={(n) => handlePlanChange({ ...plan, [selected.id]: n })}
        onPlanRemove={() => {
          const next = { ...plan };
          delete next[selected.id];
          handlePlanChange(next);
        }}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (view === "shopping") {
    return (
      <ShoppingList
        recipes={recipesData}
        plan={plan}
        onPlanChange={handlePlanChange}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        onOpenRecipe={setSelectedId}
        onBack={() => setView("list")}
      />
    );
  }

  const chipClass = (active) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border shrink-0 transition ${
      active
        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
        : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
    }`;

  const ToutesIcon = CATEGORIES[0].Icon;

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon-192.png" alt="" className="w-7 h-7 rounded-lg" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Salades Pro</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                by C. Guilhem · v1.5.0
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setView("shopping")}
              className="relative p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800"
              aria-label="Liste de courses"
            >
              <ShoppingCart size={20} />
              {planCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {planCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setBackupOpen(true)}
              className="p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800"
              aria-label="Sauvegarde"
            >
              <HardDrive size={20} />
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800"
              aria-label="Changer de thème"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="relative mt-3">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une salade ou un ingrédient…"
            className="w-full pl-9 pr-9 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400"
              aria-label="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.filter((c) => c.id !== "Toutes").map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setCategory(id)} className={chipClass(category === id)}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <button
            onClick={() => setCategory("Toutes")}
            className={chipClass(category === "Toutes")}
          >
            <ToutesIcon size={14} />
            Toutes
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <SortMenu
              value={sortBy}
              onChange={setSortBy}
              favoritesOnly={favoritesOnly}
              onFavoritesOnlyChange={setFavoritesOnly}
              favoriteCount={favoriteCount}
            />
            <button
              onClick={() => setShareOpen(true)}
              className="p-1.5 rounded-full border border-gray-300 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 shrink-0"
              aria-label="Partager l'application"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {shareOpen && <ShareAppModal onClose={() => setShareOpen(false)} />}
      {backupOpen && <BackupModal onClose={() => setBackupOpen(false)} onRestored={loadAll} />}

      {(favoritesOnly || query) && (
        <div className="px-4 pt-3 flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            {favoritesOnly && <Star size={14} className="fill-amber-400 text-amber-400" />}
            {favoritesOnly ? "Mes favorites" : "Résultats"} ({filtered.length})
          </span>
          <button
            onClick={() => {
              setFavoritesOnly(false);
              setQuery("");
            }}
            className="underline underline-offset-2 text-gray-500 dark:text-gray-400"
          >
            Tout afficher
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="px-6 pt-12 text-center text-gray-500 dark:text-gray-400">
          {favoritesOnly && !query ? (
            <>
              <Star size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="font-medium text-gray-700 dark:text-gray-200">Aucune favorite ici</p>
              <p className="text-sm mt-1">
                Touchez l'étoile d'une salade pour l'ajouter à vos favorites.
              </p>
            </>
          ) : (
            <>
              <Search size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="font-medium text-gray-700 dark:text-gray-200">Aucune salade trouvée</p>
              <p className="text-sm mt-1">
                Essayez un autre ingrédient, ou vérifiez la catégorie et le filtre favorites.
              </p>
            </>
          )}
        </div>
      ) : (
        <main className="px-4 pt-4 grid grid-cols-2 gap-3">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              photo={photos[r.id]}
              price={meta[r.id]?.price ?? null}
              favorite={isFav(r.id)}
              onToggleFavorite={() => handleToggleFavorite(r.id)}
              rating={meta[r.id]?.rating ?? null}
              lastMadeISO={lastMade(meta[r.id])}
              inPlan={plan[r.id] != null}
              onClick={() => setSelectedId(r.id)}
            />
          ))}
        </main>
      )}
    </div>
  );
}
