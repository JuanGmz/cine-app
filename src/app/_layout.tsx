import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
import { shouldRetry } from '@/lib/query';
import { theme } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry, staleTime: 60_000 } },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.bg },
          headerBackTitle: 'Atrás',
          headerTitleAlign: 'left',
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Atrás"
              hitSlop={8}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons name="chevron-back" size={26} color={theme.colors.text} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]/index" options={{ title: 'Detalle' }} />
        <Stack.Screen name="movie/[id]/seats" options={{ title: 'Asientos' }} />
        <Stack.Screen name="movie/[id]/payment" options={{ title: 'Pago' }} />
      </Stack>
    </QueryClientProvider>
  );
}
