import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { AccountListItem } from '@/components/atoms/AccountListItem';
import { Account, CreateBankAccountRequest } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';
import { useBankAccounts, useCreateBankAccount, useUpdateBankAccount, useDeleteBankAccount } from '@/hooks/useBankAccounts';
import { BankAccountModal } from '@/components/molecules/BankAccountModal';
import { ConfirmDeleteModal } from '@/components/molecules/ConfirmDeleteModal';

export const AccountsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  
  const { data: bankAccountsData, isLoading, error } = useBankAccounts();
  const createBankAccountMutation = useCreateBankAccount();
  const updateBankAccountMutation = useUpdateBankAccount();
  const deleteBankAccountMutation = useDeleteBankAccount();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleDeleteAccount = (account: Account) => {
    setAccountToDelete(account);
    setDeleteModalVisible(true);
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const handleSaveAccount = async (data: CreateBankAccountRequest) => {
    try {
      if (modalMode === 'edit' && selectedAccount) {
        await updateBankAccountMutation.mutateAsync({
          id: selectedAccount.id,
          ...data,
        });
      } else {
        await createBankAccountMutation.mutateAsync(data);
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
      console.error('Erro ao salvar conta:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    
    try {
      await deleteBankAccountMutation.mutateAsync(accountToDelete.id);
      setDeleteModalVisible(false);
      setAccountToDelete(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a conta. Tente novamente.');
      console.error('Erro ao excluir conta:', error);
    }
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <AccountListItem
      account={item}
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
      <>
        <View style={style.container}>
          <View style={style.header}>
            <Text style={style.headerTitle}>Contas</Text>
            <TouchableOpacity style={style.addButton} onPress={handleAddAccount}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {renderLoadingState()}
        </View>

        <BankAccountModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveAccount}
          account={selectedAccount}
          mode={modalMode}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
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

        <BankAccountModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveAccount}
          account={selectedAccount}
          mode={modalMode}
        />
      </>
    );
  }

  return (
    <>
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

      <BankAccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAccount}
        account={selectedAccount}
        mode={modalMode}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Conta"
        message={`Tem certeza que deseja excluir a conta "${accountToDelete?.name}"?`}
        itemName={accountToDelete?.name}
        loading={deleteBankAccountMutation.isPending}
      />
    </>
  );
};
