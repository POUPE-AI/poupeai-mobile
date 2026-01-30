import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/types';
import { styles } from './styles';
import { Text } from '@/components/atoms/Text';
import { formatCurrency } from '@/utils/currency';
import { colors } from '@/constants/theme';

interface CreditCardHeaderProps {
  card: Card;
}

export const CreditCardHeader: React.FC<CreditCardHeaderProps> = ({ card }) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const getBrandDisplayName = (brand: string) => {
    const brandMap: { [key: string]: string } = {
      'VISA': 'Visa',
      'MASTERCARD': 'Mastercard',
      'AMEX': 'American Express',
      'ELO': 'Elo',
      'HIPERCARD': 'Hipercard',
    };
    return brandMap[brand] || brand;
  };

  return (
    <View style={[style.container, { backgroundColor: card.institution.mainColorHex || colors.primary[600] }]}>
      <View style={style.header}>
        <Text style={style.cardName}>{card.name}</Text>
        <View style={style.brandBadge}>
          <Text style={style.brandText}>{getBrandDisplayName(card.institution.name)}</Text>
        </View>
      </View>

      <View style={style.limitContainer}>
        <Text style={style.limitLabel}>Limite de Crédito</Text>
        <Text style={style.limitValue}>
          {formatCurrency(card.creditLimit)}
        </Text>
      </View>

      <View style={style.detailsContainer}>
        <View style={style.detailItem}>
          <Text style={style.detailLabel}>Fechamento</Text>
          <Text style={style.detailValue}>Dia {card.closingDay}</Text>
        </View>
        
        <View style={style.detailItem}>
          <Text style={style.detailLabel}>Vencimento</Text>
          <Text style={style.detailValue}>Dia {card.dueDay}</Text>
        </View>
        
        <View style={style.detailItem}>
          <Text style={style.detailLabel}>Disponível</Text>
          <Text style={style.detailValue}>
            {formatCurrency(card.creditLimit - card.usedCreditLimit)}
          </Text>
        </View>
      </View> 
    </View>
  );
};
