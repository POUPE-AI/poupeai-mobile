import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { Goal, CreateGoalRequest } from "@/types/goals";
import { GoalListItem } from "@/components/molecules/GoalListItem";
import { GoalDepositModal } from "@/components/molecules/GoalDepositModal";
import { GoalModal } from "@/components/molecules/GoalModal";
import { ConfirmDeleteModal } from "@/components/molecules/ConfirmDeleteModal";
import { useTheme } from "@/contexts/ThemeContext";
import { createGoalsListStyles } from "./styles";
import { useGoals, useCreateGoalDeposit, useCreateGoal, useUpdateGoal, useDeleteGoal } from "@/hooks/useGoals";
import { useState } from "react";

export const GoalsList = () => {
  const { theme } = useTheme();
  const styles = createGoalsListStyles(theme);
  
  const { data: goalsData, isLoading, error } = useGoals();
  const createGoalDepositMutation = useCreateGoalDeposit();
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();
  const goals = goalsData?.results || [];

  // Modal states
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // Selected items
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  
  // Modal mode
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleDeposit = (goal: Goal) => {
    setSelectedGoal(goal);
    setDepositModalVisible(true);
  };

  const handleConfirmDeposit = async (depositAmount: string, depositDate: string, note?: string) => {
    if (!selectedGoal) return;

    const amount = parseFloat(depositAmount.replace(',', '.'));
    
    await createGoalDepositMutation.mutateAsync({
      goalId: selectedGoal.id,
      deposit_amount: amount.toString(),
      deposit_at: depositDate,
      note,
    });
    
    setDepositModalVisible(false);
    setSelectedGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setModalMode('edit');
    setGoalModalVisible(true);
  };

  const handleDelete = (goal: Goal) => {
    setGoalToDelete(goal);
    setDeleteModalVisible(true);
  };

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setModalMode('create');
    setGoalModalVisible(true);
  };

  const handleSaveGoal = async (data: CreateGoalRequest) => {
    try {
      if (modalMode === 'edit' && selectedGoal) {
        await updateGoalMutation.mutateAsync({
          id: selectedGoal.id,
          ...data,
        });
      } else {
        await createGoalMutation.mutateAsync(data);
      }
      setGoalModalVisible(false);
      setSelectedGoal(null);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
      console.error('Erro ao salvar meta:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    
    try {
      await deleteGoalMutation.mutateAsync(goalToDelete.id);
      setDeleteModalVisible(false);
      setGoalToDelete(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a meta. Tente novamente.');
      console.error('Erro ao excluir meta:', error);
    }
  };

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <GoalListItem 
      goal={item} 
      onDeposit={handleDeposit}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="flag-outline" size={64} color={colors.primary[300]} />
      <Text style={styles.emptyTitle}>Nenhuma meta criada</Text>
      <Text style={styles.emptySubtext}>
        Crie sua primeira meta e comece a economizar para seus objetivos
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Minhas Metas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Carregando metas...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.feedback.error} />
          <Text style={styles.errorText}>Erro ao carregar metas</Text>
          <Text style={styles.errorSubtext}>Tente novamente mais tarde</Text>
        </View>
      ) : (
        <FlatList
          style={styles.goalsList}
          contentContainerStyle={styles.flatListContent}
          data={goals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGoalItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <GoalDepositModal
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        onConfirm={handleConfirmDeposit}
        goal={selectedGoal}
      />

      <GoalModal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        onSave={handleSaveGoal}
        goal={selectedGoal}
        mode={modalMode}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Meta"
        message="Tem certeza que deseja excluir esta meta?"
        itemName={goalToDelete?.name}
        loading={deleteGoalMutation.isPending}
      />
    </View>
  );
};
