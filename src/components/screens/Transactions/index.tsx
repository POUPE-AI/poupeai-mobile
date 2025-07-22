import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { TransactionsList } from "../../molecules/TransactionsList";
import { Transaction } from "../../../types/transactions";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    category: { name: "Trabalho", color: "#4CAF50" },
    amount: 3200,
    date: "2025-07-22",
    type: "income",
    icon: "card",
  },
  {
    id: "2",
    title: "Almoço",
    category: { name: "Alimentação", color: "#FF9800" },
    amount: -25,
    date: "2025-07-22",
    type: "expense",
    icon: "restaurant",
  },
  {
    id: "3",
    title: "Uber",
    category: { name: "Transporte", color: "#2196F3" },
    amount: -15,
    date: "2025-07-21",
    type: "expense",
    icon: "car",
  },
  {
    id: "4",
    title: "Freelance",
    category: { name: "Trabalho", color: "#4CAF50" },
    amount: 500,
    date: "2025-07-20",
    type: "income",
    icon: "laptop",
  },
  {
    id: "5",
    title: "Supermercado",
    category: { name: "Alimentação", color: "#FF9800" },
    amount: -120,
    date: "2025-06-15",
    type: "expense",
    icon: "basket",
  },
  {
    id: "6",
    title: "Conta de Luz",
    category: { name: "Contas", color: "#9E9E9E" },
    amount: -80,
    date: "2025-06-10",
    type: "expense",
    icon: "lightbulb",
  },
  {
    id: "7",
    title: "Venda de Produto",
    category: { name: "Vendas", color: "#FF5722" },
    amount: 200,
    date: "2025-05-30",
    type: "income",
    icon: "shopping-cart",
  },
];

export const Transactions = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const handleAddTransaction = () => {
    // TODO: Implementar adição de transação
    console.log("Adicionar nova transação");
  };

  return (
    <View style={style.container}>
      <View style={style.listHeader}>
        <Text style={style.listTitle}>Transações</Text>
        <TouchableOpacity
          style={style.addButton}
          onPress={handleAddTransaction}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TransactionsList transactions={mockTransactions} />
    </View>
  );
};
