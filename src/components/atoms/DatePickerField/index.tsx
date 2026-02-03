import React, { useState } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { parseISO, format, isValid } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { Text } from "../Text";
import { colors } from "@/constants/theme";

interface DatePickerFieldProps {
  label: string;
  value: string;
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

  const getDateFromISO = (isoDate: string): Date => {
    if (!isoDate) return new Date();
    const date = parseISO(isoDate);
    return isValid(date) ? date : new Date();
  };

  const getISOFromDate = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const formatDisplayDate = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = getDateFromISO(isoDate);
    return format(date, "dd/MM/yyyy");
  };

  const currentDate = getDateFromISO(value);
  const displayValue = formatDisplayDate(value);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    // No Android, o picker fecha automaticamente
    if (Platform.OS === "android") {
      setIsOpen(false);
    }

    if (selectedDate) {
      const isoDate = getISOFromDate(selectedDate);
      onDateChange(isoDate);

      // No iOS, fechar após seleção
      if (Platform.OS === "ios") {
        setIsOpen(false);
      }
    }
  };

  return (
    <View style={style.fieldContainer}>
      <Text style={style.label}>{label}</Text>

      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.7}
        style={[
          style.dateInput,
          error && style.dateInputError,
          disabled && style.dateInputDisabled,
        ]}
      >
        <Text
          style={[
            style.dateText,
            !displayValue && style.placeholderText,
            disabled && style.dateTextDisabled,
          ]}
        >
          {displayValue || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={style.errorText}>{error}</Text>}

      {isOpen && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="pt-BR"
          textColor={colors.theme[theme].text}
          themeVariant={theme}
          accentColor={colors.primary[500]}
        />
      )}
    </View>
  );
};
