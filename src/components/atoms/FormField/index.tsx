import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { styles } from "./styles";
import MaskInput, { Mask } from "react-native-mask-input";

interface FormFieldProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
  children?: React.ReactNode;
  mask?: Mask;
  onChangeText?: (text: string, unmaskedText?: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  mask,
  onChangeText,
  editable = true,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={[style.fieldContainer, !editable && { opacity: 0.7 }]}>
      <Text style={style.label}>{label}</Text>

      {children ? (
        children
      ) : mask ? (
        <MaskInput
          {...textInputProps}
          mask={mask}
          style={[style.input, error && style.inputError]}
          placeholderTextColor={colors.theme[theme].textSecondary}
          onChangeText={(masked, unmasked) => {
            if (onChangeText) {
              onChangeText(masked, unmasked);
            }
          }}
        />
      ) : (
        <TextInput
          {...textInputProps}
          style={[style.input, error && style.inputError]}
          placeholderTextColor={colors.theme[theme].textSecondary}
          onChangeText={(text) => {
            if (onChangeText) {
              onChangeText(text);
            }
          }}
        />
      )}

      {error && <Text style={style.errorText}>{error}</Text>}
    </View>
  );
};
