import type { Meta } from './types';

const DEFAULT_URL = 'http://localhost:3000/api';

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, opts: { code?: string; status?: number } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = opts.code;
    this.status = opts.status;
  }
}

type Params = Record<string, string | number | undefined>;

function buildQuery(params?: Params): string {
  if (!params) return '';
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

export async function apiGet<T>(path: string, params?: Params): Promise<{ data: T; meta?: Meta }> {
  const base = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;
  let res: Response;
  try {
    res = await fetch(`${base}${path}${buildQuery(params)}`);
  } catch {
    throw new ApiError('No se pudo conectar con el servidor');
  }

  let body: any;
  try {
    body = await res.json();
  } catch {
    throw new ApiError('Respuesta inválida del servidor', { status: res.status });
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(body?.error?.message ?? 'Error del servidor', {
      code: body?.error?.code,
      status: res.status,
    });
  }
  return { data: body.data as T, meta: body.meta };
}
