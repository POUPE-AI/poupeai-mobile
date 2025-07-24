import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../../../src/contexts/ThemeContext';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      }}
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
