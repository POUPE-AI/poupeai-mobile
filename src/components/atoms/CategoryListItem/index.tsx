import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/atoms/Text';
import { ActionButton } from '@/components/atoms/ActionButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Category, CategoryType } from '@/types';
import { styles } from './styles';
import { colors } from '@/constants/theme';

interface CategoryListItemProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export const CategoryListItem = ({ 
  category, 
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
    <View 
      style={[style.container, { borderLeftColor: category.color_hex }]}
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
            <ActionButton
              iconName="pencil"
              onPress={() => onEdit(category)}
              size={18}
            />
          )}
          
          {onDelete && (
            <ActionButton
              iconName="trash-outline"
              onPress={() => onDelete(category)}
              size={18}
            />
          )}
        </View>
      </View>
    </View>
  );
};
