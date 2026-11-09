export const ROWS = 8;
export const COLS = 10;
export const SHOWTIMES = ['16:00', '18:30', '21:00'] as const;
export const SEAT_PRICE = 90;
const OCCUPANCY = 0.25;

export function seatId(row: number, col: number): string {
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32: small seeded PRNG so occupancy is stable per movie+showtime.
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getOccupiedSeats(movieId: string, showtime: string): Set<string> {
  const rand = mulberry32(hashSeed(`${movieId}|${showtime}`));
  const occupied = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rand() < OCCUPANCY) occupied.add(seatId(r, c));
    }
  }
  return occupied;
}

export function toggleSeat(selected: Set<string>, id: string, occupied: Set<string>): Set<string> {
  const next = new Set(selected);
  if (occupied.has(id)) return next;
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function totalPrice(selected: Set<string>): number {
  return selected.size * SEAT_PRICE;
}
