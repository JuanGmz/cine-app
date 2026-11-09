import { formatDuration, formatRating } from '../format';

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(135)).toBe('2 h 15 min');
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(45)).toBe('45 min');
  });
  it('handles missing values', () => {
    expect(formatDuration(null)).toBe('Sin información');
    expect(formatDuration(undefined)).toBe('Sin información');
    expect(formatDuration(0)).toBe('Sin información');
  });
});

describe('formatRating', () => {
  it('formats rating out of 10', () => {
    expect(formatRating(8.5)).toBe('8.5/10');
    expect(formatRating(7)).toBe('7.0/10');
  });
  it('handles missing values', () => {
    expect(formatRating(null)).toBe('Sin calificación');
    expect(formatRating(undefined)).toBe('Sin calificación');
  });
});

describe('formatRating with the API default of 0', () => {
  it('treats 0 (unrated default) as missing', () => {
    expect(formatRating(0)).toBe('Sin calificación');
  });
});
