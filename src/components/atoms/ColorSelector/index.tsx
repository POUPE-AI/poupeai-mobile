import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { ColorPickerModal } from "@/components/molecules/ColorPickerModal";
import { PREDEFINED_COLORS } from "@/constants/colors";
import { styles } from "./styles";
import { colors } from "@/constants/theme";

interface ColorSelectorProps {
  label: string;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  error?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  label,
  selectedColor,
  onColorSelect,
  error,
}) => {
  const { theme, colors: themeColors } = useTheme();
  const style = styles(theme);

  const [showColorPicker, setShowColorPicker] = useState(false);

  // Verifica se a cor selecionada está nas cores predefinidas
  const isCustomColor = !PREDEFINED_COLORS.includes(selectedColor);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
  };

  const onColorPickerSelect = (color: string) => {
    onColorSelect(color);
    setShowColorPicker(false);
  };

  function getContrastColor(selectedColor: string): string {
    let color = selectedColor.replace("#", "");
    if (color.length === 3) {
      color = color
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? colors.theme['light'].text : colors.theme['dark'].text;
  }

  return (
    <>
      <View style={style.colorContainer}>
        <Text style={style.label}>{label}</Text>

        {/* Cores predefinidas */}
        <View style={style.predefinedColorsContainer}>
          {PREDEFINED_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                style.colorSwatch,
                { backgroundColor: color },
                selectedColor === color && style.colorSwatchSelected,
              ]}
              onPress={() => handleColorSelect(color)}
            />
          ))}

          {/* Botão para abrir color picker personalizado */}
          <TouchableOpacity
            style={[
              style.colorSwatch,
              isCustomColor
                ? { backgroundColor: selectedColor }
                : style.customColorButton,
              isCustomColor && style.colorSwatchSelected,
            ]}
            onPress={() => setShowColorPicker(true)}
          >
            <Ionicons
              name="color-palette"
              size={16}
              color={
                isCustomColor
                  ? getContrastColor(selectedColor)
                  : themeColors.text
              }
            />
          </TouchableOpacity>
        </View>

        {error && <Text style={style.errorText}>{error}</Text>}
      </View>

      <ColorPickerModal
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        currentColor={selectedColor}
        onColorSelect={onColorPickerSelect}
      />
    </>
  );
};
