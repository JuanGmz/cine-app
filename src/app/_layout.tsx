import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
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
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]/index" options={{ title: 'Detalle' }} />
        <Stack.Screen name="movie/[id]/seats" options={{ title: 'Asientos' }} />
      </Stack>
    </QueryClientProvider>
  );
}
