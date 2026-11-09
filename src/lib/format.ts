export function formatDuration(min?: number | null): string {
  if (!min || min <= 0) return 'Sin información';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatRating(r?: number | null): string {
  if (r === null || r === undefined || Number.isNaN(r)) return 'Sin calificación';
  return `${r.toFixed(1)}/10`;
}
