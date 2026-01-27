import { Text } from "@/components/atoms/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Goal } from "@/types/goals";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { parseISO, differenceInDays } from "date-fns";
import { createGoalListItemStyles } from "./styles";
import { colors } from "@/constants/theme";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@/components/atoms/Button";
import { ActionButton } from "@/components/atoms/ActionButton";

interface GoalListItemProps {
  goal: Goal;
  onDeposit?: (goal: Goal) => void;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
}

export const GoalListItem = ({
  goal,
  onDeposit,
  onEdit,
  onDelete,
}: GoalListItemProps) => {
  const { theme } = useTheme();
  const styles = createGoalListItemStyles(theme, goal.colorHex);

  const progress = goal.percentageCompleted || 0;
  const goalAmount = goal.goalAmount;
  const remainingAmount = goalAmount - goal.currentBalance;
  const daysRemaining = differenceInDays(parseISO(goal.targetDate), new Date());

  return (
    <View key={goal.id} style={styles.container}>
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          <Text variant="h3">{goal.name}</Text>
          {goal.description ?? (
            <Text variant="caption" color="textSecondary">
              {goal.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {formatCurrency(goal.currentBalance)} de{" "}
            {formatCurrency(goalAmount)}
          </Text>
          <Text style={styles.progressPercentage}>
            {Number.isInteger(progress) ? progress : progress.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: goal.colorHex,
              },
            ]}
          />
        </View>

        <View style={styles.goalFooter}>
          <Text style={styles.remainingAmount} color="textSecondary">
            Faltam {formatCurrency(remainingAmount)}
          </Text>
          <Text style={styles.daysRemaining}>
            {daysRemaining > 0 ? `${daysRemaining} dias` : "Vencido"}
          </Text>
        </View>

        <View style={styles.actionFooter}>
          <View style={styles.leftActions}>
            {!goal.completedAt && onDeposit && (
              <Button
                title="Fazer Depósito"
                onPress={() => onDeposit(goal)}
                size="small"
                style={styles.depositButton}
              />
            )}
          </View>

          <View style={styles.rightActions}>
            {onEdit && (
              <ActionButton
                iconName="pencil"
                onPress={() => onEdit(goal)}
                size={18}
              />
            )}

            {onDelete && (
              <ActionButton
                iconName="trash-outline"
                onPress={() => onDelete(goal)}
                size={18}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
