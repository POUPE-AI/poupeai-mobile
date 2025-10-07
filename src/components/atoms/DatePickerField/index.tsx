import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { parseISO, format, isValid } from "date-fns";
import { FormField } from "@/components/atoms/FormField";
import { Text } from "@/components/atoms/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

interface DatePickerFieldProps {
  label: string;
  value: string; // ISO date string (YYYY-MM-DD)
  onDateChange: (isoDate: string) => void;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onDateChange,
  placeholder = "DD/MM/AAAA",
  error,
  minimumDate,
  maximumDate,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);
  const [isOpen, setIsOpen] = useState(false);

  // Converte ISO date (YYYY-MM-DD) para Date object
  const getDateFromISO = (isoDate: string): Date => {
    if (!isoDate) return new Date();
    const date = parseISO(isoDate);
    return isValid(date) ? date : new Date();
  };

  // Converte Date object para ISO date (YYYY-MM-DD)
  const getISOFromDate = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  // Formata data para exibição (DD/MM/AAAA)
  const formatDisplayDate = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = getDateFromISO(isoDate);
    return format(date, "dd/MM/yyyy");
  };

  const currentDate = getDateFromISO(value);
  const displayValue = formatDisplayDate(value);

  const handleDateConfirm = (selectedDate: Date) => {
    const isoDate = getISOFromDate(selectedDate);
    onDateChange(isoDate);
    setIsOpen(false);
  };

  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.7}
        style={disabled ? style.disabledContainer : undefined}
      >
        <FormField
          label={label}
          placeholder={placeholder}
          value={displayValue}
          onChangeText={() => {}} // Não permite edição manual
          keyboardType="numeric"
          error={error}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <DatePicker
        modal
        open={isOpen}
        date={currentDate}
        mode="date"
        locale="pt-BR"
        title="Selecionar data"
        confirmText="Confirmar"
        cancelText="Cancelar"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsOpen(false)}
        theme={theme === "dark" ? "dark" : "light"}
      />
    </View>
  );
};
