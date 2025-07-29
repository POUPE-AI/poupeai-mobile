import { View } from "react-native";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { styles } from "./styles";
import { useTheme } from "@/contexts/ThemeContext";
import { Transaction } from "@/types/transactions";
import { useCategories } from "@/hooks/useCategories";
import { formatCurrencySimple } from "@/utils/currency";

interface TransactionsListItemProps {
    transaction: Transaction;
}

export const TransactionsListItem = ({transaction}: TransactionsListItemProps) => {
    const { theme } = useTheme();
    const style = styles(theme);

    const descriptionText = transaction.description.length > 20 ? `${transaction.description.substring(0, 20)}...` : transaction.description;

    const { data: categories } = useCategories();
    const category = categories?.results.find(cat => cat.id === transaction.category);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    const amountText = `${category?.type === 'expense' ? "- " : ""}${formatCurrencySimple(Math.abs(transaction.amount))}`;
    const amountColor = (category?.type === 'expense' ? colors.feedback.error : colors.feedback.success);

    return (
    <View style={[style.container, { borderColor: category?.color_hex || colors.feedback.error }]}>
        <View style={style.leftContainer}>
            <Text style={style.descriptionText}>{descriptionText}</Text>
            <Text style={style.categoryText}>{category?.name || 'Desconhecido'}</Text>
        </View>
        <View style={style.rightContainer}>
            <Text style={[style.amountText, { color: amountColor }]}>{amountText}</Text>
            <Text style={style.dateText}>{formatDate(transaction.issue_date)}</Text>
        </View>
    </View>
  );
}