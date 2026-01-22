import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { Button } from "@/components/atoms/Button";
import { colors } from "@/constants/theme";
import { styles } from "./styles";

interface IconSelectorProps {
  label: string;
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  error?: string;
}

const AVAILABLE_ICONS = [
  "home-outline",
  "cart-outline",
  "restaurant-outline",
  "car-outline",
  "airplane-outline",
  "medical-outline",
  "fitness-outline",
  "school-outline",
  "briefcase-outline",
  "gift-outline",
  "card-outline",
  "cash-outline",
  "pricetag-outline",
  "bag-outline",
  "basket-outline",
  "book-outline",
  "bulb-outline",
  "cafe-outline",
  "game-controller-outline",
  "musical-notes-outline",
  "shirt-outline",
  "basketball-outline",
  "bicycle-outline",
  "bus-outline",
  "pizza-outline",
  "beer-outline",
  "wallet-outline",
  "heart-outline",
  "paw-outline",
  "leaf-outline",
  "build-outline",
  "film-outline",
];

export const IconSelector: React.FC<IconSelectorProps> = ({
  label,
  selectedIcon,
  onIconSelect,
  error,
}) => {
  const { theme, colors: themeColors } = useTheme();
  const style = styles(theme);

  const [showIconModal, setShowIconModal] = useState(false);

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon);
    setShowIconModal(false);
  };

  return (
    <>
      <View style={style.container}>
        <Text style={style.label}>{label}</Text>

        <TouchableOpacity
          style={style.iconButton}
          onPress={() => setShowIconModal(true)}
        >
          <View style={style.iconPreview}>
            <Ionicons
              name={selectedIcon as any}
              size={24}
              color={themeColors.text}
            />
          </View>
          <Text style={style.iconButtonText}>Selecionar ícone</Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={themeColors.textSecondary}
          />
        </TouchableOpacity>

        {error && <Text style={style.errorText}>{error}</Text>}
      </View>

      <ModalContainer
        visible={showIconModal}
        onClose={() => setShowIconModal(false)}
        title="Selecionar Ícone"
        footer={
          <Button
            title="Cancelar"
            onPress={() => setShowIconModal(false)}
            variant="outline"
          />
        }
      >
        <ScrollView style={style.iconGrid} showsVerticalScrollIndicator={false}>
          <View style={style.iconRow}>
            {AVAILABLE_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  style.iconOption,
                  selectedIcon === icon && style.iconOptionSelected,
                ]}
                onPress={() => handleIconSelect(icon)}
              >
                <Ionicons
                  name={icon as any}
                  size={28}
                  color={
                    selectedIcon === icon
                      ? colors.primary[500]
                      : themeColors.text
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ModalContainer>
    </>
  );
};
