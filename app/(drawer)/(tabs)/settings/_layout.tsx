import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getHeaderStyles } from '@/constants/headerStyles';

export default function SettingsLayout() {
  const { theme } = useTheme();
  const headerStyles = getHeaderStyles(theme);

  return (
    <Stack
      screenOptions={headerStyles}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Configurações',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Ajuda e Suporte',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'Sobre o App',
        }}
      />
    </Stack>
  );
}
