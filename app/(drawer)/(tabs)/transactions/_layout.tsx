import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { getHeaderStyles } from "@/constants/headerStyles";

export default function TransactionsLayout() {
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
          title: "Transações",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Detalhes da Transação",
          headerShown: true,
          headerBackTitle: "Transações",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="import"
        options={{
          title: "Importar Extrato",
          headerShown: true,
          headerBackTitle: "Transações",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
