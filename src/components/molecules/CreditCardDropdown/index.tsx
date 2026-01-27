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
  selectedCreditCardId?: string;
  onSelect: (bankCreditCardId: string) => void;
  error?: string;
  isOpen: boolean;
  onToggle: () => void;
  onCreateCreditCard?: () => void;
  disabled?: boolean;
}

export const CreditCardDropDown = ({
  selectedCreditCardId,
  onSelect,
  error,
  isOpen,
  onToggle,
  onCreateCreditCard = () => {},
  disabled = false,
}: CreditCardDropdownProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const {
    data: creditCards,
    isLoading: creditCardsLoading,
    error: creditCardsError,
  } = useCreditCards();

  const dropdownItems =
    creditCards?.map((credit_card) => ({
      id: credit_card.id,
      label: credit_card.name,
    })) || [];

  const handleSelect = (item: { id: string }) => {
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
            disabled={disabled}
          />
        </View>

        <TouchableOpacity
          style={[style.createButton, disabled && style.createButtonDisabled]}
          onPress={onCreateCreditCard}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Ionicons name="add" size={20} color={colors.theme[theme].text} />
        </TouchableOpacity>
      </View>
    </FormField>
  );
};
