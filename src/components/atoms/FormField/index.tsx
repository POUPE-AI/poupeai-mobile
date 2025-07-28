import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { colors } from '@/constants/theme';
import { styles } from './styles';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  children?: React.ReactNode; // Para casos onde precisamos de componentes customizados ao invés de TextInput
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.fieldContainer}>
      <Text style={style.label}>{label}</Text>
      {children ? (
        children
      ) : (
        <TextInput
          {...textInputProps}
          style={[style.input, error && style.inputError]}
          placeholderTextColor={colors.theme[theme].textSecondary}
        />
      )}
      {error && <Text style={style.errorText}>{error}</Text>}
    </View>
  );
};
