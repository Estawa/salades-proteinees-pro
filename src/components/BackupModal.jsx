import { useEffect, useRef, useState } from "react";
import { X, Download, Upload, HardDrive } from "lucide-react";
import { exportBackup, importBackup, getBackupStats } from "../utils/backup";

export default function BackupModal({ onClose, onRestored }) {
  const fileRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getBackupStats().then(setStats);
  }, []);

  const handleExport = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await exportBackup();
      if (!res.cancelled) setMessage({ ok: true, text: "Sauvegarde créée. Gardez ce fichier en lieu sûr (Drive, mail…)." });
    } catch {
      setMessage({ ok: false, text: "La sauvegarde a échoué." });
    }
    setBusy(false);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!window.confirm("Restaurer cette sauvegarde ? Les données de la sauvegarde remplaceront celles des mêmes salades sur cet appareil.")) return;
    setBusy(true);
    setMessage(null);
    try {
      const n = await importBackup(file);
      await onRestored();
      setStats(await getBackupStats());
      setMessage({ ok: true, text: `Sauvegarde restaurée (${n} éléments).` });
    } catch (err) {
      setMessage({ ok: false, text: err.message || "Restauration impossible." });
    }
    setBusy(false);
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <HardDrive size={18} /> Sauvegarde
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Vos favorites, notes, prix, historique, photos et liste de courses sont stockés
          uniquement sur ce téléphone. Créez une sauvegarde pour les retrouver sur un autre
          appareil.
        </p>
        {stats && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Actuellement : {stats.recipes} salade{stats.recipes > 1 ? "s" : ""} avec des infos perso,{" "}
            {stats.photos} photo{stats.photos > 1 ? "s" : ""}.
          </p>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleExport}
            disabled={busy}
            className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg py-2.5 text-sm font-medium active:scale-[0.98] transition disabled:opacity-50"
          >
            <Download size={16} />
            Créer une sauvegarde
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 text-sm font-medium active:scale-[0.98] transition disabled:opacity-50"
          >
            <Upload size={16} />
            Restaurer une sauvegarde
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {message && (
          <p
            className={`text-sm mt-3 ${
              message.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
