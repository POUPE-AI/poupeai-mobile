import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { ColorPickerModal } from "@/components/molecules/ColorPickerModal";
import { PREDEFINED_COLORS } from "@/constants/colors";
import { styles } from "./styles";
import { getContrastColor } from "@/utils/color";

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

  const isCustomColor = !PREDEFINED_COLORS.includes(selectedColor);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
  };

  const onColorPickerSelect = (color: string) => {
    onColorSelect(color);
    setShowColorPicker(false);
  };

  return (
    <>
      <View style={style.colorContainer}>
        <Text style={style.label}>{label}</Text>

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
