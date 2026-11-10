import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ErrorView, LoadingView } from '@/components/StateViews';
import { useMovie } from '@/hooks/useMovie';
import { SEAT_PRICE } from '@/lib/seats';
import { theme } from '@/theme';

const money = (n: number) => `$${n.toFixed(2)}`;

export default function PaymentScreen() {
  const { id, showtime, seats } = useLocalSearchParams<{
    id: string;
    showtime?: string;
    seats?: string;
  }>();
  const { data: movie, isPending, isError, error, refetch } = useMovie(id);

  const seatList = (seats ?? '').split(', ').filter(Boolean);
  const total = seatList.length * SEAT_PRICE;

  if (isPending) return <LoadingView />;
  if (isError || !movie) {
    return (
      <ErrorView
        message={(error as Error | undefined)?.message ?? 'No se pudo cargar la película'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pago</Text>
      <Text style={styles.subtitle}>Detalle de la compra</Text>

      <View style={styles.card}>
        <Row label="Película" value={movie.title} />
        <Row label="Función" value={showtime ?? '—'} />
        <Row label="Asientos" value={seatList.join(', ') || '—'} />
        <Row label="Concepto" value={`${seatList.length} × ${money(SEAT_PRICE)}`} />
        <View style={styles.divider} />
        <Row label="Total" value={money(total)} strong />
      </View>

      <Text style={styles.note}>Simulación terminada. No se realizó ningún cargo real.</Text>
    </ScrollView>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, strong && styles.rowStrong]}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.rowStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
  rowLabel: { color: theme.colors.textMuted, fontSize: 14 },
  rowValue: { color: theme.colors.text, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  rowStrong: { fontSize: 17, fontWeight: '800', color: theme.colors.accent },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.textMuted,
    marginVertical: theme.spacing.xs,
  },
  note: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});
