import { ApiError, apiGet } from '../client';

const mockFetch = (impl: () => Promise<unknown>) => {
  (globalThis as any).fetch = jest.fn(impl);
};
const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });

describe('apiGet', () => {
  it('returns data and meta from a successful envelope', async () => {
    const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
    mockFetch(() => jsonResponse({ success: true, data: [{ id: 'a' }], meta }));
    const res = await apiGet<{ id: string }[]>('/movies');
    expect(res.data).toEqual([{ id: 'a' }]);
    expect(res.meta).toEqual(meta);
  });

  it('throws ApiError with message and code when success is false', async () => {
    mockFetch(() =>
      jsonResponse({ success: false, error: { message: 'Película no encontrada', code: 'NOT_FOUND' } }, 404),
    );
    await expect(apiGet('/movies/x')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Película no encontrada',
      code: 'NOT_FOUND',
      status: 404,
    });
  });

  it('throws ApiError with a Spanish message when the network fails', async () => {
    mockFetch(() => Promise.reject(new TypeError('Network request failed')));
    const err = await apiGet('/movies').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe('No se pudo conectar con el servidor');
  });

  it('omits undefined params from the query string', async () => {
    mockFetch(() => jsonResponse({ success: true, data: [] }));
    await apiGet('/movies', { search: undefined, limit: 20, categoryId: 'c1' });
    const url = (globalThis as any).fetch.mock.calls[0][0] as string;
    expect(url).toContain('/movies?');
    expect(url).toContain('limit=20');
    expect(url).toContain('categoryId=c1');
    expect(url).not.toContain('search');
  });
});
