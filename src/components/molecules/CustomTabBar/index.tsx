import { View, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { styles } from "./styles";
import { TABS } from "@/constants/tabs";
import { AddButtonMenu } from "@/components/atoms/AddButtonMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { TransactionModal } from "@/components/molecules/TransactionModal";
import { GoalModal } from "@/components/molecules/GoalModal";
import { BudgetModal } from "@/components/molecules/BudgetModal";
import { CategoryModal } from "@/components/molecules/CategoryModal";
import { BankAccountModal } from "@/components/molecules/BankAccountModal";
import { CreditCardModal } from "@/components/molecules/CreditCardModal";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useCreateGoal } from "@/hooks/useGoals";
import { useCreateBudget } from "@/hooks/useBudgets";
import { useCreateCategory } from "@/hooks/useCategories";
import { useCreateBankAccount } from "@/hooks/useBankAccounts";
import { useCreateCreditCard } from "@/hooks/useCreditCards";
import type { CreateTransactionRequest } from "@/types/transactions";
import type { CreateGoalRequest } from "@/types/goals";
import type { CreateBudgetRequest } from "@/types/budgets";
import type { CreateCategoryRequest } from "@/services/categories";
import type { CreateBankAccountRequest } from "@/types/accounts";
import type { CreateCreditCardRequest } from "@/types/cards";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { theme } = useTheme();
  const style = styles(theme);
  const middleIndex = Math.floor(TABS.length / 2);

  // Estados dos modais
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [bankAccountModalVisible, setBankAccountModalVisible] = useState(false);
  const [creditCardModalVisible, setCreditCardModalVisible] = useState(false);

  // Mutations
  const createTransactionMutation = useCreateTransaction();
  const createGoalMutation = useCreateGoal();
  const createBudgetMutation = useCreateBudget();
  const createCategoryMutation = useCreateCategory();
  const createBankAccountMutation = useCreateBankAccount();
  const createCreditCardMutation = useCreateCreditCard();

  // Handlers para salvar
  const handleSaveTransaction = async (data: CreateTransactionRequest) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      setTransactionModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar a transação. Tente novamente."
      );
      throw error;
    }
  };

  const handleSaveGoal = async (data: CreateGoalRequest) => {
    try {
      await createGoalMutation.mutateAsync(data);
      setGoalModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta. Tente novamente.");
      throw error;
    }
  };

  const handleSaveBudget = async (data: CreateBudgetRequest) => {
    try {
      await createBudgetMutation.mutateAsync(data);
      setBudgetModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar o orçamento. Tente novamente."
      );
      throw error;
    }
  };

  const handleSaveCategory = async (data: CreateCategoryRequest) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      setCategoryModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar a categoria. Tente novamente."
      );
      throw error;
    }
  };

  const handleSaveBankAccount = async (data: CreateBankAccountRequest) => {
    try {
      await createBankAccountMutation.mutateAsync(data);
      setBankAccountModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar a conta bancária. Tente novamente."
      );
      throw error;
    }
  };

  const handleSaveCreditCard = async (data: CreateCreditCardRequest) => {
    try {
      await createCreditCardMutation.mutateAsync(data);
      setCreditCardModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar o cartão de crédito. Tente novamente."
      );
      throw error;
    }
  };

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const tabConfig = TABS.find((tab) => tab.name === route.name);
    if (!tabConfig) return null;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <TouchableOpacity
        key={route.name}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={style.tab}
      >
        <View style={[style.tabContent, isFocused && style.tabContentActive]}>
          <Ionicons
            name={tabConfig.icon as any}
            size={20}
            color={
              isFocused
                ? colors.primary[500]
                : colors.theme[theme].textSecondary
            }
          />
          <Text
            style={[
              style.tabLabel,
              {
                color: isFocused
                  ? colors.primary[500]
                  : colors.theme[theme].textSecondary,
              },
            ]}
          >
            {tabConfig.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={style.container}>
        {state.routes
          .slice(0, middleIndex)
          .map((route: any, index: number) => renderTab(route, index))}

        <View style={style.addButtonContainer}>
          <AddButtonMenu
            onNewTransaction={() => setTransactionModalVisible(true)}
            onNewGoal={() => setGoalModalVisible(true)}
            onNewBudget={() => setBudgetModalVisible(true)}
          />
        </View>

        {state.routes
          .slice(middleIndex)
          .map((route: any, index: number) =>
            renderTab(route, index + middleIndex)
          )}
      </View>

      {/* Modais */}
      <TransactionModal
        visible={transactionModalVisible}
        onClose={() => setTransactionModalVisible(false)}
        onSave={handleSaveTransaction}
        mode="create"
        onCreateCategory={() => setCategoryModalVisible(true)}
        onCreateBankAccount={() => setBankAccountModalVisible(true)}
        onCreateCreditCard={() => setCreditCardModalVisible(true)}
      />

      <GoalModal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        onSave={handleSaveGoal}
        mode="create"
      />

      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSave={handleSaveBudget}
        mode="create"
        onCreateCategory={() => setCategoryModalVisible(true)}
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
    </>
  );
}
