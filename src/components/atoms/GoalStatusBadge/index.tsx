import React from "react";
import { View } from "react-native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Text } from "@/components/atoms/Text";
import { Goal } from "@/types/goals";
import { styles } from "./styles";

interface GoalStatusBadgeProps {
  goal: Goal;
}

export const GoalStatusBadge: React.FC<GoalStatusBadgeProps> = ({ goal }) => {
  if (!goal.is_completed) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.completedText}>✅ Meta Concluída</Text>
      {goal.completed_at && (
        <Text style={styles.completedDate}>
          Concluída em{" "}
          {format(parseISO(goal.completed_at), "dd/MM/yyyy", { locale: ptBR })}
        </Text>
      )}
    </View>
  );
};
