export type Category = {
  id: string;
  name: string;
  description?: string | null;
  _count?: { movies: number };
};

export type Director = {
  id: string;
  name: string;
  bio?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
};

export type Movie = {
  id: string;
  title: string;
  synopsis?: string | null;
  releaseYear: number;
  duration?: number | null;
  posterUrl?: string | null;
  rating?: number | null;
  category: Category;
  director: Director;
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: Meta;
};
