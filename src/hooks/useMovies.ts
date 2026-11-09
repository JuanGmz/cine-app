import { useQuery } from '@tanstack/react-query';
import { getMovies, type MovieQuery } from '@/api/movies';

export function useMovies(params?: MovieQuery, options: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: ['movies', params ?? {}], queryFn: () => getMovies(params), ...options });
}
