import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MoviePoster } from '@/components/MoviePoster';
import { ErrorView, LoadingView } from '@/components/StateViews';
import { useMovie } from '@/hooks/useMovie';
import { formatDuration, formatRating } from '@/lib/format';
import { theme } from '@/theme';

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: movie, isPending, isError, error, refetch } = useMovie(id);

  if (isPending) return <LoadingView />;
  if (isError || !movie) {
    return (
      <View style={styles.screen}>
        <ErrorView message={(error as Error | undefined)?.message ?? 'No se pudo cargar la película'} onRetry={() => refetch()} />
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const { director } = movie;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <MoviePoster movie={movie} width={180} />
        </View>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.releaseYear} · {formatDuration(movie.duration)} · {formatRating(movie.rating)}
        </Text>
        <Text style={styles.chip}>{movie.category.name}</Text>

        <Text style={styles.label}>Sinopsis</Text>
        <Text style={styles.body}>{movie.synopsis || 'Sin información'}</Text>

        <Text style={styles.label}>Director</Text>
        <Text style={styles.body}>
          {director.name}
          {director.nationality ? ` · ${director.nationality}` : ''}
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/movie/${movie.id}/seats`)}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>Elegir asientos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  hero: { alignItems: 'center', marginVertical: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  meta: { color: theme.colors.textMuted, fontSize: 15, textAlign: 'center', marginTop: theme.spacing.xs },
  chip: { alignSelf: 'center', color: theme.colors.accent, borderColor: theme.colors.accent, borderWidth: 1, borderRadius: 999, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, marginTop: theme.spacing.md, fontWeight: '600' },
  label: { color: theme.colors.accent, fontSize: 13, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs },
  body: { color: theme.colors.text, fontSize: 16, lineHeight: 23 },
  footer: { padding: theme.spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.surface },
  cta: { backgroundColor: theme.colors.accent, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  ctaText: { color: theme.colors.bg, fontSize: 17, fontWeight: '800' },
  back: { alignItems: 'center', padding: theme.spacing.md },
  backText: { color: theme.colors.textMuted, fontSize: 16 },
});
