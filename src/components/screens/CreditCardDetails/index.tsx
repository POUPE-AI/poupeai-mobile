import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useInvoices, usePayInvoice } from "@/hooks/useInvoices";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { PayInvoiceModal } from "@/components/molecules/PayInvoiceModal";
import { CreditCardHeader } from "@/components/molecules/CreditCardHeader";
import { InvoiceListItem } from "@/components/molecules/InvoiceListItem";
import { EmptyInvoicesState } from "@/components/molecules/EmptyInvoicesState";
import { Invoice } from "@/types/invoices";
import { colors } from "@/constants/theme";

export const CreditCardDetails: React.FC = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [refreshing, setRefreshing] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const creditCardId = id || "";

  const {
    data: creditCardsData,
    isLoading: cardsLoading,
    refetch: refetchCards,
  } = useCreditCards();
  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    refetch: refetchInvoices,
  } = useInvoices(creditCardId);
  const payInvoiceMutation = usePayInvoice();

  const creditCard = creditCardsData?.find((card) => card.id === creditCardId);
  const invoices = invoicesData || [];

  React.useEffect(() => {
    if (creditCard) {
      navigation.setOptions({
        title: creditCard.name,
      });
    }
  }, [creditCard, navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchCards(), refetchInvoices()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePayInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPayModalVisible(true);
  };

  const handleConfirmPayment = async (
    bankAccountId: string,
    amount: number,
  ) => {
    if (!selectedInvoice) return;

    try {
      await payInvoiceMutation.mutateAsync({
        creditCardId,
        invoiceId: selectedInvoice.id,
        paymentData: {
          bankAccountId: bankAccountId,
          amount: amount,
        },
      });
      setPayModalVisible(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error("Erro ao marcar fatura como paga:", error);
      throw error;
    }
  };

  const renderInvoiceItem: ListRenderItem<Invoice> = ({ item }) => (
    <InvoiceListItem invoice={item} onPayInvoice={handlePayInvoice} />
  );

  const renderHeader = () => {
    if (!creditCard) return null;

    return (
      <>
        <CreditCardHeader card={creditCard} />
        <Text style={style.sectionTitle}>Faturas</Text>
      </>
    );
  };

  const renderEmpty = () => <EmptyInvoicesState />;

  if (cardsLoading || invoicesLoading) {
    return (
      <View style={style.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!creditCard) {
    return (
      <View style={style.errorContainer}>
        <Text style={style.errorText}>Cartão de crédito não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={style.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <PayInvoiceModal
        visible={payModalVisible}
        onClose={() => {
          setPayModalVisible(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleConfirmPayment}
        invoice={selectedInvoice}
      />
    </View>
  );
};
