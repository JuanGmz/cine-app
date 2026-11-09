import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from '@/api/types';
import { formatRating } from '@/lib/format';
import { theme } from '@/theme';
import { MoviePoster } from './MoviePoster';

type Props = {
  movie?: Movie;
  onPress: (id: string) => void;
};

/** Curved cinema screen with the featured movie projected on it. */
export function CinemaScreen({ movie, onPress }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.screen}>
        <View style={styles.glow} />
        {movie ? (
          <Pressable accessibilityRole="button" onPress={() => onPress(movie.id)} style={styles.content}>
            <MoviePoster movie={movie} width={90} />
            <View style={styles.info}>
              <Text style={styles.badge}>EN CARTELERA</Text>
              <Text numberOfLines={2} style={styles.title}>{movie.title}</Text>
              <Text style={styles.meta}>
                {movie.releaseYear} · {formatRating(movie.rating)}
              </Text>
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.md },
  screen: {
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 3,
    borderTopColor: theme.colors.accent,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 190,
    overflow: 'hidden',
  },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: theme.colors.accent, opacity: 0.08 },
  content: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: theme.spacing.xs },
  badge: { color: theme.colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
  meta: { color: theme.colors.textMuted, fontSize: 14 },
});
