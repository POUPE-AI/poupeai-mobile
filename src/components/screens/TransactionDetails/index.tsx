import { useState } from "react";
import { View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { TransactionInfoRow } from "@/components/atoms/TransactionInfoRow";

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
import { ReceiptViewer } from "@/components/atoms/ReceiptViewer";
import { ReceiptUploader } from "@/components/molecules/ReceiptUploader";
import { useDeleteReceipt } from "@/hooks/useTransactionsUpload";

export const TransactionDetails: React.FC = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: transaction, isLoading, error } = useTransaction(id || "");
  const deleteTransactionMutation = useDeleteTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteReceiptMutation = useDeleteReceipt();

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

  const handleDeleteReceipt = async () => {
    if (!transaction) return;
    
    try {
      await deleteReceiptMutation.mutateAsync({ transactionId: transaction.id });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingContent text="transação" />;
  }

  if (error || !transaction) {
    return <ErrorContent text="Não foi possível carregar a transação." />;
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={style.card}>
          <View style={style.cardHeader}>
            <Text variant="caption" color="textSecondary">
              {format(
                parseISO(transaction.createdAt),
                "d 'de' MMMM 'de' yyyy",
                { locale: ptBR }
              )}
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
                transaction.type === "EXPENSE" ? "- " : ""
              }${formatCurrencySimple(transaction.amount)}`}
            />
            <TransactionInfoRow label="Categoria">
              <CategoryTag name={transaction.category.name} colorHex={transaction.category.colorHex} />
            </TransactionInfoRow>
            <TransactionInfoRow
              label="Data de emissão"
              value={formatDate_DDMMYYYY(transaction.transactionDate)}
            />

            {transaction.bankAccountId && (
              <BankTransactionInfo
                bankAccountId={transaction.bankAccountId || ""}
              />
            )}

            {transaction.creditCardId && (
              <CreditCardTransactionInfo
                creditCardId={transaction.creditCardId || ""}
                invoiceId={transaction.invoiceId || ""}
                transaction={transaction}
              />
            )}

            {/* Seção de Comprovante */}
            <View style={style.receiptSection}>
              {transaction.attachmentUrl ? (
                <ReceiptViewer
                  attachmentUrl={transaction.attachmentUrl}
                  showDelete={true}
                  onDelete={handleDeleteReceipt}
                />
              ) : (
                <ReceiptUploader 
                  transactionId={transaction.id} 
                  attachmentUrl={transaction.attachmentUrl} 
                />
              )}
              
              {transaction.attachmentUrl && (
                <ReceiptUploader 
                  transactionId={transaction.id} 
                  attachmentUrl={transaction.attachmentUrl} 
                />
              )}
            </View>
          </View>

          <View style={style.cardFooter}>
            <Text variant="caption" color="textSecondary">
              Ultima atualização: {formatDateTime(transaction.updatedAt)}
            </Text>
            <Text variant="caption" color="textSecondary">
              Data de criação: {formatDateTime(transaction.createdAt)}
            </Text>
          </View>
        </View>

        {transaction?.isInstallment && transaction?.purchaseGroupUuid && (
          <TransactionsGroupList
            groupId={transaction?.purchaseGroupUuid || ""}
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
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação?"
        itemName={transactionToDelete?.description}
      />
    </>
  );
};