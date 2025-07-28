import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { BudgetListItem } from '@/components/atoms/BudgetListItem';
import { BudgetModal } from '@/components/molecules/BudgetModal';
import { CategoryModal } from '@/components/molecules/CategoryModal';
import { ConfirmDeleteModal } from '@/components/molecules/ConfirmDeleteModal';
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '@/hooks/useBudgets';
import { useCategories, useCreateCategory } from '@/hooks/useCategories';
import { Budget, BudgetProgress, CreateBudgetRequest } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';

export const BudgetsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  
  const { data: budgetsData, isLoading: budgetsLoading, error: budgetsError } = useBudgets();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();
  const createCategoryMutation = useCreateCategory();

  const budgets = budgetsData?.results || [];
  const categories = categoriesData?.results || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const handleCreateBudget = () => {
    setModalMode('create');
    setSelectedBudget(null);
    setModalVisible(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setModalMode('edit');
    setSelectedBudget(budget);
    setModalVisible(true);
  };

  const handleDeleteBudget = (budget: Budget) => {
    setBudgetToDelete(budget);
    setDeleteModalVisible(true);
  };

  const handleSaveBudget = async (data: CreateBudgetRequest) => {
    try {
      if (modalMode === 'create') {
        await createBudgetMutation.mutateAsync(data);
      } else if (selectedBudget) {
        await updateBudgetMutation.mutateAsync({
          id: selectedBudget.id,
          data,
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o orçamento. Tente novamente.');
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    
    try {
      await deleteBudgetMutation.mutateAsync(budgetToDelete.id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o orçamento. Tente novamente.');
      throw error;
    }
  };

  const handleAddBudget = () => {
    handleCreateBudget();
  };

  const handleCreateCategory = () => {
    setCategoryModalVisible(true);
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      await createCategoryMutation.mutateAsync(categoryData);
      setCategoryModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a categoria. Tente novamente.');
      throw error;
    }
  };

  const calculateProgress = (budget: Budget): BudgetProgress => {
    const amount = parseFloat(budget.amount);
    const percentage = (budget.actual_amount / amount) * 100;
    const remaining = amount - budget.actual_amount;
    
    let status: BudgetProgress['status'] = 'safe';
    if (percentage >= 100) {
      status = 'danger';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    return {
      percentage,
      status,
      remaining,
    };
  };

  const getCategoryInfo = (categoryId: number) => {
    const category = categories.find(cat => String(cat.id) === String(categoryId));
    return {
      name: category?.name || 'Categoria não encontrada',
      color: category?.color_hex || colors.theme[theme].border,
    };
  };

  const renderBudgetItem = ({ item }: { item: Budget }) => {
    const categoryInfo = getCategoryInfo(item.category);
    const progress = calculateProgress(item);

    const adaptedBudget = {
      ...item,
      amount: parseFloat(item.amount)
    } as any;

    return (
      <BudgetListItem
        budget={adaptedBudget}
        categoryName={categoryInfo.name}
        categoryColor={categoryInfo.color}
        progress={progress}
        onEdit={handleEditBudget}
        onDelete={handleDeleteBudget}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={style.emptyContainer}>
      <Ionicons name="wallet-outline" size={64} color={colors.theme[theme].textSecondary} />
      <Text style={style.emptyTitle}>Nenhum orçamento encontrado</Text>
      <Text style={style.emptySubtitle}>
        Crie orçamentos para suas categorias e monitore seus gastos mensais
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={style.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.feedback.error} />
      <Text style={style.emptyTitle}>Erro ao carregar orçamentos</Text>
      <Text style={style.emptySubtitle}>
        Verifique sua conexão e tente novamente
      </Text>
    </View>
  );

  if (budgetsLoading || categoriesLoading) {
    return (
      <View style={style.container}>
        <View style={style.header}>
          <Text style={style.headerTitle}>Orçamentos</Text>
          <TouchableOpacity style={style.addButton} onPress={handleAddBudget}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={[style.emptyContainer, { flex: 1 }]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={style.emptySubtitle}>Carregando orçamentos...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={style.container}>
        <View style={style.header}>
          <Text style={style.headerTitle}>Orçamentos</Text>
          <TouchableOpacity style={style.addButton} onPress={handleAddBudget}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBudgetItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.listContent}
          ListEmptyComponent={budgetsError ? renderErrorState : renderEmptyState}
        />
      </View>

      <BudgetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveBudget}
        budget={selectedBudget}
        mode={modalMode}
        onCreateCategory={handleCreateCategory}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Orçamento"
        message="Tem certeza que deseja excluir este orçamento?"
        itemName={budgetToDelete?.name}
        loading={deleteBudgetMutation.isPending}
      />

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleSaveCategory}
        mode="create"
      />
    </>
  );
};
