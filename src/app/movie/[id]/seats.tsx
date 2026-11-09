import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ErrorView, LoadingView } from '@/components/StateViews';
import { SeatGrid } from '@/components/SeatGrid';
import { useMovie } from '@/hooks/useMovie';
import { SEAT_PRICE, SHOWTIMES, getOccupiedSeats, toggleSeat, totalPrice } from '@/lib/seats';
import { theme } from '@/theme';

const money = (n: number) => `$${n.toFixed(2)}`;

export default function SeatsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: movie, isLoading, isError, error, refetch } = useMovie(id);
  const [showtime, setShowtime] = useState<string>(SHOWTIMES[0]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const occupied = useMemo(() => getOccupiedSeats(id, showtime), [id, showtime]);

  if (isLoading) return <LoadingView />;
  if (isError || !movie) {
    return (
      <ErrorView
        message={(error as Error | undefined)?.message ?? 'No se pudo cargar la película'}
        onRetry={() => refetch()}
      />
    );
  }

  const seats = [...selected].sort();
  const confirm = () =>
    Alert.alert(
      '¡Reserva simulada!',
      `${movie.title}\nFunción: ${showtime}\nAsientos: ${seats.join(', ')}\nTotal: ${money(totalPrice(selected))}`,
      [{ text: 'OK', onPress: () => setSelected(new Set()) }],
    );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.showtimes}>
          {SHOWTIMES.map((t) => (
            <Pressable
              key={t}
              accessibilityRole="button"
              onPress={() => {
                setShowtime(t);
                setSelected(new Set());
              }}
              style={[styles.chip, t === showtime && styles.chipActive]}
            >
              <Text style={[styles.chipText, t === showtime && styles.chipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.screenBar} />
        <Text style={styles.screenLabel}>PANTALLA</Text>

        <SeatGrid
          occupied={occupied}
          selected={selected}
          onToggle={(seat) => setSelected((prev) => toggleSeat(prev, seat, occupied))}
        />

        <View style={styles.legend}>
          <LegendItem color={theme.colors.seatFree} label="Libre" />
          <LegendItem color={theme.colors.seatTaken} label="Ocupado" />
          <LegendItem color={theme.colors.seatSelected} label="Elegido" />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.summary}>{seats.length ? seats.join(', ') : 'Elige tus asientos'}</Text>
          <Text style={styles.total}>
            {seats.length} × {money(SEAT_PRICE)} = {money(totalPrice(selected))}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={seats.length === 0}
          onPress={confirm}
          style={[styles.cta, seats.length === 0 && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>Confirmar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  showtimes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
  },
  chipActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  chipText: { color: theme.colors.textMuted, fontWeight: '700' },
  chipTextActive: { color: theme.colors.bg },
  screenBar: {
    height: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    marginHorizontal: theme.spacing.lg,
    opacity: 0.9,
  },
  screenLabel: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 3,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.lg, marginTop: theme.spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs + 2 },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { color: theme.colors.textMuted, fontSize: 13 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.surface,
  },
  summary: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  total: { color: theme.colors.textMuted, fontSize: 13, marginTop: 2 },
  cta: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: theme.colors.bg, fontSize: 16, fontWeight: '800' },
});
