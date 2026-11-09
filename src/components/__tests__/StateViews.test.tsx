import { fireEvent, render, screen } from '@testing-library/react-native';
import { EmptyView, ErrorView } from '../StateViews';

describe('StateViews', () => {
  it('ErrorView shows the message and calls onRetry when "Reintentar" is pressed', async () => {
    const onRetry = jest.fn();
    await render(<ErrorView message="No se pudo conectar con el servidor" onRetry={onRetry} />);
    expect(screen.getByText('No se pudo conectar con el servidor')).toBeTruthy();
    await fireEvent.press(screen.getByText('Reintentar'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('EmptyView shows its message', async () => {
    await render(<EmptyView message="Sin resultados" />);
    expect(screen.getByText('Sin resultados')).toBeTruthy();
  });
});
