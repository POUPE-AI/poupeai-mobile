import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { CategoryType } from '@/types';
import { styles } from './styles';

interface CategoryFilterTagProps {
  type: CategoryType;
  isActive: boolean;
  onPress: (type: CategoryType) => void;
}

export const CategoryFilterTag = ({ type, isActive, onPress }: CategoryFilterTagProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const getTagInfo = (type: CategoryType) => {
    return type === 'income' 
      ? { label: 'Receitas', icon: 'arrow-up-circle', color: '#10B981' }
      : { label: 'Despesas', icon: 'arrow-down-circle', color: '#EF4444' };
  };

  const tagInfo = getTagInfo(type);

  return (
    <TouchableOpacity
      style={[
        style.container,
        isActive && { ...style.activeContainer, borderColor: tagInfo.color }
      ]}
      onPress={() => onPress(type)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={tagInfo.icon as any}
        size={16}
        color={isActive ? tagInfo.color : style.inactiveText.color}
      />
      <Text
        style={[
          style.text,
          isActive ? { color: tagInfo.color } : style.inactiveText
        ]}
      >
        {tagInfo.label}
      </Text>
    </TouchableOpacity>
  );
};
