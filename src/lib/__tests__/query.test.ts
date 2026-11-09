import { ApiError } from '@/api/client';
import { shouldRetry } from '../query';

describe('shouldRetry', () => {
  it('never retries client errors (4xx) such as 404', () => {
    expect(shouldRetry(0, new ApiError('Película no encontrada', { status: 404, code: 'NOT_FOUND' }))).toBe(false);
    expect(shouldRetry(0, new ApiError('Datos inválidos', { status: 400 }))).toBe(false);
  });

  it('retries network and server errors up to 2 times', () => {
    const net = new ApiError('No se pudo conectar con el servidor');
    expect(shouldRetry(0, net)).toBe(true);
    expect(shouldRetry(1, net)).toBe(true);
    expect(shouldRetry(2, net)).toBe(false);
    expect(shouldRetry(0, new ApiError('Error interno', { status: 500 }))).toBe(true);
  });
});
