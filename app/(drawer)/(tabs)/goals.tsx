import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: string;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Viagem para Europa',
    description: 'Economizar para uma viagem de 15 dias',
    targetAmount: 8000,
    currentAmount: 2500,
    targetDate: '2025-12-31',
    category: 'Viagem',
    icon: 'airplane',
  },
  {
    id: '2',
    title: 'Emergência',
    description: 'Reserva de emergência para 6 meses',
    targetAmount: 15000,
    currentAmount: 5200,
    targetDate: '2025-10-01',
    category: 'Segurança',
    icon: 'shield-checkmark',
  },
  {
    id: '3',
    title: 'Novo Celular',
    description: 'iPhone 15 Pro Max',
    targetAmount: 3500,
    currentAmount: 800,
    targetDate: '2025-09-15',
    category: 'Tecnologia',
    icon: 'phone-portrait',
  },
];

export default function Goals() {
  const renderGoal = (goal: Goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const daysRemaining = Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalIcon}>
            <Ionicons name={goal.icon as any} size={24} color={colors.primary[500]} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
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
            <Text style={styles.remainingAmount}>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo das Metas</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Metas Ativas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>R$ 8.500</Text>
              <Text style={styles.statLabel}>Total Economizado</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Minhas Metas</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {mockGoals.map(renderGoal)}

        <TouchableOpacity style={styles.newGoalCard}>
          <Ionicons name="add-circle-outline" size={32} color={colors.primary[500]} />
          <Text style={styles.newGoalText}>Criar Nova Meta</Text>
          <Text style={styles.newGoalSubtext}>Defina um objetivo e comece a economizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme.light.surface,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  summaryCard: {
    backgroundColor: colors.theme.light.surface,
    borderRadius: 12,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme.light.text,
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.theme.light.textSecondary,
  },
  goalsList: {
    flex: 1,
    padding: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme.light.text,
  },
  addButton: {
    backgroundColor: colors.primary[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme.light.text,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.theme.light.textSecondary,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.theme.light.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.theme.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingAmount: {
    fontSize: 12,
    color: colors.theme.light.textSecondary,
  },
  daysRemaining: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: '500',
  },
  newGoalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[200],
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  newGoalText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary[500],
    marginTop: 12,
    marginBottom: 4,
  },
  newGoalSubtext: {
    fontSize: 14,
    color: colors.theme.light.textSecondary,
    textAlign: 'center',
  },
});
