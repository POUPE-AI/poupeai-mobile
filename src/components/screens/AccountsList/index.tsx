import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { AccountListItem } from '@/components/atoms/AccountListItem';
import { Account } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';

// Mock data - substituir por dados reais da API
const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta Corrente Principal',
    description: 'Banco do Brasil - Conta para movimentação diária',
    initial_balance: 2500.00,
    current_balance: 3250.75,
    is_default: true,
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-07-20T00:00:00Z',
  },
  {
    id: '2',
    name: 'Poupança',
    description: 'Reserva de emergência e investimentos',
    initial_balance: 15000.00,
    current_balance: 18450.30,
    is_default: false,
    profile: 'user-1',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-07-22T00:00:00Z',
  },
  {
    id: '3',
    name: 'Conta Investimentos',
    description: 'XP Investimentos - Carteira diversificada',
    initial_balance: 8750.50,
    current_balance: 9125.85,
    is_default: false,
    profile: 'user-1',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-07-23T00:00:00Z',
  },
  {
    id: '4',
    name: 'Cartão de Crédito',
    description: 'Nubank - Gastos do mês',
    initial_balance: -1200.00,
    current_balance: -856.40,
    is_default: false,
    profile: 'user-1',
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
];

export const AccountsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const handleAccountPress = (account: Account) => {
    // TODO: Implementar navegação para detalhes da conta
    console.log('Conta selecionada:', account.name);
  };

  const handleEditAccount = (account: Account) => {
    // TODO: Implementar edição de conta
    console.log('Editar conta:', account.name);
  };

  const handleDeleteAccount = (account: Account) => {
    // TODO: Implementar exclusão de conta
    console.log('Excluir conta:', account.name);
  };

  const handleAddAccount = () => {
    // TODO: Implementar adição de conta
    console.log('Adicionar nova conta');
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <AccountListItem
      account={item}
      onPress={handleAccountPress}
      onEdit={handleEditAccount}
      onDelete={handleDeleteAccount}
    />
  );

  const renderEmptyState = () => (
    <View style={style.emptyContainer}>
      <Ionicons name="wallet-outline" size={64} color={colors.theme[theme].textSecondary} />
      <Text style={style.emptyTitle}>Nenhuma conta encontrada</Text>
      <Text style={style.emptySubtitle}>
        Adicione suas contas bancárias para começar a organizar suas finanças
      </Text>
    </View>
  );

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.headerTitle}>Contas</Text>
        <TouchableOpacity style={style.addButton} onPress={handleAddAccount}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockAccounts}
        keyExtractor={(item) => item.id}
        renderItem={renderAccountItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};
