import React from "react";
import { View } from "react-native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";
import { Invoice } from "@/types/invoices";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { formatCurrency } from "@/utils/currency";
import { colors } from "@/constants/theme";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface InvoiceListItemProps {
  invoice: Invoice;
  onPayInvoice: (invoice: Invoice) => void;
  primaryColor?: string;
}

export const InvoiceListItem: React.FC<InvoiceListItemProps> = ({
  invoice,
  onPayInvoice,
  primaryColor,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const getMonthName = () => {
    return MONTHS[invoice.month - 1];
  };

  return (
    <View style={style.container}>
      <View style={style.header}>
        <View style={style.monthContainer}>
          <Text style={style.monthText}>{getMonthName()}</Text>
          <Text style={style.yearText}>{invoice.year}</Text>
        </View>

        <View style={style.amountContainer}>
          <Text style={style.amountText}>
            {formatCurrency(invoice.totalAmount)}
          </Text>
          <View style={style.statusContainer}>
            <View
              style={[
                style.statusDot,
                invoice.status === "PAID" ? style.paidDot : style.unpaidDot,
              ]}
            />
            <Text
              style={[
                style.statusText,
                invoice.status === "PAID" ? style.paidText : style.unpaidText,
              ]}
            >
              {invoice.status === "PAID" ? "Paga" : "Pendente"}
            </Text>
          </View>
        </View>
      </View>

      <View style={style.detailsContainer}>
        <View style={style.detailRow}>
          <Text style={style.detailLabel}>Vencimento</Text>
          <Text style={style.detailValue}>{formatDate(invoice.dueDate)}</Text>
        </View>

        {invoice.paidAmount && (
          <View style={style.detailRow}>
            <Text style={style.detailLabel}>Valor Pago</Text>
            <Text style={style.detailValue}>
              {formatCurrency(invoice.paidAmount)}
            </Text>
          </View>
        )}
      </View>

      {invoice.status !== "PAID" && (
        <View style={style.actionContainer}>
          <Button
            title="Marcar como Paga"
            onPress={() => onPayInvoice(invoice)}
            size="small"
            style={[style.payButton, { backgroundColor: primaryColor || colors.primary[500] }]}
          />
        </View>
      )}
    </View>
  );
};
