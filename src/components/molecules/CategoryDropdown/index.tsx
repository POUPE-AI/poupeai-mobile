import React from 'react';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DropdownSelector } from '@/components/atoms/DropdownSelector';
import { FormField } from '@/components/atoms/FormField';
import { Text } from '@/components/atoms/Text';
import { Category } from '@/types';
import { colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { styles } from './styles';

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategoryId?: number;
  onSelect: (categoryId: number) => void;
  error?: string;
  isLoading?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  filterType?: 'income' | 'expense';
  onCreateCategory?: () => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
  error,
  isLoading = false,
  isOpen,
  onToggle,
  filterType,
  onCreateCategory,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const filteredCategories = filterType 
    ? categories.filter(cat => cat.type === filterType)
    : categories;

  const dropdownItems = filteredCategories.map(category => ({
    id: parseInt(category.id),
    label: category.name,
    color: category.color_hex,
  }));

  const handleSelect = (item: { id: string | number }) => {
    onSelect(item.id as number);
    onToggle(); // Fechar dropdown após seleção
  };

  if (isLoading) {
    return (
      <FormField label="Categoria" error={error}>
        <View style={style.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={style.loadingText}>Carregando categorias...</Text>
        </View>
      </FormField>
    );
  }

  return (
    <FormField label="Categoria" error={error}>
      <View style={style.container}>
        <View style={style.dropdownContainer}>
          <DropdownSelector
            items={dropdownItems}
            selectedId={selectedCategoryId}
            onSelect={handleSelect}
            placeholder="Selecione uma categoria"
            isOpen={isOpen}
            onToggle={onToggle}
            error={!!error}
            showColorDot={true}
          />
        </View>
        
        {onCreateCategory && (
          <TouchableOpacity 
            style={style.createButton}
            onPress={onCreateCategory}
          >
            <Ionicons 
              name="add" 
              size={20} 
              color={colors.theme[theme].text} 
            />
          </TouchableOpacity>
        )}
      </View>
    </FormField>
  );
};
