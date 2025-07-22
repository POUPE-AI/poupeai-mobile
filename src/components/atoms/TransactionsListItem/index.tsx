import { View } from "react-native";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { styles } from "./styles";
import { useTheme } from "@/contexts/ThemeContext";

interface TransactionsListItemProps {
    description: string;
    amount: number;
    category: string;
    date: string;
    color?: string;
}

export const TransactionsListItem = ({description, amount, category, date, color = colors.feedback.error}: TransactionsListItemProps) => {
    const { theme } = useTheme();
    const style = styles(theme);
  
    const ammountColor = (amount >= 0 ? colors.feedback.success : colors.feedback.error);

    const descriptionText = description.length > 20 ? `${description.substring(0, 20)}...` : description;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    return (
    <View style={[style.container, { borderColor: color }]}>
        <View style={style.leftContainer}>
            <Text style={style.descriptionText}>{descriptionText}</Text>
            <Text style={style.categoryText}>{category}</Text>
        </View>
        <View style={style.rightContainer}>
            <Text style={[style.amountText, { color: ammountColor }]}>{amount < 0 ? `- R$ ${Math.abs(amount).toFixed(2)}` : `R$ ${amount.toFixed(2)}`}</Text>
            <Text style={style.dateText}>{formatDate(date)}</Text>
        </View>
    </View>
  );
}