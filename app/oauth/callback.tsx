import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Esta página será rapidamente substituída pelo fluxo de autenticação
    // Redireciona para home após um breve delay
    const timer = setTimeout(() => {
      router.replace('/(drawer)/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Processando autenticação...</Text>
      <Text style={styles.subtext}>Aguarde um momento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
