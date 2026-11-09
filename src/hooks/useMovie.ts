import { useQuery } from '@tanstack/react-query';
import { getMovie } from '@/api/movies';

export function useMovie(id: string) {
  return useQuery({ queryKey: ['movie', id], queryFn: () => getMovie(id), enabled: !!id });
}
