import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router, usePathname, useSegments } from "expo-router";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

const ITEMS = [
  { label: "Resumo Financeiro", route: "(tabs)", icon: "home" },
  { label: "Transações", route: "(tabs)/transactions", icon: "list" },
  { label: "Contas bancárias", route: "(tabs)/accounts", icon: "cash" },
  { label: "Cartões de crédito", route: "(tabs)/cards", icon: "card" },
  { label: "Categorias", route: "(tabs)/categories", icon: "grid" },
  { label: "Metas", route: "(tabs)/goals", icon: "trending-up" },
  { label: "Orçamentos", route: "(tabs)/budgets", icon: "wallet" },
  { label: "Relatórios", route: "(tabs)/reports", icon: "document-text" },
  { label: "Configurações", route: "(tabs)/settings", icon: "settings" },
  { label: "Sair", route: "(tabs)/logout", icon: "exit" },
];

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const routeName = useSegments().slice(1).toString().replaceAll(",", "/");

  return (
    <DrawerContentScrollView style={styles.container} {...props}>
      {ITEMS.map((item) => {
        return (
          <DrawerItem
            style={styles.drawerItem}
            inactiveTintColor={item.label === "Sair" ? colors.feedback.error : colors.theme['light'].text}
            activeTintColor={colors.primary[500]}
            focused={routeName === item.route}
            key={item.label}
            label={item.label}
            icon={({ color, size }) => (
              <Ionicons name={item.icon as any} color={color} size={size} />
            )}
            onPress={() => router.push(item.route)}
          />
        );
      })}
    </DrawerContentScrollView>
  );
};
