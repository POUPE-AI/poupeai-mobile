import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getHeaderStyles } from '@/constants/headerStyles';

export default function CardsLayout() {
  const { theme } = useTheme();
  const headerStyles = getHeaderStyles(theme);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        ...headerStyles,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Cartões de Crédito',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Detalhes do Cartão',
          headerShown: true, 
          headerBackTitle: 'Cartões',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
