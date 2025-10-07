import { TransactionInfoRow } from "@/components/atoms/TransactionInfoRow";
import { useBankAccount } from "@/hooks/useBankAccounts";

export const BankTransactionInfo = ({
  bankAccountId,
}: {
  bankAccountId: number;
}) => {
  const { data, isLoading, error } = useBankAccount(bankAccountId);

  const text = isLoading
    ? "Carregando..."
    : error
    ? "Erro ao carregar conta"
    : data?.name || "N/A";

  return (
    <>
      <TransactionInfoRow label="Tipo de transação" value="Conta bancária" />
      <TransactionInfoRow label="Conta Bancária" value={text} />
    </>
  );
};
