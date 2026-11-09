import { pickFeatured } from '../featured';

const m = (id: string, rating: number | null) => ({ id, rating }) as any;

describe('pickFeatured', () => {
  it('picks the first movie with a positive rating', () => {
    expect(pickFeatured([m('a', null), m('b', 0), m('c', 8.2), m('d', 7)])?.id).toBe('c');
  });
  it('falls back to the first movie when none is rated', () => {
    expect(pickFeatured([m('a', 0), m('b', null)])?.id).toBe('a');
  });
  it('returns undefined for an empty list', () => {
    expect(pickFeatured([])).toBeUndefined();
  });
});
