import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";
import type { Invoice, PayInvoiceRequest } from "@/types/invoices";
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
  onConfirm: (payload: PayInvoiceRequest) => Promise<void>;
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

  const [amount, setAmount] = useState<number>(0);
  const [ammountInput, setAmmountInput] = useState<string>("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<string | null>(
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
      // Default to invoice total amount and reset selection
      const initialAmount = invoice.totalAmount || 0;
      setAmount(initialAmount);
      // Format initial amount as R$ 1.234,56
      const formatted = initialAmount
        .toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      setAmmountInput(`R$ ${formatted}`);

      setSelectedBankAccount(null); // Reset bank account selection
      setIsBankAccountDropdownOpen(false); // Close dropdown
      setErrorMessage(null); // Clear any previous errors
    }
  }, [visible, invoice]);

  const handleConfirm = async () => {
    if (!invoice || !selectedBankAccount) return;

    // Check if selected account has enough balance
    const selectedAccount = (bankAccountsData || []).find(
      (acc) => acc.id === selectedBankAccount,
    );

    if (!selectedAccount) {
      setErrorMessage("Selecione uma conta bancária para efetuar o pagamento.");
      setIsLoading(false);
      return;
    }

    if (amount <= 0) {
      setErrorMessage("O valor deve ser maior que zero.");
      setIsLoading(false);
      return;
    }

    if (selectedAccount && selectedAccount.currentBalance < amount) {
      setErrorMessage(
        "A conta selecionada não possui saldo suficiente para este valor.",
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
        // Pass bankAccountId and amount to parent as object
      await onConfirm({ bankAccountId: selectedBankAccount!, amount });
      onClose();
    } catch (error: any) {
      console.error("Erro ao confirmar pagamento:", error);

      // Extract specific error messages from API response
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.bank_account_id) {
          setErrorMessage(
            Array.isArray(errorData.bank_account_id)
              ? errorData.bank_account_id[0]
              : String(errorData.bank_account_id),
          );
        } else if (errorData.bankAccountId) {
          setErrorMessage(
            Array.isArray(errorData.bankAccountId)
              ? errorData.bankAccountId[0]
              : String(errorData.bankAccountId),
          );
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

  const bankAccountItems = (bankAccountsData || []).map(
    (account: Account) => {
      const hasEnoughBalance = invoice
        ? account.currentBalance >= (invoice.totalAmount || 0)
        : true;
      const balanceIndicator = hasEnoughBalance ? "✓" : "⚠️";

      return {
        id: account.id,
        label: `${balanceIndicator} ${account.name} - ${formatCurrency(
          account.currentBalance,
        )}`,
      };
    },
  );

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
          <Text style={style.invoiceLabel}>Valor da fatura:</Text>
          <Text style={style.invoiceValue}>{formatCurrency(invoice.totalAmount)}</Text>
        </View>

        <View style={style.invoiceDetail}>
          <Text style={style.invoiceLabel}>Vencimento:</Text>
          <Text style={style.invoiceValue}>{formatDateForDisplay(invoice.dueDate)}</Text>
        </View> 
      </View>

      <View style={style.fieldContainer}>
        <Text style={style.fieldLabel}>Conta Bancária</Text>
        <DropdownSelector
          items={bankAccountItems}
          selectedId={selectedBankAccount || undefined}
          onSelect={(item) => {
            setSelectedBankAccount(String(item.id));
            setErrorMessage(null);
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

      <View style={style.fieldContainer}>
        <Text style={style.fieldLabel}>Valor a pagar</Text>
        <FormField
          placeholder="R$ 0,00"
          value={ammountInput}
          keyboardType="numeric"
          onChangeText={(text: string) => {
            const onlyDigits = text.replace(/\D/g, "");
            const numeric = onlyDigits.padStart(3, "0");

            // Remove leading zeros from integer part, but keep 0 if all zeros
            const integerPart = numeric.slice(0, -2).replace(/^0+/, "") || "0";
            const decimalPart = numeric.slice(-2);

            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            const formatted = `${formattedInteger},${decimalPart}`;

            const value = parseFloat(`${integerPart}.${decimalPart}`);

            setAmmountInput(`R$ ${formatted}`);
            setAmount(isNaN(value) ? 0 : value);
            setErrorMessage(null);
          }}
        />
      </View>

      {errorMessage && (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>{errorMessage}</Text>
        </View>
      )}
    </ModalContainer>
  );
};
