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
}

export const InvoiceListItem: React.FC<InvoiceListItemProps> = ({
  invoice,
  onPayInvoice,
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
            {formatCurrency(invoice.total_amount)}
          </Text>
          <View style={style.statusContainer}>
            <View
              style={[
                style.statusDot,
                invoice.is_paid ? style.paidDot : style.unpaidDot,
              ]}
            />
            <Text
              style={[
                style.statusText,
                invoice.is_paid ? style.paidText : style.unpaidText,
              ]}
            >
              {invoice.is_paid ? "Paga" : "Pendente"}
            </Text>
          </View>
        </View>
      </View>

      <View style={style.detailsContainer}>
        <View style={style.detailRow}>
          <Text style={style.detailLabel}>Vencimento</Text>
          <Text style={style.detailValue}>{formatDate(invoice.due_date)}</Text>
        </View>

        {invoice.payment_date && (
          <View style={style.detailRow}>
            <Text style={style.detailLabel}>Data de Pagamento</Text>
            <Text style={style.detailValue}>
              {formatDate(invoice.payment_date)}
            </Text>
          </View>
        )}
      </View>

      {!invoice.is_paid && (
        <View style={style.actionContainer}>
          <Button
            title="Marcar como Paga"
            onPress={() => onPayInvoice(invoice)}
            size="small"
            style={style.payButton}
          />
        </View>
      )}
    </View>
  );
};
