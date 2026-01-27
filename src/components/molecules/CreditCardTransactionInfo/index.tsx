import React from "react";
import { TransactionInfoRow } from "@/components/atoms/TransactionInfoRow";
import { useCreditCard } from "@/hooks/useCreditCards";
import { useInvoice } from "@/hooks/useInvoices";
import { formatDate_DDMMYYYY } from "@/utils/date";
import { Transaction } from "@/types/transactions";

interface CreditCardTransactionInfoProps {
  creditCardId: string;
  invoiceId: string;
  transaction: Transaction;
}

export const CreditCardTransactionInfo = ({
  creditCardId,
  invoiceId,
  transaction,
}: CreditCardTransactionInfoProps) => {
  const {
    data: cardData,
    isLoading: cardLoading,
    error: cardError,
  } = useCreditCard(creditCardId);

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useInvoice(creditCardId, invoiceId);

  const cardText = cardLoading
    ? "Carregando..."
    : cardError
    ? "Erro ao carregar cartão"
    : cardData?.name || "N/A";

  const invoiceText = invoiceLoading
    ? "Carregando..."
    : invoiceError
    ? "Erro ao carregar fatura"
    : formatDate_DDMMYYYY(invoiceData?.due_date || "") || "N/A";

  const installmentsText =
    transaction.isInstallment &&
    transaction.totalInstallments &&
    transaction.installmentNumber
      ? `${transaction.installmentNumber} de ${transaction.totalInstallments}`
      : "A vista";

  return (
    <>
      <TransactionInfoRow label="Tipo de transação" value="Cartão de crédito" />
      <TransactionInfoRow label="Cartão de Crédito" value={cardText} />
      <TransactionInfoRow label="Parcelamento" value={installmentsText} />
      <TransactionInfoRow label="Fatura" value={invoiceText} />
    </>
  );
};
