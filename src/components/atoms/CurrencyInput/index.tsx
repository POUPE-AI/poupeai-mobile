import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { FormField } from "@/components/atoms/FormField";

interface CurrencyInputProps {
  label: string;
  value: string;
  onChangeText: (formattedValue: string, numericValue: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "0,00",
  error,
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  const formatCurrency = useCallback(
    (text: string): { formatted: string; numeric: number } => {
      const onlyDigits = text.replace(/\D/g, "");

      if (onlyDigits === "") {
        return { formatted: "", numeric: 0 };
      }

      const paddedDigits = onlyDigits.padStart(3, "0");
      const integerPart = paddedDigits.slice(0, -2).replace(/^0+/, "") || "0";
      const decimalPart = paddedDigits.slice(-2);

      const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
      );
      const formatted = `R$ ${formattedInteger},${decimalPart}`;
      const numeric = parseFloat(`${integerPart}.${decimalPart}`);

      return { formatted, numeric: isNaN(numeric) ? 0 : numeric };
    },
    []
  );

  const formatNumericValue = useCallback((numValue: number): string => {
    if (numValue === 0) return "";

    const integerPart = Math.floor(numValue);
    const decimalPart = Math.round((numValue - integerPart) * 100);

    const formattedInteger = integerPart
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${formattedInteger},${decimalPart.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (value === "" || value === "0" || value === "0.00") {
      setDisplayValue("");
    } else {
      if (typeof value === "string" && value.includes(",")) {
        setDisplayValue(value.startsWith("R$") ? value : `R$ ${value}`);
      } else {
        const numericValue =
          typeof value === "string"
            ? parseFloat(value.replace(",", "."))
            : parseFloat(value);
        if (!isNaN(numericValue) && numericValue > 0) {
          setDisplayValue(formatNumericValue(numericValue));
        } else {
          setDisplayValue("");
        }
      }
    }
  }, [value, formatNumericValue]);

  const handleTextChange = useCallback(
    (text: string) => {
      if (disabled) return;
      const { formatted, numeric } = formatCurrency(text);
      setDisplayValue(formatted);
      onChangeText(formatted.replace("R$ ", ""), numeric);
    },
    [formatCurrency, onChangeText, disabled]
  );

  return (
    <View pointerEvents={disabled ? "none" : "auto"} style={{ opacity: disabled ? 0.6 : 1 }}>
      <FormField
        label={label}
        placeholder={placeholder}
        value={displayValue}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        error={error}
        editable={!disabled}
      />
    </View>
  );
};