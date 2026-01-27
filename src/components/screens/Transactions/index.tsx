import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { TransactionsList } from "../../molecules/TransactionsList";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import {
  useCreateTransaction,
} from "@/hooks/useTransactions";
import { useState } from "react";
import {
  CreateTransactionRequest,
  Transaction,
  TransactionDetail,
} from "@/types/transactions";
import { TransactionModal } from "@/components/molecules/TransactionModal";
import { CategoryModal } from "@/components/molecules/CategoryModal";
import { useCreateCategory } from "@/hooks/useCategories";
import { BankAccountModal } from "@/components/molecules/BankAccountModal";
import { useCreateBankAccount } from "@/hooks/useBankAccounts";
import { CreditCardModal } from "@/components/molecules/CreditCardModal";
import { useCreateCreditCard } from "@/hooks/useCreditCards";
import { CreateBankAccountRequest, CreateCreditCardRequest } from "@/types";
import { CreateCategoryRequest } from "@/services/categories";

export const Transactions = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [bankAccountModalVisible, setBankAccountModalVisible] = useState(false);
  const [creditCardModalVisible, setCreditCardModalVisible] = useState(false);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionModalVisible(true);
  };

  const createTransactionMutation = useCreateTransaction();
  const handledSaveTransaction = async (data: CreateTransactionRequest) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      setTransactionModalVisible(false);
      setSelectedTransaction(null);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro. Tente novamente.");
      console.error("Erro ao salvar transação:", error);
    }
  };

  const createCategoryMutation = useCreateCategory();
  const handleSaveCategory = async (categoryData: CreateCategoryRequest) => {
    try {
      await createCategoryMutation.mutateAsync(categoryData);
      setCategoryModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar a categoria. Tente novamente."
      );
      throw error;
    }
  };

  const createBankAccountMutation = useCreateBankAccount();
  const handleSaveBankAccount = async (
    bankAccountData: CreateBankAccountRequest
  ) => {
    try {
      await createBankAccountMutation.mutateAsync(bankAccountData);
      setBankAccountModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível salvar a conta bancária. Tente novamente."
      );
      throw error;
    }
  };

  const createCreditCardMutation = useCreateCreditCard();
  const handleSaveCreditCard = async (
    creditCardData: CreateCreditCardRequest
  ) => {
    try {
      await createCreditCardMutation.mutateAsync(creditCardData);
      setCreditCardModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível salvar o cartão de crédito. Tente novamente."
      );
      throw error;
    }
  };

  return (
    <View style={style.container}>
      <View style={style.listHeader}>
        <Text style={style.listTitle}>Transações</Text>
        <TouchableOpacity
          style={style.addButton}
          onPress={handleAddTransaction}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TransactionsList />

      <TransactionModal
        visible={transactionModalVisible}
        onClose={() => setTransactionModalVisible(false)}
        onSave={handledSaveTransaction}
        transaction={selectedTransaction}
        mode={"create"}
        onCreateCategory={() => setCategoryModalVisible(true)}
        onCreateBankAccount={() => setBankAccountModalVisible(true)}
        onCreateCreditCard={() => setCreditCardModalVisible(true)}
      />

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleSaveCategory}
        mode="create"
      />

      <BankAccountModal
        visible={bankAccountModalVisible}
        onClose={() => setBankAccountModalVisible(false)}
        onSave={handleSaveBankAccount}
        mode="create"
      />

      <CreditCardModal
        visible={creditCardModalVisible}
        onClose={() => setCreditCardModalVisible(false)}
        onSave={handleSaveCreditCard}
        mode="create"
      />
    </View>
  );
};
