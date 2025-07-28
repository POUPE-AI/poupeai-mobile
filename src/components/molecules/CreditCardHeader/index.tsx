import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/types';
import { styles } from './styles';
import { Text } from '@/components/atoms/Text';
import { formatCurrency } from '@/utils/currency';

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
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.cardName}>{card.name}</Text>
        <View style={style.brandBadge}>
          <Text style={style.brandText}>{getBrandDisplayName(card.brand)}</Text>
        </View>
      </View>

      <View style={style.limitContainer}>
        <Text style={style.limitLabel}>Limite de Crédito</Text>
        <Text style={style.limitValue}>
          {formatCurrency(parseFloat(card.credit_limit))}
        </Text>
      </View>

      <View style={style.detailsContainer}>
        <View style={style.detailItem}>
          <Text style={style.detailLabel}>Fechamento</Text>
          <Text style={style.detailValue}>Dia {card.closing_day}</Text>
        </View>
        
        <View style={style.detailItem}>
          <Text style={style.detailLabel}>Vencimento</Text>
          <Text style={style.detailValue}>Dia {card.due_day}</Text>
        </View>
        
        <View style={style.detailItem}>
          <Text style={style.detailLabel}>Disponível</Text>
          <Text style={style.detailValue}>
            {formatCurrency(card.available_credit_limit)}
          </Text>
        </View>
      </View>

      {card.additional_info && (
        <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)' }}>
          <Text style={style.detailLabel}>Informações Adicionais</Text>
          <Text style={[style.detailValue, { fontSize: 14, marginTop: 4 }]}>
            {card.additional_info}
          </Text>
        </View>
      )}
    </View>
  );
};
