import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";

const ITEMS = [
    { label: "Resumo Financeiro", route: "(tabs)" },
    { label: "Transações", route: "(tabs)/transactions" },
    { label: "Contas bancárias", route: "(tabs)/accounts" },
    { label: "Cartões de crédito", route: "(tabs)/cards" },
    { label: "Categorias", route: "(tabs)/categories" },
    { label: "Metas", route: "(tabs)/goals" },
    { label: "Orçamentos", route: "(tabs)/budgets" },
    { label: "Relatórios", route: "(tabs)/reports" },
    { label: "Configurações", route: "(tabs)/settings" },
    { label: "Sair", route: "(tabs)/logout" },
]

export const CustomDrawer = (props: DrawerContentComponentProps) => {
    return (
        <DrawerContentScrollView {...props}>
            {ITEMS.map((item) => (
                <DrawerItem key={item.label} label={item.label} onPress={() => router.push(item.route)} />
            ))}
        </DrawerContentScrollView>
    );
};
