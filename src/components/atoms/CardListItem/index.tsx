import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardProgress } from "@/types/cards";
import { colors } from "@/constants/theme";
import { formatCurrencySimple } from "@/utils/currency";
import { styles } from "./styles";

interface CardListItemProps {
  card: Card;
  progress: CardProgress;
  onPress?: (card: Card) => void;
  onEdit?: (card: Card) => void;
  onDelete?: (card: Card) => void;
}

export const CardListItem = ({
  card,
  progress,
  onPress,
  onEdit,
  onDelete,
}: CardListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => onPress?.(card)}
      activeOpacity={0.7}
    >
      <View style={style.cardInfo}>
        <View style={style.headerRow}>
          <Text style={style.nameText}>{card.name}</Text>
          <Text style={style.limitText}>
            {formatCurrencySimple(card.creditLimit)}
          </Text>
        </View>

        <View style={style.brandRow}>
          <Text style={style.brandText}>{card.institutionId}</Text>
          <Text style={style.usedText}>
            {formatCurrencySimple(progress.used_amount)} usado
          </Text>
        </View>

        <View style={style.progressSection}>
          <View style={style.progressBar}>
            <View
              style={[
                style.progressFill,
                {
                  width: `${Math.min(progress.percentage, 100)}%`,
                  backgroundColor: colors.primary[500],
                },
              ]}
            />
          </View>

          <View style={style.progressFooter}>
            <Text style={style.availableText}>
              {formatCurrencySimple(progress.available_amount)} disponível
            </Text>
            <Text style={style.percentageText}>
              {progress.percentage.toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={style.datesSection}>
          <View style={style.dateItem}>
            <Text style={style.dateLabel}>Fechamento</Text>
            <Text style={style.dateValue}>Dia {card.closingDay}</Text>
          </View>
          <View style={style.dateItem}>
            <Text style={style.dateLabel}>Vencimento</Text>
            <Text style={style.dateValue}>Dia {card.dueDay}</Text>
          </View>

          <View style={style.actionsContainer}>
            {onEdit && (
              <ActionButton
                iconName="pencil"
                onPress={() => onEdit(card)}
                size={18}
              />
            )}

            {onDelete && (
              <ActionButton
                iconName="trash-outline"
                onPress={() => onDelete(card)}
                size={18}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
