import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { FormField } from '@/components/atoms/FormField';
import { Text } from '@/components/atoms/Text';
import { styles } from './styles';
import { TransactionSourceType } from '@/types/transactions';

interface TransactionTypeSelectorProps {
  selectedType: TransactionSourceType;
  onTypeSelect: (type: TransactionSourceType) => void;
  error?: string;
}

export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
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
            selectedType === 'BANK_ACCOUNT' && style.typeButtonActive,
          ]}
          onPress={() => onTypeSelect('BANK_ACCOUNT')}
        >
          <Text style={[
            style.typeButtonText,
            selectedType === 'BANK_ACCOUNT' && style.typeButtonTextActive,
          ]}>
            Conta Bancária
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            style.typeButton,
            selectedType === 'CREDIT_CARD' && style.typeButtonActive,
          ]}
          onPress={() => onTypeSelect('CREDIT_CARD')}
        >
          <Text style={[
            style.typeButtonText,
            selectedType === 'CREDIT_CARD' && style.typeButtonTextActive,
          ]}>
            Cartão de Crédito
          </Text>
        </TouchableOpacity>
      </View>
    </FormField>
  );
};
