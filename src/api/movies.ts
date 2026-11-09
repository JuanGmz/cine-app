import { apiGet } from './client';
import type { Category, Movie, Paginated } from './types';

export type MovieQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: 'title' | 'releaseYear' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export async function getMovies(params?: MovieQuery): Promise<Paginated<Movie>> {
  const { data, meta } = await apiGet<Movie[]>('/movies', params);
  return { data, meta: meta! };
}

export async function getMovie(id: string): Promise<Movie> {
  const { data } = await apiGet<Movie>(`/movies/${encodeURIComponent(id)}`);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiGet<Category[]>('/categories', {
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  return data;
}
