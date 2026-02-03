import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { CardListItem } from "@/components/atoms/CardListItem";
import { Card, CardProgress, CreateCreditCardRequest } from "@/types";
import { colors } from "@/constants/theme";
import {
  useCreditCards,
  useCreateCreditCard,
  useUpdateCreditCard,
  useDeleteCreditCard,
} from "@/hooks/useCreditCards";
import { CreditCardModal } from "@/components/molecules/CreditCardModal";
import { ConfirmDeleteModal } from "@/components/molecules/ConfirmDeleteModal";
import { styles } from "./styles";

export const CardsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  const router = useRouter();

  const { data: creditCardsData, isLoading, error, refetch } = useCreditCards();
  const createCreditCardMutation = useCreateCreditCard();
  const updateCreditCardMutation = useUpdateCreditCard();
  const deleteCreditCardMutation = useDeleteCreditCard();

  const cards = creditCardsData || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  const handleCardPress = (card: Card) => {
    router.push(`/cards/${card.id}`);
  };

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDeleteCard = (card: Card) => {
    setCardToDelete(card);
    setDeleteModalVisible(true);
  };

  const handleAddCard = () => {
    setSelectedCard(null);
    setModalMode("create");
    setModalVisible(true);
  };

  const handleSaveCard = async (data: CreateCreditCardRequest) => {
    try {
      if (modalMode === "edit" && selectedCard) {
        await updateCreditCardMutation.mutateAsync({
          id: selectedCard.id,
          ...data,
        });
      } else {
        await createCreditCardMutation.mutateAsync(data);
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro. Tente novamente.");
      console.error("Erro ao salvar cartão:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;

    try {
      await deleteCreditCardMutation.mutateAsync(cardToDelete.id);
      setDeleteModalVisible(false);
      setCardToDelete(null);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível excluir o cartão. Tente novamente.",
      );
      console.error("Erro ao excluir cartão:", error);
    }
  };

  const renderCardItem = ({ item }: { item: Card }) => {
    return (
      <CardListItem
        card={item}
        onPress={handleCardPress}
        onEdit={handleEditCard}
        onDelete={handleDeleteCard}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={style.emptyContainer}>
      <Ionicons
        name="card-outline"
        size={64}
        color={colors.theme[theme].textSecondary}
      />
      <Text style={style.emptyTitle}>Nenhum cartão encontrado</Text>
      <Text style={style.emptySubtitle}>
        Adicione seus cartões de crédito para monitorar seus limites e gastos
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={style.emptyContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={style.emptyTitle}>Carregando cartões...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={style.emptyContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color={colors.feedback.error}
      />
      <Text style={style.emptyTitle}>Erro ao carregar cartões</Text>
      <Text style={style.emptySubtitle}>
        Verifique sua conexão e tente novamente
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <>
        <View style={style.container}>
          <View style={style.header}>
            <Text style={style.headerTitle}>Cartões</Text>
            <TouchableOpacity style={style.addButton} onPress={handleAddCard}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {renderLoadingState()}
        </View>

        <CreditCardModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveCard}
          card={selectedCard}
          mode={modalMode}
        />
      </>
    );
  }

  return (
    <>
      <View style={style.container}>
        <View style={style.header}>
          <Text style={style.headerTitle}>Cartões</Text>
          <TouchableOpacity style={style.addButton} onPress={handleAddCard}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={renderCardItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.listContent}
          ListEmptyComponent={error ? renderErrorState : renderEmptyState}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      </View>

      <CreditCardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveCard}
        card={selectedCard}
        mode={modalMode}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Cartão"
        message="Tem certeza que deseja excluir este cartão de crédito?"
        itemName={cardToDelete?.name}
        loading={deleteCreditCardMutation.isPending}
      />
    </>
  );
};
