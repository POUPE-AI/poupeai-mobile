import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { styles } from './styles';
import { Text } from '@/components/atoms/Text';

export const EmptyInvoicesState: React.FC = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.container}>
      <View style={style.iconContainer}>
        <Ionicons 
          name="document-text-outline" 
          size={32} 
          color={theme === 'light' ? '#9CA3AF' : '#6B7280'} 
        />
      </View>
      <Text style={style.title}>Nenhuma fatura encontrada</Text>
      <Text style={style.description}>
        As faturas deste cartão aparecerão aqui quando forem geradas pelo sistema.
      </Text>
    </View>
  );
};
