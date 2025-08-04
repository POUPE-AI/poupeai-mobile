import React, { useState, useCallback, useEffect } from "react";
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

  // Função para formatar valor monetário
  const formatCurrency = useCallback(
    (text: string): { formatted: string; numeric: number } => {
      // Remove tudo que não for dígito
      const onlyDigits = text.replace(/\D/g, "");

      // Se não há dígitos, retorna valores vazios
      if (onlyDigits === "") {
        return { formatted: "", numeric: 0 };
      }

      // Adiciona zeros à esquerda para garantir pelo menos 3 dígitos (para os centavos)
      const paddedDigits = onlyDigits.padStart(3, "0");

      // Separa parte inteira dos centavos
      const integerPart = paddedDigits.slice(0, -2).replace(/^0+/, "") || "0";
      const decimalPart = paddedDigits.slice(-2);

      // Adiciona separadores de milhares
      const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
      );
      const formatted = `R$ ${formattedInteger},${decimalPart}`;

      // Calcula valor numérico
      const numeric = parseFloat(`${integerPart}.${decimalPart}`);

      return { formatted, numeric: isNaN(numeric) ? 0 : numeric };
    },
    []
  );

  // Função para converter valor numérico em formato de exibição
  const formatNumericValue = useCallback((numValue: number): string => {
    if (numValue === 0) return "";

    const integerPart = Math.floor(numValue);
    const decimalPart = Math.round((numValue - integerPart) * 100);

    const formattedInteger = integerPart
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${formattedInteger},${decimalPart.toString().padStart(2, "0")}`;
  }, []);

  // Inicializa o displayValue baseado no value prop
  useEffect(() => {
    if (value === "" || value === "0" || value === "0.00") {
      setDisplayValue("");
    } else {
      // Se value é uma string com formato brasileiro (contém vírgula)
      if (typeof value === "string" && value.includes(",")) {
        setDisplayValue(value.startsWith("R$") ? value : `R$ ${value}`);
      } else {
        // Se value é um número ou string numérica
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
      const { formatted, numeric } = formatCurrency(text);
      setDisplayValue(formatted);
      onChangeText(formatted.replace("R$ ", ""), numeric);
    },
    [formatCurrency, onChangeText]
  );

  return (
    <FormField
      label={label}
      placeholder={placeholder}
      value={displayValue}
      onChangeText={handleTextChange}
      keyboardType="numeric"
      error={error}
      editable={!disabled}
    />
  );
};
