import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { ActionButton } from '@/components/atoms/ActionButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Account } from '@/types';
import { styles } from './styles';

interface AccountListItemProps {
  account: Account;
  onPress?: (account: Account) => void;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
}

export const AccountListItem = ({ 
  account, 
  onPress, 
  onEdit, 
  onDelete 
}: AccountListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  return (
    <TouchableOpacity 
      style={[style.container, account.is_default && style.defaultContainer]}
      onPress={() => onPress?.(account)}
      activeOpacity={0.7}
    >
      {account.is_default && (
        <View style={style.defaultHeader}>
          <Text style={style.defaultHeaderText}>PADRÃO</Text>
        </View>
      )}

      <View style={style.contentContainer}>
        <View style={style.topRow}>
          <Text style={style.nameText}>{account.name}</Text>
          <Text style={[
            style.balanceText, 
            account.current_balance < 0 && style.negativeBalance
          ]}>
            {formatCurrency(account.current_balance)}
          </Text>
        </View>

        <View style={style.bottomRow}>
          <Text style={style.descriptionText} numberOfLines={2}>
            {account.description}
          </Text>
          <View style={style.actionsContainer}>
            {onEdit && (
              <ActionButton
                iconName="pencil"
                onPress={() => onEdit(account)}
              />
            )}
            
            {onDelete && (
              <ActionButton
                iconName="trash-outline"
                onPress={() => onDelete(account)}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
