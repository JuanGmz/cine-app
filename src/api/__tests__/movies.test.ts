import { getCategories, getMovie, getMovies } from '../movies';

const ok = (data: unknown, meta?: unknown) =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true, data, meta }) });

const lastUrl = () => (globalThis as any).fetch.mock.calls.at(-1)[0] as string;

beforeEach(() => {
  (globalThis as any).fetch = jest.fn();
});

describe('movies api', () => {
  it('getMovies sends filters and returns data with meta', async () => {
    const meta = { page: 1, limit: 20, total: 1, totalPages: 1 };
    (globalThis as any).fetch.mockImplementation(() => ok([{ id: 'm1' }], meta));
    const res = await getMovies({ categoryId: 'c1', limit: 20 });
    expect(lastUrl()).toMatch(/\/movies\?/);
    expect(lastUrl()).toContain('categoryId=c1');
    expect(lastUrl()).toContain('limit=20');
    expect(res).toEqual({ data: [{ id: 'm1' }], meta });
  });

  it('getMovie requests /movies/:id', async () => {
    (globalThis as any).fetch.mockImplementation(() => ok({ id: 'x' }));
    const movie = await getMovie('x');
    expect(lastUrl()).toMatch(/\/movies\/x$/);
    expect(movie).toEqual({ id: 'x' });
  });

  it('getCategories asks for up to 100 sorted by name and returns the array', async () => {
    (globalThis as any).fetch.mockImplementation(() => ok([{ id: 'c1', name: 'Acción' }], {}));
    const cats = await getCategories();
    expect(lastUrl()).toContain('/categories?');
    expect(lastUrl()).toContain('limit=100');
    expect(lastUrl()).toContain('sortBy=name');
    expect(lastUrl()).toContain('sortOrder=asc');
    expect(cats).toEqual([{ id: 'c1', name: 'Acción' }]);
  });
});
