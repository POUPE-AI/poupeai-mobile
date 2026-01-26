import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";
import { Invoice } from "@/types/invoices";
import { Account } from "@/types/accounts";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { styles } from "./styles";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { DropdownSelector } from "@/components/atoms/DropdownSelector";
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

interface PayInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (bankAccountId: string, amount: number) => Promise<void>;
  invoice: Invoice | null;
}

export const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  visible,
  onClose,
  onConfirm,
  invoice,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [paymentDate, setPaymentDate] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isBankAccountDropdownOpen, setIsBankAccountDropdownOpen] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: bankAccountsData, isLoading: bankAccountsLoading } =
    useBankAccounts();

  useEffect(() => {
    if (visible && invoice) {
      // Set today's date as default
      const todayString = format(new Date(), "yyyy-MM-dd"); // YYYY-MM-DD format
      setPaymentDate(todayString);
      setSelectedBankAccount(null); // Reset bank account selection
      setIsBankAccountDropdownOpen(false); // Close dropdown
      setErrorMessage(null); // Clear any previous errors
    }
  }, [visible, invoice]);

  const handleConfirm = async () => {
    if (!invoice || !paymentDate || !selectedBankAccount) return;

    // Check if selected account has enough balance
    const selectedAccount = bankAccountsData?.results.find(
      (acc) => acc.id === selectedBankAccount,
    );
    if (
      selectedAccount &&
      selectedAccount.current_balance < invoice.total_amount
    ) {
      setErrorMessage(
        "A conta selecionada não possui saldo suficiente para esta fatura.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      await onConfirm(paymentDate, selectedBankAccount);
      onClose();
    } catch (error: any) {
      console.error("Erro ao confirmar pagamento:", error);

      // Extract specific error messages from API response
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.bank_account_id) {
          setErrorMessage(errorData.bank_account_id[0]);
        } else if (errorData.detail) {
          setErrorMessage(errorData.detail);
        } else {
          setErrorMessage("Erro ao processar pagamento. Tente novamente.");
        }
      } else {
        setErrorMessage("Erro ao processar pagamento. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const getMonthYear = () => {
    if (!invoice) return "";
    return `${MONTHS[invoice.month - 1]} ${invoice.year}`;
  };

  const bankAccountItems = (bankAccountsData?.results || []).map(
    (account: Account) => {
      const hasEnoughBalance = invoice
        ? account.current_balance >= invoice.total_amount
        : true;
      const balanceIndicator = hasEnoughBalance ? "✓" : "⚠️";

      return {
        id: account.id,
        label: `${balanceIndicator} ${account.name} - ${formatCurrency(
          account.current_balance,
        )}`,
      };
    },
  );

  const formatDateInput = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Format as DD/MM/YYYY
    if (cleaned.length >= 8) {
      const day = cleaned.slice(0, 2);
      const month = cleaned.slice(2, 4);
      const year = cleaned.slice(4, 8);
      return `${day}/${month}/${year}`;
    } else if (cleaned.length >= 4) {
      const day = cleaned.slice(0, 2);
      const month = cleaned.slice(2, 4);
      const year = cleaned.slice(4);
      return `${day}/${month}/${year}`;
    } else if (cleaned.length >= 2) {
      const day = cleaned.slice(0, 2);
      const month = cleaned.slice(2);
      return `${day}/${month}`;
    }
    return cleaned;
  };

  const convertToISO = (dateString: string): string => {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  const convertFromISO = (isoString: string): string => {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const parts = isoString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return isoString;
  };

  if (!invoice) return null;

  const footer = (
    <>
      <Button
        title="Cancelar"
        onPress={onClose}
        variant="outline"
        style={style.cancelButton}
      />
      <Button
        title="Confirmar Pagamento"
        onPress={handleConfirm}
        loading={isLoading}
        style={style.confirmButton}
      />
    </>
  );

  return (
    <ModalContainer
      visible={visible}
      onClose={handleClose}
      title="Confirmar Pagamento"
      footer={footer}
    >
      <View style={style.invoiceInfo}>
        <Text style={style.invoiceTitle}>Fatura de {getMonthYear()}</Text>

        <View style={style.invoiceDetail}>
          <Text style={style.invoiceLabel}>Valor:</Text>
          <Text style={style.invoiceValue}>
            {formatCurrency(invoice.total_amount)}
          </Text>
        </View>

        <View style={style.invoiceDetail}>
          <Text style={style.invoiceLabel}>Vencimento:</Text>
          <Text style={style.invoiceValue}>
            {formatDateForDisplay(invoice.due_date)}
          </Text>
        </View>
      </View>

      <View style={style.fieldContainer}>
        <Text style={style.fieldLabel}>Conta Bancária</Text>
        <DropdownSelector
          items={bankAccountItems}
          selectedId={selectedBankAccount || undefined}
          onSelect={(item) => {
            setSelectedBankAccount(item.id as number);
            setErrorMessage(null); // Clear error when changing account
          }}
          placeholder="Selecione uma conta bancária"
          isOpen={isBankAccountDropdownOpen}
          onToggle={() =>
            setIsBankAccountDropdownOpen(!isBankAccountDropdownOpen)
          }
        />
        <Text style={style.fieldHint}>
          ✓ = Saldo suficiente • ⚠️ = Saldo insuficiente
        </Text>
      </View>

      <FormField
        label="Data do Pagamento"
        value={convertFromISO(paymentDate)}
        onChangeText={(text) => {
          const formatted = formatDateInput(text);
          const iso = convertToISO(formatted);
          setPaymentDate(iso);
        }}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      {errorMessage && (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>{errorMessage}</Text>
        </View>
      )}
    </ModalContainer>
  );
};
