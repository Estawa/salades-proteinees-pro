// Petites aides pour l'historique "déjà faite"

export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const lastMade = (meta) => {
  const dates = meta?.madeDates || [];
  return dates.length ? [...dates].sort().at(-1) : null;
};

export function daysSince(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const then = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - then) / 86400000);
}

export function formatDaysAgo(iso) {
  const n = daysSince(iso);
  if (n == null) return "";
  if (n <= 0) return "aujourd'hui";
  if (n === 1) return "hier";
  if (n < 7) return `il y a ${n} j`;
  if (n < 60) return `il y a ${Math.round(n / 7)} sem.`;
  return `il y a ${Math.round(n / 30)} mois`;
}

export function formatDateFr(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
