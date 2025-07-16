import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  icon: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Salário',
    category: 'Trabalho',
    amount: 3200,
    date: '2025-07-15',
    type: 'income',
    icon: 'card',
  },
  {
    id: '2',
    title: 'Almoço',
    category: 'Alimentação',
    amount: -25,
    date: '2025-07-16',
    type: 'expense',
    icon: 'restaurant',
  },
  {
    id: '3',
    title: 'Uber',
    category: 'Transporte',
    amount: -15,
    date: '2025-07-16',
    type: 'expense',
    icon: 'car',
  },
  {
    id: '4',
    title: 'Freelance',
    category: 'Trabalho',
    amount: 500,
    date: '2025-07-14',
    type: 'income',
    icon: 'laptop',
  },
  {
    id: '5',
    title: 'Supermercado',
    category: 'Alimentação',
    amount: -120,
    date: '2025-07-13',
    type: 'expense',
    icon: 'basket',
  },
];

export default function Transactions() {
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: item.type === 'income' ? colors.feedback.success + '20' : colors.feedback.error + '20' }
      ]}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          color={item.type === 'income' ? colors.feedback.success : colors.feedback.error} 
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      
      <Text style={[
        styles.transactionAmount,
        { color: item.type === 'income' ? colors.feedback.success : colors.feedback.error }
      ]}>
        {item.type === 'income' ? '+' : ''} R$ {Math.abs(item.amount).toFixed(2).replace('.', ',')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Receitas</Text>
            <Text style={[styles.summaryValue, { color: colors.feedback.success }]}>
              R$ 3.700,00
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={[styles.summaryValue, { color: colors.feedback.error }]}>
              R$ 160,00
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.transactionsList}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Todas as Transações</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme.light.surface,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.theme.light.surface,
    borderRadius: 12,
    padding: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.theme.light.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.theme.light.border,
    marginHorizontal: 20,
  },
  transactionsList: {
    flex: 1,
    padding: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme.light.text,
  },
  addButton: {
    backgroundColor: colors.primary[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme.light.text,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: colors.theme.light.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.theme.light.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
