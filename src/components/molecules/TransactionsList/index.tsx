import React from 'react';
import { View, SectionList } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { TransactionsListItem } from '../../atoms/TransactionsListItem';
import { TransactionsSeparator } from '../../atoms/TransactionsSeparator';
import { Transaction, TransactionSection } from '../../../types/transactions';
import { styles } from './styles';
import { Text } from '@/components/atoms/Text';

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const getSections = (): TransactionSection[] => {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const getGroupKey = (dateString: string): string => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (dateOnly.getTime() === todayOnly.getTime() || 
          dateOnly.getTime() === yesterdayOnly.getTime()) {
        return dateString;
      }

      if (date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear()) {
        return dateString;
      }

      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    };

    const groupedByDate = sortedTransactions.reduce((groups, transaction) => {
      const groupKey = getGroupKey(transaction.date);
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: groupKey, 
          date: groupKey, // Usa a chave como data para o FormatDate
          data: []
        };
      }
      
      groups[groupKey].data.push(transaction);
      return groups;
    }, {} as Record<string, TransactionSection>);

    return Object.values(groupedByDate).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionsListItem
      description={item.title}
      amount={item.amount}
      category={item.category.name}
      date={item.date}
      color={item.category.color}
    />
  );

  const renderSectionHeader = ({ section }: { section: TransactionSection }) => (
    <TransactionsSeparator date={section.date} />
  );

  if (transactions.length === 0) {
    return (
      <View style={style.emptyContainer}>
        <Text color='text' variant='h3'>Nenhuma transação encontrada</Text>
        <Text color='text' variant='caption'>Adicione uma nova transação para começar</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <SectionList
        sections={getSections()}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};
