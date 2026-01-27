import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { FormField } from "@/components/atoms/FormField";
import { Text } from "@/components/atoms/Text";
import { styles } from "./styles";

export type TransactionSourceType = "BANK_ACCOUNT" | "CREDIT_CARD";

interface TransactionTypeSelectorProps {
  selectedType: TransactionSourceType;
  onTypeSelect: (type: TransactionSourceType) => void;
  error?: string;
  disabled?: boolean;
}

export const TransactionTypeSelector: React.FC<
  TransactionTypeSelectorProps
> = ({ selectedType, onTypeSelect, error, disabled = false }) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <FormField label="Tipo" error={error}>
      <View style={style.typeContainer}>
        <TouchableOpacity
          style={[
            style.typeButton,
            selectedType === "BANK_ACCOUNT" && style.typeButtonActive,
            disabled && style.typeButtonDisabled,
          ]}
          onPress={() => !disabled && onTypeSelect("BANK_ACCOUNT")}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Text
            style={[
              style.typeButtonText,
              selectedType === "BANK_ACCOUNT" && style.typeButtonTextActive,
              disabled && style.typeButtonTextDisabled,
            ]}
          >
            Conta Bancária
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            style.typeButton,
            selectedType === "CREDIT_CARD" && style.typeButtonActive,
            disabled && style.typeButtonDisabled,
          ]}
          onPress={() => !disabled && onTypeSelect("CREDIT_CARD")}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Text
            style={[
              style.typeButtonText,
              selectedType === "CREDIT_CARD" && style.typeButtonTextActive,
              disabled && style.typeButtonTextDisabled,
            ]}
          >
            Cartão de Crédito
          </Text>
        </TouchableOpacity>
      </View>
    </FormField>
  );
};
