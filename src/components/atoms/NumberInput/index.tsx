import React, { useState, useCallback, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";

interface NumberInputProps {
  label?: string;
  value: number;
  onChangeNumber: (numericValue: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minValue?: number;
  maxValue?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChangeNumber,
  placeholder = "0",
  error,
  disabled = false,
  minValue,
  maxValue,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  // Inicializa o displayValue baseado no value prop
  useEffect(() => {
    if (value === 0) {
      setDisplayValue("");
    } else {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleTextChange = useCallback(
    (text: string) => {
      // Remove caracteres não numéricos
      const onlyDigits = text.replace(/\D/g, "");

      // Se não há dígitos, limpa o campo
      if (onlyDigits === "") {
        setDisplayValue("");
        onChangeNumber(0);
        return;
      }

      const numericValue = parseInt(onlyDigits, 10);

      // Aplica limites se especificados
      let finalValue = numericValue;
      if (minValue !== undefined && finalValue < minValue) {
        finalValue = minValue;
      }
      if (maxValue !== undefined && finalValue > maxValue) {
        finalValue = maxValue;
      }

      setDisplayValue(finalValue.toString());
      onChangeNumber(finalValue);
    },
    [onChangeNumber, minValue, maxValue]
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
