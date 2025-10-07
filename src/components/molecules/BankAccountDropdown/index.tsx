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

interface BankAccountDropdownProps {
  selectedBankAccountId?: number;
  onSelect: (bankAccountId: number) => void;
  error?: string;
  isOpen: boolean;
  onToggle: () => void;
  onCreateAccount?: () => void;
}

export const BankAccountDropDown = ({
  selectedBankAccountId,
  onSelect,
  error,
  isOpen,
  onToggle,
  onCreateAccount = () => {},
}: BankAccountDropdownProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const {
    data: bankAccounts,
    isLoading: bankAccountsLoading,
    error: bankAccountsError,
  } = useBankAccounts();

  const dropdownItems =
    bankAccounts?.results.map((bank_account) => ({
      id: bank_account.id,
      label: bank_account.name,
    })) || [];

  const handleSelect = (item: { id: number }) => {
    onSelect(item.id);
    onToggle();
  };

  if (bankAccountsLoading || bankAccountsError) {
    return (
      <FormField label="Conta Bancária" error={error}>
        <View style={style.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={style.loadingText}>
            {bankAccountsLoading
              ? "Carregando contas..."
              : bankAccountsError?.message || "Erro ao carregar contas"}
          </Text>
        </View>
      </FormField>
    );
  }

  return (
    <FormField label="Conta Bancária" error={error}>
      <View style={style.container}>
        <View style={style.dropdownContainer}>
          <DropdownSelector
            items={dropdownItems}
            selectedId={selectedBankAccountId}
            onSelect={handleSelect}
            placeholder="Selecione uma conta"
            isOpen={isOpen}
            onToggle={onToggle}
            error={!!error}
            showColorDot={true}
          />
        </View>

        <TouchableOpacity style={style.createButton} onPress={onCreateAccount}>
          <Ionicons name="add" size={20} color={colors.theme[theme].text} />
        </TouchableOpacity>
      </View>
    </FormField>
  );
};
