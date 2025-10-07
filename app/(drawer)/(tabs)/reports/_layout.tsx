import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { getHeaderStyles } from "@/constants/headerStyles";

export default function ReportsLayout() {
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
          title: "Relatórios",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="overview"
        options={{
          title: "Visão Geral",
          headerShown: true,
          headerBackTitle: "Relatórios",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="expense"
        options={{
          title: "Relatório de Despesas",
          headerShown: true,
          headerBackTitle: "Relatórios",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="income"
        options={{
          title: "Relatório de Receitas",
          headerShown: true,
          headerBackTitle: "Relatórios",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="category"
        options={{
          title: "Relatório por Categoria",
          headerShown: true,
          headerBackTitle: "Relatórios",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
