import React from "react";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DropdownSelector } from "@/components/atoms/DropdownSelector";
import { FormField } from "@/components/atoms/FormField";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";

interface CreditCardDropdownProps {
  selectedCreditCardId?: number;
  onSelect: (bankCreditCardId: number) => void;
  error?: string;
  isOpen: boolean;
  onToggle: () => void;
  onCreateCreditCard?: () => void;
}

export const CreditCardDropDown = ({
  selectedCreditCardId,
  onSelect,
  error,
  isOpen,
  onToggle,
  onCreateCreditCard = () => {},
}: CreditCardDropdownProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const {
    data: creditCards,
    isLoading: creditCardsLoading,
    error: creditCardsError,
  } = useCreditCards();

  const dropdownItems =
    creditCards?.results.map((credit_card) => ({
      id: credit_card.id,
      label: credit_card.name,
    })) || [];

  const handleSelect = (item: { id: number }) => {
    onSelect(item.id);
    onToggle();
  };

  if (creditCardsLoading || creditCardsError) {
    return (
      <FormField label="Cartão de Crédito" error={error}>
        <View style={style.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={style.loadingText}>
            {creditCardsLoading
              ? "Carregando contas..."
              : creditCardsError?.message || "Erro ao carregar contas"}
          </Text>
        </View>
      </FormField>
    );
  }

  return (
    <FormField label="Cartão de Crédito" error={error}>
      <View style={style.container}>
        <View style={style.dropdownContainer}>
          <DropdownSelector
            items={dropdownItems}
            selectedId={selectedCreditCardId}
            onSelect={handleSelect}
            placeholder="Selecione um cartão"
            isOpen={isOpen}
            onToggle={onToggle}
            error={!!error}
            showColorDot={true}
          />
        </View>

        <TouchableOpacity style={style.createButton} onPress={onCreateCreditCard}>
          <Ionicons name="add" size={20} color={colors.theme[theme].text} />
        </TouchableOpacity>
      </View>
    </FormField>
  );
};
