import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { CinemaScreen } from '@/components/CinemaScreen';
import { MoviePoster } from '@/components/MoviePoster';
import { MovieRow } from '@/components/MovieRow';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { useCategories } from '@/hooks/useCategories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useMovies } from '@/hooks/useMovies';
import { theme } from '@/theme';

const openMovie = (id: string) => router.push(`/movie/${id}`);

function SearchResults({ search }: { search: string }) {
  const { data, isPending, isError, error, refetch } = useMovies({ search, limit: 30 });
  if (isPending) return <LoadingView />;
  if (isError) return <ErrorView message={(error as Error).message} onRetry={() => refetch()} />;
  const movies = data?.data ?? [];
  if (movies.length === 0) return <EmptyView message="Sin resultados" />;
  return (
    <FlatList
      data={movies}
      numColumns={3}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.gridRow}
      renderItem={({ item }) => (
        <Pressable accessibilityRole="button" onPress={() => openMovie(item.id)} style={styles.gridItem}>
          <MoviePoster movie={item} width={100} />
          <Text numberOfLines={2} style={styles.gridTitle}>{item.title}</Text>
        </Pressable>
      )}
    />
  );
}

function Billboard() {
  const queryClient = useQueryClient();
  const categories = useCategories();
  const featured = useMovies({ sortBy: 'rating', sortOrder: 'desc', limit: 1 });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  };

  if (categories.isPending) return <LoadingView />;
  if (categories.isError) {
    return <ErrorView message={(categories.error as Error).message} onRetry={() => categories.refetch()} />;
  }
  const list = categories.data ?? [];
  if (list.length === 0) return <EmptyView message="Aún no hay películas en cartelera" />;

  return (
    <FlatList
      data={list}
      keyExtractor={(c) => c.id}
      ListHeaderComponent={<CinemaScreen movie={featured.data?.data[0]} onPress={openMovie} />}
      renderItem={({ item }) => <MovieRow category={item} onPressMovie={openMovie} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} />}
      contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
    />
  );
}

export default function BillboardScreen() {
  const [text, setText] = useState('');
  const search = useDebouncedValue(text.trim(), 300);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>🎬 Cine</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Buscar película…"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      {search ? <SearchResults search={search} /> : <Billboard />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  header: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, gap: theme.spacing.sm },
  brand: { color: theme.colors.accent, fontSize: 26, fontWeight: '900' },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.text, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm + 2, fontSize: 16 },
  grid: { padding: theme.spacing.md, gap: theme.spacing.md },
  gridRow: { gap: theme.spacing.md },
  gridItem: { width: 100 },
  gridTitle: { color: theme.colors.textMuted, fontSize: 13, marginTop: theme.spacing.xs },
});
