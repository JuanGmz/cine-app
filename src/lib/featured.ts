import type { Movie } from '@/api/types';

/** First movie with a positive rating (the API defaults rating to 0); else the first movie. */
export function pickFeatured(movies: Movie[]): Movie | undefined {
  return movies.find((m) => (m.rating ?? 0) > 0) ?? movies[0];
}
