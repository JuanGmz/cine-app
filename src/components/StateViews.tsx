import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={theme.colors.accent} size="large" />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.error}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

export function EmptyView({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg, gap: theme.spacing.md },
  error: { color: theme.colors.text, textAlign: 'center', fontSize: 16 },
  muted: { color: theme.colors.textMuted, textAlign: 'center', fontSize: 16 },
  button: { backgroundColor: theme.colors.accent, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm + 2, borderRadius: theme.radius.md },
  buttonText: { color: theme.colors.bg, fontWeight: '700' },
});
