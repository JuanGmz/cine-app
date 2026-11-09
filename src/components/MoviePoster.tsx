import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import type { Movie } from '@/api/types';
import { theme } from '@/theme';

type Props = {
  movie: Pick<Movie, 'title' | 'posterUrl'>;
  width: number;
};

export function MoviePoster({ movie, width }: Props) {
  const height = Math.round(width * 1.5);
  if (movie.posterUrl) {
    return (
      <Image
        source={{ uri: movie.posterUrl }}
        accessibilityLabel={`Póster de ${movie.title}`}
        style={[styles.base, { width, height }]}
        contentFit="cover"
        transition={150}
      />
    );
  }
  return (
    <View style={[styles.base, styles.placeholder, { width, height }]}>
      <Text style={[styles.initial, { fontSize: width / 2 }]}>
        {movie.title.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: theme.radius.md, backgroundColor: theme.colors.surface },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: theme.colors.accent, fontWeight: '700' },
});
