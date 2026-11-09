import { fireEvent, render, screen } from '@testing-library/react-native';
import { MovieRow } from '../MovieRow';
import { useMovies } from '@/hooks/useMovies';

jest.mock('@/hooks/useMovies');

const category = { id: 'c1', name: 'Ciencia ficción' };
const movie = (id: string, title: string) => ({
  id,
  title,
  releaseYear: 1982,
  posterUrl: null,
  category,
  director: { id: 'd1', name: 'Ridley Scott' },
});

const mockResult = (data: unknown[], extra: object = {}) =>
  (useMovies as jest.Mock).mockReturnValue({
    data: { data, meta: { page: 1, limit: 20, total: data.length, totalPages: 1 } },
    isLoading: false,
    isError: false,
    ...extra,
  });

describe('MovieRow', () => {
  it('renders nothing when the category has no movies', async () => {
    mockResult([]);
    await render(<MovieRow category={category} onPressMovie={jest.fn()} />);
    expect(screen.queryByText('Ciencia ficción')).toBeNull();
  });

  it('renders the category name and every movie title', async () => {
    mockResult([movie('m1', 'Blade Runner'), movie('m2', 'Alien')]);
    await render(<MovieRow category={category} onPressMovie={jest.fn()} />);
    expect(screen.getByText('Ciencia ficción')).toBeTruthy();
    expect(screen.getByText('Blade Runner')).toBeTruthy();
    expect(screen.getByText('Alien')).toBeTruthy();
  });

  it('calls onPressMovie with the movie id when a poster is pressed', async () => {
    mockResult([movie('m1', 'Blade Runner')]);
    const onPress = jest.fn();
    await render(<MovieRow category={category} onPressMovie={onPress} />);
    await fireEvent.press(screen.getByText('Blade Runner'));
    expect(onPress).toHaveBeenCalledWith('m1');
  });
});
