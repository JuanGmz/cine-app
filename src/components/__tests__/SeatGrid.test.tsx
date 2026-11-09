import { fireEvent, render, screen } from '@testing-library/react-native';
import { SeatGrid } from '../SeatGrid';

describe('SeatGrid', () => {
  it('renders 80 seats', async () => {
    await render(<SeatGrid occupied={new Set()} selected={new Set()} onToggle={jest.fn()} />);
    expect(screen.getAllByLabelText(/^[A-H]\d{1,2}$/)).toHaveLength(80);
  });

  it('calls onToggle with the seat id when a free seat is pressed', async () => {
    const onToggle = jest.fn();
    await render(<SeatGrid occupied={new Set(['A1'])} selected={new Set()} onToggle={onToggle} />);
    await fireEvent.press(screen.getByLabelText('B2'));
    expect(onToggle).toHaveBeenCalledWith('B2');
  });

  it('does not call onToggle when an occupied seat is pressed', async () => {
    const onToggle = jest.fn();
    await render(<SeatGrid occupied={new Set(['A1'])} selected={new Set()} onToggle={onToggle} />);
    await fireEvent.press(screen.getByLabelText('A1'));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
