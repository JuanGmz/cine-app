import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Category } from '@/api/types';
import { useMovies } from '@/hooks/useMovies';
import { theme } from '@/theme';
import { MoviePoster } from './MoviePoster';

const POSTER_WIDTH = 110;

type Props = {
  category: Category;
  onPressMovie: (id: string) => void;
};

export function MovieRow({ category, onPressMovie }: Props) {
  const { data } = useMovies({ categoryId: category.id, limit: 20 });
  const movies = data?.data ?? [];
  if (movies.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{category.name}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => onPressMovie(item.id)}
            style={{ width: POSTER_WIDTH }}
          >
            <MoviePoster movie={item} width={POSTER_WIDTH} />
            <Text numberOfLines={2} style={styles.movieTitle}>
              {item.title}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
  list: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.md },
  movieTitle: { color: theme.colors.textMuted, fontSize: 13, marginTop: theme.spacing.xs },
});
