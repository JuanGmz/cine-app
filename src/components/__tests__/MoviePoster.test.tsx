import { render, screen } from '@testing-library/react-native';
import { MoviePoster } from '../MoviePoster';

describe('MoviePoster', () => {
  it('shows the title initial when posterUrl is null', async () => {
    await render(<MoviePoster movie={{ title: 'Alien', posterUrl: null }} width={100} />);
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('shows the title initial when posterUrl is an empty string', async () => {
    await render(<MoviePoster movie={{ title: 'blade runner', posterUrl: '' }} width={100} />);
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('renders an image (no placeholder initial) when posterUrl is present', async () => {
    await render(<MoviePoster movie={{ title: 'Alien', posterUrl: 'https://x.test/a.jpg' }} width={100} />);
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.getByLabelText('Póster de Alien')).toBeTruthy();
  });
});
