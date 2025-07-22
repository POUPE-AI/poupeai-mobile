import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { Goal } from "@/types/goals";
import { GoalListItem } from "@/components/molecules/GoalListItem";
import { useTheme } from "@/contexts/ThemeContext";
import { createGoalsListStyles } from "./styles";

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Viagem para Europa",
    description: "Economizar para uma viagem de 15 dias",
    targetAmount: 8000,
    currentAmount: 2500,
    targetDate: "2025-12-31",
  },
  {
    id: "2",
    title: "Emergência",
    description: "Reserva de emergência para 6 meses",
    targetAmount: 15000,
    currentAmount: 5200,
    targetDate: "2025-10-01",
  },
  {
    id: "3",
    title: "Novo Celular",
    description: "iPhone 15 Pro Max",
    targetAmount: 3500,
    currentAmount: 800,
    targetDate: "2025-09-15",
  },
];

export const GoalsList = () => {
  const { theme } = useTheme();
  const styles = createGoalsListStyles(theme);

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <GoalListItem goal={item} />
  );

  const renderNewGoalCard = () => (
    <TouchableOpacity style={styles.newGoalCard}>
      <Ionicons
        name="add-circle-outline"
        size={32}
        color={colors.primary[500]}
      />
      <Text style={styles.newGoalText}>Criar Nova Meta</Text>
      <Text style={styles.newGoalSubtext}>
        Defina um objetivo e comece a economizar
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Minhas Metas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.goalsList}
        contentContainerStyle={styles.flatListContent}
        data={mockGoals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoalItem}
        ListFooterComponent={renderNewGoalCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
