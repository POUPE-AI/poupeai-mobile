import { Text } from "@/components/atoms/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Goal } from "@/types/goals";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { createGoalListItemStyles } from "./styles";
import { colors } from "@/constants/theme";

interface GoalListItemProps{
    goal: Goal
}

export const GoalListItem = ({ goal }: GoalListItemProps) => {
    const { theme } = useTheme();
    const styles = createGoalListItemStyles(theme);

    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const daysRemaining = Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity key={goal.id} style={styles.container}>
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text variant="h3">{goal.title}</Text>
            <Text variant="caption" color="textSecondary">{goal.description}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              R$ {goal.currentAmount.toFixed(2).replace('.', ',')} de R$ {goal.targetAmount.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          
          <View style={styles.goalFooter}>
            <Text style={styles.remainingAmount} color="textSecondary">
              Faltam R$ {remainingAmount.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.daysRemaining}>
              {daysRemaining > 0 ? `${daysRemaining} dias` : 'Vencido'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };