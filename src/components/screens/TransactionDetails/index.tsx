import { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { TransactionInfoRow } from "@/components/atoms/TransactionInfoRow";

import { colors } from "@/constants/theme";
import { getContrastColor } from "@/utils/color";
import { formatCurrencySimple } from "@/utils/currency";
import { formatDate_DDMMYYYY, formatDateTime } from "@/utils/date";

import {
  useDeleteTransaction,
  useTransaction,
  useUpdateTransaction,
} from "@/hooks/useTransactions";
import { CategoryTag } from "@/components/atoms/CategoryTag";
import { BankTransactionInfo } from "@/components/molecules/BankTransactionInfo";
import { CreditCardTransactionInfo } from "@/components/molecules/CreditCardTransactionInfo";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { TransactionsGroupList } from "@/components/molecules/TransactionsGroupList";
import { ConfirmDeleteModal } from "@/components/molecules/ConfirmDeleteModal";
import { CreateTransactionRequest, Transaction } from "@/types/transactions";
import { TransactionModal } from "@/components/molecules/TransactionModal";

export const TransactionDetails: React.FC = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const transactionId = useMemo(() => parseInt(id, 10), [id]);
  const { data: transaction, isLoading, error } = useTransaction(transactionId);
  const deleteTransactionMutation = useDeleteTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const handleSaveTransaction = async (data: CreateTransactionRequest) => {
    if (!transaction) return;

    try {
      await updateTransactionMutation.mutateAsync({
        id: transaction?.id,
        ...data,
      });

      setEditModalVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      if (router) {
        router.back();
      }

      await deleteTransactionMutation.mutateAsync(transactionToDelete.id);

      setDeleteModalVisible(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  const handleDeleteCategory = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteModalVisible(true);
  };

  if (isLoading) {
    return <LoadingContent text="transação" />;
  }

  if (error || !transaction) {
    return <ErrorContent text="Não foi possível carregar a transação." />;
  }

  const statusTag = () => {
    const statusText =
      transaction.status === "PAID"
        ? "Pago"
        : transaction.status === "PENDING"
        ? "Pendente"
        : transaction.status === "OVERDUE"
        ? "Vencido"
        : "Cancelado";

    const color =
      transaction.status === "PAID"
        ? colors.feedback.success
        : transaction.status === "PENDING"
        ? colors.feedback.warning
        : colors.feedback.error;

    const textColor = getContrastColor(color);

    return (
      <Text
        variant="body"
        style={[style.statusTag, { backgroundColor: color, color: textColor }]}
      >
        {statusText}
      </Text>
    );
  };

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={style.card}>
          <View style={style.cardHeader}>
            <Text variant="caption" color="textSecondary">
              {new Date(transaction.created_at).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <View style={style.actionsContainer}>
              <ActionButton
                iconName="pencil"
                onPress={() => setEditModalVisible(true)}
                size={18}
              />
              <ActionButton
                iconName="trash-outline"
                onPress={() => handleDeleteCategory(transaction)}
                size={18}
              />
            </View>
          </View>

          <View style={style.cardContent}>
            <TransactionInfoRow
              label="Descrição"
              value={transaction.description}
            />
            <TransactionInfoRow
              label="Valor"
              value={`${
                transaction.type === "expense" ? "- " : ""
              }${formatCurrencySimple(transaction.amount)}`}
            />
            <TransactionInfoRow label="Categoria">
              <CategoryTag categoryId={transaction.category} />
            </TransactionInfoRow>
            <TransactionInfoRow
              label="Data de emissão"
              value={formatDate_DDMMYYYY(transaction.issue_date)}
            />

            <TransactionInfoRow label="Estado">
              {statusTag()}
            </TransactionInfoRow>
            {transaction.source_type === "BANK_ACCOUNT" && (
              <BankTransactionInfo
                bankAccountId={transaction.bank_account || 0}
              />
            )}

            {transaction.source_type === "CREDIT_CARD" && (
              <CreditCardTransactionInfo
                creditCardId={transaction.credit_card || 0}
                invoiceId={transaction.invoice || 0}
                transaction={transaction}
              />
            )}
          </View>

          <View style={style.cardFooter}>
            <Text variant="caption" color="textSecondary">
              Ultima atualização: {formatDateTime(transaction.updated_at)}
            </Text>
            <Text variant="caption" color="textSecondary">
              Data de criação: {formatDateTime(transaction.created_at)}
            </Text>
          </View>
        </View>

        {transaction?.is_installment && transaction?.purchase_group_uuid && (
          <TransactionsGroupList
            groupId={transaction?.purchase_group_uuid || ""}
            ignoreId={transaction.id}
          />
        )}
      </ScrollView>

      <TransactionModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveTransaction}
        transaction={transaction}
        mode="edit"
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Categoria"
        message="Tem certeza que deseja excluir esta categoria?"
        itemName={transactionToDelete?.description}
      />
    </>
  );
};
