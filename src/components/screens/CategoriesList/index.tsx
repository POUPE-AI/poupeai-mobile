import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { CategoryListItem } from '@/components/atoms/CategoryListItem';
import { CategoryFilterTag } from '@/components/atoms/CategoryFilterTag';
import { Category, CategoryType } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';

// Mock data - substituir por dados reais da API
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salário',
    color_hex: '#10B981',
    type: 'income',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Freelance',
    color_hex: '#059669',
    type: 'income',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Alimentação',
    color_hex: '#FF9800',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Transporte',
    color_hex: '#2196F3',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Contas',
    color_hex: '#9E9E9E',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Investimentos',
    color_hex: '#8E24AA',
    type: 'income',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Lazer',
    color_hex: '#E91E63',
    type: 'expense',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

export const CategoriesList = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  // Estado para controlar os filtros ativos
  const [activeFilters, setActiveFilters] = useState<CategoryType[]>(['income', 'expense']);

  // Categorias filtradas baseadas nos filtros ativos
  const filteredCategories = useMemo(() => {
    return mockCategories.filter(category => 
      activeFilters.includes(category.type)
    );
  }, [activeFilters]);

  // Função para alternar filtros
  const toggleFilter = (type: CategoryType) => {
    setActiveFilters(prev => {
      if (prev.includes(type)) {
        // Se já está ativo, remove (mas mantém pelo menos um ativo)
        return prev.length > 1 ? prev.filter(t => t !== type) : prev;
      } else {
        // Se não está ativo, adiciona
        return [...prev, type];
      }
    });
  };

  const handleCategoryPress = (category: Category) => {
    // TODO: Implementar navegação para detalhes da categoria
    console.log('Categoria selecionada:', category.name);
  };

  const handleEditCategory = (category: Category) => {
    // TODO: Implementar edição de categoria
    console.log('Editar categoria:', category.name);
  };

  const handleDeleteCategory = (category: Category) => {
    // TODO: Implementar exclusão de categoria
    console.log('Excluir categoria:', category.name);
  };

  const handleAddCategory = () => {
    // TODO: Implementar adição de categoria
    console.log('Adicionar nova categoria');
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryListItem
      category={item}
      onPress={handleCategoryPress}
      onEdit={handleEditCategory}
      onDelete={handleDeleteCategory}
    />
  );

  const renderEmptyState = () => (
    <View style={style.emptyContainer}>
      <Ionicons name="folder-open-outline" size={64} color={colors.theme[theme].textSecondary} />
      <Text style={style.emptyTitle}>Nenhuma categoria encontrada</Text>
      <Text style={style.emptySubtitle}>
        {activeFilters.length === 1 
          ? `Não há categorias de ${activeFilters[0] === 'income' ? 'receita' : 'despesa'} cadastradas`
          : 'Ajuste os filtros ou crie uma nova categoria'
        }
      </Text>
    </View>
  );

  return (
    <View style={style.container}>
      {/* Header */}
      <View style={style.header}>
        <Text style={style.headerTitle}>Categorias</Text>
        <TouchableOpacity style={style.addButton} onPress={handleAddCategory}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={style.filtersContainer}>
        <View style={style.filtersRow}>
          <CategoryFilterTag
            type="income"
            isActive={activeFilters.includes('income')}
            onPress={toggleFilter}
          />
          <CategoryFilterTag
            type="expense"
            isActive={activeFilters.includes('expense')}
            onPress={toggleFilter}
          />
        </View>
      </View>

      {/* Lista de categorias */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};
