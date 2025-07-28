import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { FormField } from '@/components/atoms/FormField';
import { Text } from '@/components/atoms/Text';
import { styles } from './styles';

interface TypeSelectorProps {
  selectedType: 'income' | 'expense';
  onTypeSelect: (type: 'income' | 'expense') => void;
  error?: string;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  error,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <FormField label="Tipo" error={error}>
      <View style={style.typeContainer}>
        <TouchableOpacity
          style={[
            style.typeButton,
            selectedType === 'income' && style.typeButtonActive,
          ]}
          onPress={() => onTypeSelect('income')}
        >
          <Text style={[
            style.typeButtonText,
            selectedType === 'income' && style.typeButtonTextActive,
          ]}>
            Receita
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            style.typeButton,
            selectedType === 'expense' && style.typeButtonActive,
          ]}
          onPress={() => onTypeSelect('expense')}
        >
          <Text style={[
            style.typeButtonText,
            selectedType === 'expense' && style.typeButtonTextActive,
          ]}>
            Despesa
          </Text>
        </TouchableOpacity>
      </View>
    </FormField>
  );
};
