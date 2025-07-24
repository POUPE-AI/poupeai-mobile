import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { BudgetListItem } from '@/components/atoms/BudgetListItem';
import { Budget, BudgetProgress, Category } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';

// Mock data - substituir por dados reais da API
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Alimentação',
    color_hex: '#FF9800',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Transporte',
    color_hex: '#2196F3',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Lazer',
    color_hex: '#E91E63',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Contas',
    color_hex: '#9E9E9E',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

const mockBudgets: Budget[] = [
  {
    id: '1',
    category: '1',
    profile: 'user-1',
    name: 'Orçamento Alimentação',
    amount: 800.00,
    actual_amount: 650.50,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
  {
    id: '2',
    category: '2',
    profile: 'user-1',
    name: 'Orçamento Transporte',
    amount: 400.00,
    actual_amount: 380.75,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
  {
    id: '3',
    category: '3',
    profile: 'user-1',
    name: 'Orçamento Lazer',
    amount: 300.00,
    actual_amount: 325.20,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
  {
    id: '4',
    category: '4',
    profile: 'user-1',
    name: 'Orçamento Contas',
    amount: 1200.00,
    actual_amount: 450.30,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
];

export const BudgetsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const handleBudgetPress = (budget: Budget) => {
    // TODO: Implementar navegação para detalhes do orçamento
    console.log('Orçamento selecionado:', budget.name);
  };

  const handleEditBudget = (budget: Budget) => {
    // TODO: Implementar edição de orçamento
    console.log('Editar orçamento:', budget.name);
  };

  const handleDeleteBudget = (budget: Budget) => {
    // TODO: Implementar exclusão de orçamento
    console.log('Excluir orçamento:', budget.name);
  };

  const handleAddBudget = () => {
    // TODO: Implementar adição de orçamento
    console.log('Adicionar novo orçamento');
  };

  const calculateProgress = (budget: Budget): BudgetProgress => {
    const percentage = (budget.actual_amount / budget.amount) * 100;
    const remaining = budget.amount - budget.actual_amount;
    
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

  const getCategoryInfo = (categoryId: string) => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    return {
      name: category?.name || 'Categoria não encontrada',
      color: category?.color_hex || colors.theme[theme].border,
    };
  };

  const renderBudgetItem = ({ item }: { item: Budget }) => {
    const categoryInfo = getCategoryInfo(item.category);
    const progress = calculateProgress(item);

    return (
      <BudgetListItem
        budget={item}
        categoryName={categoryInfo.name}
        categoryColor={categoryInfo.color}
        progress={progress}
        onPress={handleBudgetPress}
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

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.headerTitle}>Orçamentos</Text>
        <TouchableOpacity style={style.addButton} onPress={handleAddBudget}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockBudgets}
        keyExtractor={(item) => item.id}
        renderItem={renderBudgetItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};
