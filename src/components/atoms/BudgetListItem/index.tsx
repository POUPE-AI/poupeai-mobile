import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { ActionButton } from '@/components/atoms/ActionButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Budget, BudgetProgress } from '@/types';
import { styles } from './styles';
import { colors } from '@/constants/theme';

interface BudgetListItemProps {
  budget: Budget;
  categoryName: string;
  categoryColor: string;
  progress: BudgetProgress;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

export const BudgetListItem = ({ 
  budget, 
  categoryName,
  categoryColor,
  progress,
  onEdit, 
  onDelete 
}: BudgetListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getProgressColor = (status: BudgetProgress['status']) => {
    switch (status) {
      case 'safe':
        return colors.feedback.success;
      case 'warning':
        return colors.feedback.warning;
      case 'danger':
        return colors.feedback.error;
      default:
        return colors.theme[theme].border;
    }
  };

  const getStatusText = (status: BudgetProgress['status']) => {
    switch (status) {
      case 'safe':
        return 'Dentro do limite';
      case 'warning':
        return 'Próximo do limite';
      case 'danger':
        return 'Limite excedido';
      default:
        return '';
    }
  };

  return (
    <View 
      style={[style.container, { borderLeftColor: categoryColor }]}
    >
      <View style={style.budgetInfo}>
        <View style={style.headerRow}>
          <Text style={style.nameText}>{budget.name}</Text>
          <Text style={style.limitText}>{budget.amount}</Text>
        </View>

        <View style={style.categoryRow}>
          <Text style={style.categoryText}>{categoryName}</Text>
          <Text style={[style.statusText, { color: getProgressColor(progress.status) }]}>
            {getStatusText(progress.status)}
          </Text>
        </View>

        <View style={style.progressSection}>
          <View style={style.progressHeader}>
            <Text style={style.progressText}>
              {formatCurrency(budget.actual_amount)} gastos
            </Text>
            <Text style={[style.percentageText, { color: getProgressColor(progress.status) }]}>
              {progress.percentage.toFixed(0)}%
            </Text>
          </View>

          <View style={style.progressBar}>
            <View 
              style={[
                style.progressFill, 
                { 
                  width: `${Math.min(progress.percentage, 100)}%`,
                  backgroundColor: getProgressColor(progress.status)
                }
              ]} 
            />
          </View>

          <View style={style.progressFooter}>
            <View style={style.remainingContainer}>
              <Text style={style.remainingText}>
                {progress.remaining >= 0 
                  ? `${formatCurrency(progress.remaining)} restante`
                  : `${formatCurrency(Math.abs(progress.remaining))} excedido`
                }
              </Text>
            </View>
            
            <View style={style.actionsContainer}>
              {onEdit && (
                <ActionButton
                  iconName="pencil"
                  onPress={() => onEdit(budget)}
                  size={18}
                />
              )}
              
              {onDelete && (
                <ActionButton
                  iconName="trash-outline"
                  onPress={() => onDelete(budget)}
                  size={18}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
