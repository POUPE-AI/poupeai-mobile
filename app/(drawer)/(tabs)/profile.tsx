import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { colors: themeColors, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const profileOptions = [
    {
      id: 'personal',
      title: 'Informações Pessoais',
      subtitle: 'Nome, email, telefone',
      icon: 'person-outline',
      onPress: () => console.log('Informações pessoais'),
    },
    {
      id: 'security',
      title: 'Segurança',
      subtitle: 'Senha, autenticação',
      icon: 'shield-checkmark-outline',
      onPress: () => console.log('Segurança'),
    },
    {
      id: 'theme',
      title: 'Tema',
      subtitle: isDark ? 'Modo escuro ativo' : 'Modo claro ativo',
      icon: isDark ? 'moon' : 'sunny',
      onPress: toggleTheme,
    },
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Lembretes e alertas',
      icon: 'notifications-outline',
      onPress: () => console.log('Notificações'),
    },
    {
      id: 'categories',
      title: 'Categorias',
      subtitle: 'Gerenciar categorias de gastos',
      icon: 'grid-outline',
      onPress: () => console.log('Categorias'),
    },
    {
      id: 'export',
      title: 'Exportar Dados',
      subtitle: 'Baixar relatórios e backup',
      icon: 'download-outline',
      onPress: () => console.log('Exportar dados'),
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      subtitle: 'FAQ, contato, tutorial',
      icon: 'help-circle-outline',
      onPress: () => console.log('Ajuda'),
    },
    {
      id: 'about',
      title: 'Sobre o App',
      subtitle: 'Versão, termos de uso',
      icon: 'information-circle-outline',
      onPress: () => console.log('Sobre'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary[500]} />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
        </View>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Ionicons name="create-outline" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Dias usando o app</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Metas alcançadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>R$ 2.500</Text>
            <Text style={styles.statLabel}>Total economizado</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Transações registradas</Text>
          </View>
        </View>
      </View>

      <View style={styles.optionsSection}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        {profileOptions.map((option) => (
          <TouchableOpacity 
            key={option.id} 
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={styles.optionIcon}>
              <Ionicons name={option.icon as any} size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.theme.light.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.feedback.error} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 PoupeAI</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme.light.surface,
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.theme.light.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.theme.light.textSecondary,
  },
  editProfileButton: {
    padding: 8,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.theme.light.textSecondary,
    textAlign: 'center',
  },
  optionsSection: {
    padding: 20,
  },
  optionItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.theme.light.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.theme.light.textSecondary,
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.feedback.error,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.feedback.error,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.theme.light.textSecondary,
  },
});
