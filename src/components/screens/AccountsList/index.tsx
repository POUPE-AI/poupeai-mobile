import React from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { AccountListItem } from '@/components/atoms/AccountListItem';
import { Account } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';
import { useBankAccounts } from '@/hooks/useBankAccounts';

export const AccountsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  
  const { data: bankAccountsData, isLoading, error } = useBankAccounts();

  const handleAccountPress = (account: Account) => {
    console.log('Conta selecionada:', account.name);
  };

  const handleEditAccount = (account: Account) => {
    console.log('Editar conta:', account.name);
  };

  const handleDeleteAccount = (account: Account) => {
    console.log('Excluir conta:', account.name);
  };

  const handleAddAccount = () => {
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

  const renderLoadingState = () => (
    <View style={style.emptyContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={style.emptyTitle}>Carregando contas...</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={style.container}>
        <View style={style.header}>
          <Text style={style.headerTitle}>Contas</Text>
          <TouchableOpacity style={style.addButton} onPress={handleAddAccount}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {renderLoadingState()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={style.container}>
        <View style={style.header}>
          <Text style={style.headerTitle}>Contas</Text>
          <TouchableOpacity style={style.addButton} onPress={handleAddAccount}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={style.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.feedback.error} />
          <Text style={style.emptyTitle}>Erro ao carregar contas</Text>
          <Text style={style.emptySubtitle}>
            Verifique sua conexão e tente novamente
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.headerTitle}>Contas</Text>
        <TouchableOpacity style={style.addButton} onPress={handleAddAccount}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bankAccountsData?.results || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAccountItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};
