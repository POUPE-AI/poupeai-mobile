import React, { useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { styles } from "./styles";
import {
  useIngestionJobs,
  useImportBankStatement,
} from "@/hooks/useIngestionJobs";
import { IngestionJobListItem } from "@/components/atoms/IngestionJobListItem";
import * as DocumentPicker from "expo-document-picker";
import { BankAccountDropDown } from "@/components/molecules/BankAccountDropdown";
import { CategoryDropdown } from "@/components/molecules/CategoryDropdown";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { LoadingContent } from "@/components/atoms/LoadingContent";

export const BankStatementImport = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const [selectedBankAccountId, setSelectedBankAccountId] =
    useState<string>("");
  const [selectedIncomeCategoryId, setSelectedIncomeCategoryId] =
    useState<string>("");
  const [selectedExpenseCategoryId, setSelectedExpenseCategoryId] =
    useState<string>("");

  const [isBankAccountDropdownOpen, setIsBankAccountDropdownOpen] =
    useState(false);
  const [isIncomeCategoryDropdownOpen, setIsIncomeCategoryDropdownOpen] =
    useState(false);
  const [isExpenseCategoryDropdownOpen, setIsExpenseCategoryDropdownOpen] =
    useState(false);

  const [errors, setErrors] = useState<{
    file?: string;
    bankAccount?: string;
    incomeCategory?: string;
    expenseCategory?: string;
  }>({});

  const { data: jobs, isLoading, error, refetch } = useIngestionJobs();

  const importMutation = useImportBankStatement();

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/x-ofx", "application/ofx", "*/*"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Validar extensão OFX
        if (!file.name.toLowerCase().endsWith(".ofx")) {
          Alert.alert(
            "Arquivo inválido",
            "Por favor, selecione um arquivo OFX.",
          );
          return;
        }

        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/x-ofx",
        });
        setErrors({ ...errors, file: undefined });
      }
    } catch (err: any) {
      // Não mostrar erro se o usuário cancelou
      if (
        err?.message?.includes("cancelled") ||
        err?.message?.includes("canceled")
      ) {
        return;
      }
      console.error("Erro ao selecionar arquivo:", err);
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!selectedFile) {
      newErrors.file = "Selecione um arquivo OFX";
    }
    if (!selectedBankAccountId) {
      newErrors.bankAccount = "Selecione uma conta bancária";
    }
    if (!selectedIncomeCategoryId) {
      newErrors.incomeCategory = "Selecione a categoria padrão para receitas";
    }
    if (!selectedExpenseCategoryId) {
      newErrors.expenseCategory = "Selecione a categoria padrão para despesas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImport = async () => {
    if (!validateForm() || !selectedFile) {
      return;
    }

    try {
      await importMutation.mutateAsync({
        bankAccountId: selectedBankAccountId,
        fallbackIncomeCategoryId: selectedIncomeCategoryId,
        fallbackExpenseCategoryId: selectedExpenseCategoryId,
        file: selectedFile,
      });

      Alert.alert(
        "Sucesso",
        "Arquivo enviado com sucesso! O processamento será iniciado em breve.",
      );

      // Limpar formulário
      setSelectedFile(null);
      setSelectedBankAccountId("");
      setSelectedIncomeCategoryId("");
      setSelectedExpenseCategoryId("");
      setErrors({});
    } catch (err) {
      console.error("Erro ao importar:", err);
      Alert.alert(
        "Erro",
        "Não foi possível enviar o arquivo. Tente novamente.",
      );
    }
  };

  if (isLoading) {
    return <LoadingContent text="importações" />;
  }

  if (error) {
    return <ErrorContent text="Erro ao carregar importações" />;
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={style.section}>
        <Text style={style.sectionTitle}>Nova Importação</Text>
        <Text style={style.sectionDescription}>
          Importe um arquivo OFX do seu banco para criar transações
          automaticamente.
        </Text>

        <View style={style.form}>
          <View style={style.field}>
            <Text style={style.label}>Arquivo OFX</Text>
            <Button
              title={
                selectedFile ? selectedFile.name : "Selecionar arquivo OFX"
              }
              onPress={handlePickFile}
              variant="outline"
            />
            {errors.file && <Text style={style.errorText}>{errors.file}</Text>}
          </View>

          <BankAccountDropDown
            selectedBankAccountId={selectedBankAccountId}
            onSelect={setSelectedBankAccountId}
            error={errors.bankAccount}
            isOpen={isBankAccountDropdownOpen}
            onToggle={() => {
              setIsBankAccountDropdownOpen(!isBankAccountDropdownOpen);
              setIsIncomeCategoryDropdownOpen(false);
              setIsExpenseCategoryDropdownOpen(false);
            }}
          />

          <CategoryDropdown
            selectedCategoryId={selectedIncomeCategoryId}
            onSelect={setSelectedIncomeCategoryId}
            error={errors.incomeCategory}
            isOpen={isIncomeCategoryDropdownOpen}
            onToggle={() => {
              setIsIncomeCategoryDropdownOpen(!isIncomeCategoryDropdownOpen);
              setIsBankAccountDropdownOpen(false);
              setIsExpenseCategoryDropdownOpen(false);
            }}
            type="INCOME"
            label="Categoria Padrão para Receitas"
          />

          {/* Categoria padrão para despesas */}
          <CategoryDropdown
            selectedCategoryId={selectedExpenseCategoryId}
            onSelect={setSelectedExpenseCategoryId}
            error={errors.expenseCategory}
            isOpen={isExpenseCategoryDropdownOpen}
            onToggle={() => {
              setIsExpenseCategoryDropdownOpen(!isExpenseCategoryDropdownOpen);
              setIsBankAccountDropdownOpen(false);
              setIsIncomeCategoryDropdownOpen(false);
            }}
            type="EXPENSE"
            label="Categoria Padrão para Despesas"
          />

          <Button
            title={
              importMutation.isPending ? "Enviando..." : "Importar Extrato"
            }
            onPress={handleImport}
            disabled={importMutation.isPending}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>

      <View style={style.section}>
        <Text style={style.sectionTitle}>Histórico de Importações</Text>

        {jobs && jobs.length === 0 ? (
          <View style={style.emptyState}>
            <Text style={style.emptyText}>
              Nenhuma importação realizada ainda.
            </Text>
          </View>
        ) : (
          <View style={style.jobsList}>
            {jobs?.map((job) => (
              <IngestionJobListItem key={job.id} job={job} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
