import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { styles } from "./styles";

<<<<<<< HEAD
interface DropdownItem<T = string | number> {
  id: T;
=======
interface DropdownItem {
  id: string | number;
>>>>>>> b8609b78e704edea4eb3d23f5b9218c2820ea00e
  label: string;
  color?: string;
}

interface DropdownSelectorProps<T = string | number> {
  items: DropdownItem<T>[];
  selectedId?: T;
  onSelect: (item: DropdownItem<T>) => void;
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
  error?: boolean;
  showColorDot?: boolean;
  disabled?: boolean;
}

export const DropdownSelector = <T extends string | number = string | number>({
  items,
  selectedId,
  onSelect,
  placeholder = "Selecione uma opção",
  isOpen,
  onToggle,
  error = false,
  showColorDot = false,
  disabled = false,
}: DropdownSelectorProps<T>) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <View
      style={[
        style.container,
        error && style.containerError,
        disabled && style.containerDisabled,
      ]}
    >
      <TouchableOpacity
        style={style.button}
        onPress={() => !disabled && onToggle()}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {selectedItem ? (
          <>
            {showColorDot && selectedItem.color && (
              <View
                style={[
                  style.colorDot,
                  { backgroundColor: selectedItem.color },
                ]}
              />
            )}
            <Text style={style.buttonText}>{selectedItem.label}</Text>
          </>
        ) : (
          <Text
            style={[
              style.buttonText,
              { color: colors.theme[theme].textSecondary },
            ]}
          >
            {placeholder}
          </Text>
        )}
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.theme[theme].text}
        />
      </TouchableOpacity>

      {isOpen && !disabled && (
        <ScrollView style={style.dropdown} nestedScrollEnabled>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[style.item, index === items.length - 1 && style.itemLast]}
              onPress={() => onSelect(item)}
            >
              {showColorDot && item.color && (
                <View
                  style={[style.colorDot, { backgroundColor: item.color }]}
                />
              )}
              <Text style={style.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
