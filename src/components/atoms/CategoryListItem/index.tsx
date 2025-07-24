import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { Category, CategoryType } from '@/types';
import { styles } from './styles';
import { colors } from '@/constants/theme';

interface CategoryListItemProps {
  category: Category;
  onPress?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export const CategoryListItem = ({ 
  category, 
  onPress, 
  onEdit, 
  onDelete 
}: CategoryListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const getTypeIcon = (type: CategoryType) => {
    return type === 'income' ? 'arrow-up-circle' : 'arrow-down-circle';
  };

  const getTypeLabel = (type: CategoryType) => {
    return type === 'income' ? 'Receita' : 'Despesa';
  };

  return (
    <TouchableOpacity 
      style={[style.container, { borderLeftColor: category.color_hex }]}
      onPress={() => onPress?.(category)}
      activeOpacity={0.7}
    >
      <View style={style.leftContainer}>
        <View style={style.categoryInfo}>
          <Text style={style.nameText}>{category.name}</Text>
          <View style={style.typeContainer}>
            <Ionicons 
              name={getTypeIcon(category.type)} 
              size={14} 
              color={category.type === 'income' ? colors.feedback.success : colors.feedback.error} 
            />
            <Text style={[
              style.typeText, 
              { color: category.type === 'income' ? colors.feedback.success : colors.feedback.error }
            ]}>
              {getTypeLabel(category.type)}
            </Text>
          </View>
        </View>
      </View>

      <View style={style.rightContainer}>
        <View style={style.actionsContainer}>
          {onEdit && (
            <TouchableOpacity
              style={style.actionButton}
              onPress={() => onEdit(category)}
            >
              <Ionicons name="pencil" size={18} color={colors.theme[theme].textSecondary} />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity
              style={style.actionButton}
              onPress={() => onDelete(category)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.feedback.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
