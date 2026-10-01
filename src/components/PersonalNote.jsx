import { useEffect, useState } from "react";
import { StickyNote, Check } from "lucide-react";

// Note perso libre ("moins de harissa", "doubler le poulet"…), enregistrée
// automatiquement quand on quitte le champ.
export default function PersonalNote({ note, onSave }) {
  const [draft, setDraft] = useState(note || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(note || ""), [note]);

  const save = () => {
    const clean = draft.trim();
    if (clean === (note || "")) return;
    onSave(clean || null);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <StickyNote size={18} />
        Ma note perso
        {saved && (
          <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check size={12} /> enregistrée
          </span>
        )}
      </h3>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        rows={3}
        placeholder="Ex : moins de harissa, doubler le poulet, remplacer la feta par du chèvre…"
        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 text-sm resize-y"
      />
    </section>
  );
}
