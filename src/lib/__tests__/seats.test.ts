import { COLS, ROWS, SEAT_PRICE, getOccupiedSeats, seatId, toggleSeat, totalPrice } from '../seats';

describe('seatId', () => {
  it('maps row/col to letter+number', () => {
    expect(seatId(0, 0)).toBe('A1');
    expect(seatId(7, 9)).toBe('H10');
  });
});

describe('getOccupiedSeats', () => {
  it('is deterministic for the same movie and showtime', () => {
    const a = getOccupiedSeats('movie-1', '18:30');
    const b = getOccupiedSeats('movie-1', '18:30');
    expect([...a].sort()).toEqual([...b].sort());
  });

  it('differs across showtimes and movies', () => {
    const base = [...getOccupiedSeats('movie-1', '16:00')].sort().join();
    expect([...getOccupiedSeats('movie-1', '21:00')].sort().join()).not.toBe(base);
    expect([...getOccupiedSeats('movie-2', '16:00')].sort().join()).not.toBe(base);
  });

  it('occupies roughly a quarter of the seats, all with valid ids', () => {
    const valid = new Set<string>();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) valid.add(seatId(r, c));
    for (const id of ['m1', 'm2', 'm3', 'm4']) {
      const occ = getOccupiedSeats(id, '18:30');
      expect(occ.size).toBeGreaterThanOrEqual(ROWS * COLS * 0.15);
      expect(occ.size).toBeLessThanOrEqual(ROWS * COLS * 0.35);
      occ.forEach((s) => expect(valid.has(s)).toBe(true));
    }
  });
});

describe('toggleSeat', () => {
  const occupied = new Set(['A1']);

  it('adds a free seat and removes it on second toggle', () => {
    const added = toggleSeat(new Set(), 'B2', occupied);
    expect(added.has('B2')).toBe(true);
    expect(toggleSeat(added, 'B2', occupied).has('B2')).toBe(false);
  });

  it('ignores occupied seats', () => {
    expect(toggleSeat(new Set(), 'A1', occupied).size).toBe(0);
  });

  it('does not mutate the input set', () => {
    const input = new Set(['C3']);
    toggleSeat(input, 'D4', occupied);
    expect([...input]).toEqual(['C3']);
  });
});

describe('totalPrice', () => {
  it('is seat count times SEAT_PRICE', () => {
    expect(totalPrice(new Set())).toBe(0);
    expect(totalPrice(new Set(['A2', 'A3', 'A4']))).toBe(3 * SEAT_PRICE);
  });
});
