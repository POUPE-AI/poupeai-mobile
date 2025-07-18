import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { colors } from '../src/constants/theme';
import { router } from 'expo-router';

export default function Login() {
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      const success = await signIn();
      if (!success) {
        Alert.alert(
          'Erro na autenticação', 
          'Não foi possível realizar o login. Tente novamente.',
          [{ text: 'OK' }]
        );
      }
      // A navegação agora é tratada pelo AuthContext
    } catch (error) {
      Alert.alert(
        'Erro', 
        'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>PoupeAI</Text>
          <Text style={styles.subtitle}>
            Gerencie suas finanças de forma inteligente
          </Text>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>
            Faça login para acessar sua conta
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              isLoading && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.loginButtonText}>Conectando...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Entrar com Keycloak</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme.light.background,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[500],
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.theme.light.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.theme.light.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    minHeight: 52,
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: colors.primary[300],
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
