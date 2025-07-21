import React from 'react';
import { Text } from '@/components/atoms/Text';
import { styles } from './styles';
import { View } from 'react-native';
import LoginLogin from '../../../../assets/login-logo.svg'
import { colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface LoginHeaderProps {
  subtitle: string;
}

export const LoginHeader = ({ subtitle }: LoginHeaderProps) => {
    const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LoginLogin width={250} height={180} color={colors.theme[theme].text} />
      <Text variant="subtitle" color="textSecondary" align="center" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};
