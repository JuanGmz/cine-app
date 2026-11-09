import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import BillboardScreen from '@/app/index';
import { useCategories } from '@/hooks/useCategories';
import { useMovies } from '@/hooks/useMovies';

jest.mock('@/hooks/useCategories');
jest.mock('@/hooks/useMovies');
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

const idle = { data: undefined, isPending: false, isLoading: false, isError: false, refetch: jest.fn() };
const mockCategories = (value: object) => (useCategories as jest.Mock).mockReturnValue({ ...idle, ...value });

beforeEach(() => {
  (useMovies as jest.Mock).mockReturnValue({ ...idle, data: { data: [], meta: {} } });
});

const renderScreen = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <BillboardScreen />
    </QueryClientProvider>,
  );

describe('BillboardScreen', () => {
  it('does not claim the billboard is empty while categories are pending (e.g. a paused retry)', async () => {
    mockCategories({ isPending: true, isLoading: false });
    await renderScreen();
    expect(screen.queryByText('Aún no hay películas en cartelera')).toBeNull();
  });

  it('shows the error with "Reintentar" when categories fail', async () => {
    mockCategories({ isError: true, error: new Error('No se pudo conectar con el servidor') });
    await renderScreen();
    expect(screen.getByText('No se pudo conectar con el servidor')).toBeTruthy();
    expect(screen.getByText('Reintentar')).toBeTruthy();
  });

  it('shows the empty state only when the API returned zero categories', async () => {
    mockCategories({ data: [] });
    await renderScreen();
    expect(screen.getByText('Aún no hay películas en cartelera')).toBeTruthy();
  });
});
