import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { COLS, ROWS, seatId } from '@/lib/seats';
import { theme } from '@/theme';

type Props = {
  occupied: Set<string>;
  selected: Set<string>;
  onToggle: (id: string) => void;
};

const GAP = 6;

export function SeatGrid({ occupied, selected, onToggle }: Props) {
  const { width } = useWindowDimensions();
  // En móvil llenan el ancho (aspecto nativo); en pantallas grandes se topan a 59px (50% del original).
  const natural = Math.floor((width - theme.spacing.md * 2 - GAP * (COLS - 1)) / COLS);
  const size = Math.min(natural, 59);

  return (
    <View style={{ gap: GAP }}>
      {Array.from({ length: ROWS }, (_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: COLS }, (_, c) => {
            const id = seatId(r, c);
            const isTaken = occupied.has(id);
            const isSelected = selected.has(id);
            return (
              <Pressable
                key={id}
                accessibilityLabel={id}
                accessibilityRole="button"
                accessibilityState={{ disabled: isTaken, selected: isSelected }}
                disabled={isTaken}
                onPress={() => onToggle(id)}
                style={[
                  styles.seat,
                  { width: size, height: size },
                  isTaken && styles.taken,
                  isSelected && styles.selected,
                ]}
              >
                <Text
                  style={[
                    styles.seatLabel,
                    { fontSize: Math.max(6, Math.min(11, Math.floor(size / 3))) },
                    isSelected && styles.seatLabelSelected,
                  ]}
                >
                  {id}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: GAP, justifyContent: 'center' },
  seat: {
    backgroundColor: theme.colors.seatFree,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: theme.radius.sm + 2,
    borderTopRightRadius: theme.radius.sm + 2,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  seatLabel: {
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  seatLabelSelected: {
    color: theme.colors.bg,
  },
  taken: { backgroundColor: theme.colors.seatTaken, opacity: 0.5 },
  selected: { backgroundColor: theme.colors.seatSelected },
});
