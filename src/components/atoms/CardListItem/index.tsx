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
  onPress?: (card: Card) => void;
  onEdit?: (card: Card) => void;
  onDelete?: (card: Card) => void;
}

export const CardListItem = ({
  card,
  onPress,
  onEdit,
  onDelete,
}: CardListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const cardLimitPercentage: number = (card.usedCreditLimit / card.creditLimit) * 100;

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
          <Text style={style.brandText}>{card.institution.name}</Text>
          <Text style={[style.usedText, { color: card.institution.mainColorHex || colors.primary[500] }]}>
            {formatCurrencySimple(card.usedCreditLimit)} usado
          </Text>
        </View>

        <View style={style.progressSection}>
          <View style={style.progressBar}>
            <View
              style={[
                style.progressFill,
                {
                  width: `${Math.min(cardLimitPercentage, 100)}%`,
                  backgroundColor: card.institution.mainColorHex || colors.primary[500],
                },
              ]}
            />
          </View>

          <View style={style.progressFooter}>
            <Text style={[style.availableText, { color: card.institution.mainColorHex || colors.primary[500] }]}>
              {formatCurrencySimple(card.creditLimit - card.usedCreditLimit)} disponível
            </Text>
            <Text style={[style.percentageText, { color: card.institution.mainColorHex || colors.primary[500] }]}>
              {cardLimitPercentage.toFixed(0)}%
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
