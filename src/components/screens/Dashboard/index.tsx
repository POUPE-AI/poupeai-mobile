import React from "react";
import { Text, ScrollView, View } from "react-native";
import { BalanceCard } from "@/components/molecules/BalanceCard";
//import CategoryChart from "@/components/atoms/CategoryChart";
//import EstimatedSavings from "@/components/atoms/EstimatedSavings";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

// Mock data para cada tipo de card
const mockData = {
  saldoTotal: [
    { data: [1200, 800, 950, 1235, 1100, 1300, 1235] },
    { data: [900, 1100, 850, 1150, 1050, 1200, 1000] },
    { data: [600, 750, 680, 900, 820, 950, 875] },
  ],
  receitas: [
    { data: [2500, 2800, 2600, 3200, 2900, 3500, 3100] },
    { data: [1800, 2100, 1900, 2400, 2200, 2600, 2300] },
  ],
  despesas: [
    { data: [1800, 2200, 1900, 2100, 2000, 2300, 2050] },
    { data: [1200, 1500, 1350, 1600, 1450, 1700, 1550] },
    { data: [800, 1000, 900, 1100, 950, 1200, 1100] },
  ],
  faturas: [
    { data: [450, 520, 480, 600, 550, 650, 580] },
    { data: [320, 380, 350, 420, 400, 480, 450] },
  ],
};

export default function DashboardScreen() {
  const { theme } = useTheme();
  const style = styles(theme);



  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.greeting}>Olá, Jhon Doe</Text>
      <Text style={style.subtitle}>Aqui está um resumo do seu mês</Text>

      {/* ScrollView horizontal com os cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.cardsContainer}
        style={style.horizontalScroll}
      >
        <BalanceCard 
          data={mockData.saldoTotal} 
          title="Saldo Total" 
          percentage={-51.49} 
          amount={1235.99} 
        />
        
        <BalanceCard 
          data={mockData.receitas} 
          title="Receitas" 
          percentage={12.35} 
          amount={3100.50} 
        />
        
        <BalanceCard 
          data={mockData.despesas} 
          title="Despesas" 
          percentage={-8.20} 
          amount={2050.75} 
        />
        
        <BalanceCard 
          data={mockData.faturas} 
          title="Faturas" 
          percentage={15.60} 
          amount={580.25} 
        />
      </ScrollView>

    </ScrollView>
  );
}
