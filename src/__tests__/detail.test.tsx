import { fireEvent, render, screen } from '@testing-library/react-native';
import MovieDetail from '@/app/movie/[id]/index';
import { useMovie } from '@/hooks/useMovie';
import { router } from 'expo-router';

jest.mock('@/hooks/useMovie');
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => ({ id: 'm1' }),
}));

const full = {
  id: 'm1',
  title: 'Blade Runner',
  synopsis: 'Un cazador de replicantes.',
  releaseYear: 1982,
  duration: 135,
  posterUrl: null,
  rating: 8.5,
  category: { id: 'c1', name: 'Ciencia ficción' },
  director: { id: 'd1', name: 'Ridley Scott', nationality: 'Británica' },
};

const mockMovie = (value: object) => (useMovie as jest.Mock).mockReturnValue(value);

describe('MovieDetail', () => {
  it('shows all movie fields', async () => {
    mockMovie({ data: full, isLoading: false, isError: false });
    await render(<MovieDetail />);
    expect(screen.getAllByText('Blade Runner').length).toBeGreaterThan(0);
    expect(screen.getByText(/1982/)).toBeTruthy();
    expect(screen.getByText(/2 h 15 min/)).toBeTruthy();
    expect(screen.getByText(/8\.5\/10/)).toBeTruthy();
    expect(screen.getByText(/Ciencia ficción/)).toBeTruthy();
    expect(screen.getByText(/Ridley Scott/)).toBeTruthy();
    expect(screen.getByText('Un cazador de replicantes.')).toBeTruthy();
  });

  it('shows fallbacks (never "null" or "NaN") when optional fields are missing', async () => {
    mockMovie({
      data: { ...full, duration: null, rating: null, synopsis: null, posterUrl: null },
      isLoading: false,
      isError: false,
    });
    await render(<MovieDetail />);
    expect(screen.getAllByText(/Sin información/).length).toBe(2);
    expect(screen.getByText(/Sin calificación/)).toBeTruthy();
    expect(screen.queryByText(/null|NaN|undefined/)).toBeNull();
  });

  it('navigates to seats when "Elegir asientos" is pressed', async () => {
    mockMovie({ data: full, isLoading: false, isError: false });
    await render(<MovieDetail />);
    await fireEvent.press(screen.getByText('Elegir asientos'));
    expect(router.push).toHaveBeenCalledWith('/movie/m1/seats');
  });

  it('shows the error with "Reintentar" and a back action', async () => {
    const refetch = jest.fn();
    mockMovie({ data: undefined, isLoading: false, isError: true, error: new Error('Película no encontrada'), refetch });
    await render(<MovieDetail />);
    expect(screen.getByText('Película no encontrada')).toBeTruthy();
    await fireEvent.press(screen.getByText('Reintentar'));
    expect(refetch).toHaveBeenCalled();
    await fireEvent.press(screen.getByText('Volver'));
    expect(router.back).toHaveBeenCalled();
  });
});
