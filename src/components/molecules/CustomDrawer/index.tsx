import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router, useSegments } from "expo-router";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const ITEMS = [
  {
    section: [
      { label: "Resumo Financeiro", route: "(tabs)", icon: "home" },
      { label: "Relatórios", route: "(tabs)/reports", icon: "document-text" },
    ],
  },
  {
    section: [
      { label: "Transações", route: "(tabs)/transactions", icon: "list" },
      { label: "Contas bancárias", route: "(tabs)/accounts", icon: "cash" },
      { label: "Cartões de crédito", route: "(tabs)/cards", icon: "card" },
      { label: "Categorias", route: "(tabs)/categories", icon: "grid" },
    ],
  },
  {
    section: [
      { label: "Metas", route: "(tabs)/goals", icon: "trending-up" },
      //{ label: "Orçamentos", route: "(tabs)/budgets", icon: "wallet" },
    ],
  },
  {
    section: [
      { label: "Configurações", route: "(tabs)/settings", icon: "settings" },
      { label: "Sair", route: "(tabs)/logout", icon: "exit" },
    ],
  },
];

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const routeName = useSegments().slice(1).toString().replaceAll(",", "/");
  const { user, signOut } = useAuth();
  const { theme, colors: themeColors } = useTheme();

  const style = styles(theme);

  const action = (item: (typeof ITEMS)[number]["section"][number]) => {
    if (item.label === "Sair") {
      user?.id && signOut();
      return;
    }

    router.push(item.route);
  };

  return (
    <DrawerContentScrollView style={style.container} {...props}>
      <LinearGradient
        colors={[colors.primary[700], colors.primary[600], colors.primary[500]]}
        style={style.userHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("(tabs)/profile")}
        >
          <View style={style.userInfo}>
            <Text style={style.greeting}>Olá, {user?.name || "Usuário"}</Text>
            <Text style={style.userEmail}>
              {user?.email || "usuario@email.com"}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {ITEMS.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          {section.section.map((item) => (
            <DrawerItem
              style={style.drawerItem}
              inactiveTintColor={
                item.label === "Sair" ? colors.feedback.error : themeColors.text
              }
              activeTintColor={colors.primary[500]}
              focused={routeName === item.route}
              key={item.label}
              label={item.label}
              icon={({ color, size }) => (
                <Ionicons name={item.icon as any} color={color} size={size} />
              )}
              onPress={() => action(item)}
            />
          ))}

          {sectionIndex < ITEMS.length - 1 && (
            <View style={style.sectionSeparator} />
          )}
        </View>
      ))}
    </DrawerContentScrollView>
  );
};
