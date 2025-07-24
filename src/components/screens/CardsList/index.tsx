import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { CardListItem } from '@/components/atoms/CardListItem';
import { Card, CardProgress } from '@/types';
import { colors } from '@/constants/theme';
import { styles } from './styles';

const mockCards: Card[] = [
  {
    id: '1',
    name: 'Cartão Nubank',
    credit_limit: 5000.00,
    additional_info: 'Cartão sem anuidade',
    closing_day: 10,
    due_day: 17,
    brand: 'mastercard',
    brand_display: 'Mastercard',
    profile: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
  {
    id: '2',
    name: 'Cartão Itaú',
    credit_limit: 3000.00,
    additional_info: 'Cartão com cashback',
    closing_day: 15,
    due_day: 25,
    brand: 'visa',
    brand_display: 'Visa',
    profile: 'user-1',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
  {
    id: '3',
    name: 'Cartão Santander',
    credit_limit: 8000.00,
    additional_info: 'Cartão premium',
    closing_day: 5,
    due_day: 12,
    brand: 'mastercard',
    brand_display: 'Mastercard',
    profile: 'user-1',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-07-24T00:00:00Z',
  },
];

export const CardsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const handleCardPress = (card: Card) => {
    console.log('Cartão selecionado:', card.name);
  };

  const handleEditCard = (card: Card) => {
    console.log('Editar cartão:', card.name);
  };

  const handleDeleteCard = (card: Card) => {
    console.log('Excluir cartão:', card.name);
  };

  const handleAddCard = () => {
    console.log('Adicionar novo cartão');
  };

  const calculateProgress = (card: Card): CardProgress => {
    const usedAmount = Math.random() * card.credit_limit * 0.8;
    const availableAmount = card.credit_limit - usedAmount;
    const percentage = (usedAmount / card.credit_limit) * 100;

    return {
      used_amount: usedAmount,
      available_amount: availableAmount,
      percentage: percentage,
    };
  };

  const renderCardItem = ({ item }: { item: Card }) => {
    const progress = calculateProgress(item);

    return (
      <CardListItem
        card={item}
        progress={progress}
        onPress={handleCardPress}
        onEdit={handleEditCard}
        onDelete={handleDeleteCard}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={style.emptyContainer}>
      <Ionicons name="card-outline" size={64} color={colors.theme[theme].textSecondary} />
      <Text style={style.emptyTitle}>Nenhum cartão encontrado</Text>
      <Text style={style.emptySubtitle}>
        Adicione seus cartões de crédito para monitorar seus limites e gastos
      </Text>
    </View>
  );

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.headerTitle}>Cartões</Text>
        <TouchableOpacity style={style.addButton} onPress={handleAddCard}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockCards}
        keyExtractor={(item) => item.id}
        renderItem={renderCardItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};
