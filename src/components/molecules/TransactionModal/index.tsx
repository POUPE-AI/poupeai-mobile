import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/atoms/Button";
import { z } from "zod";
import { styles } from "./styles";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import {
  CreateTransactionRequest,
  Transaction,
} from "@/types/transactions";
import { useBankAccounts } from "@/hooks/useBankAccounts";

import { TransactionSourceType, TransactionTypeSelector } from "@/components/atoms/TransactionTypeSelector";
import { CategoryDropdown } from "../CategoryDropdown";
import { BankAccountDropDown } from "../BankAccountDropdown";
import { CreditCardDropDown } from "../CreditCardDropdown";
import { DatePickerField } from "@/components/atoms/DatePickerField";
import { set } from "date-fns";

const transactionSchema = z
  .object({
    description: z
      .string()
      .min(1, "Descrição é obrigatória")
      .max(200, "Descrição deve ter no máximo 200 caracteres"),
    amount: z.number().nonoptional("Valor é obrigatório e diferente de zero"),
    issue_date: z.string().nonempty("Data de emissão é obrigatória"),
    category: z.string().nonempty("Categoria é obrigatória"),
    bank_account: z.string().optional(),
    credit_card: z.string().optional(),
    is_installment: z.boolean().optional(),
    installment_number: z.number().int().optional(),
    total_installments: z.number().int().optional(),
  })
  .refine(
    (data) =>
      !data.is_installment ||
      (data.installment_number &&
        data.total_installments &&
        data.installment_number <= data.total_installments),
    {
      message:
        "O número da parcela e o total de parcelas devem ser preenchidos e o número da parcela não pode ser maior que o total de parcelas.",
      path: ["installment_number", "total_installments"],
    }
  );

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateTransactionRequest) => Promise<void>;
  transaction?: Transaction | null;
  mode: "create" | "edit";
  onCreateCategory?: () => void;
  onCreateBankAccount?: () => void;
  onCreateCreditCard?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  visible,
  onClose,
  onSave,
  transaction,
  mode,
  onCreateCategory,
  onCreateBankAccount,
  onCreateCreditCard,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [ammountInput, setAmmountInput] = useState<string>("");

  const { data: bankAccounts, isLoading: bankLoading } = useBankAccounts();
  const bankDefault = bankAccounts?.find(
    (account) => account.isDefault
  );

  const [categoriesIsOpen, setCategoriesIsOpen] = useState(false);
  const [bankAccountIsOpen, setBankAccountIsOpen] = useState(false);
  const [bankCreditCardIsOpen, setCreditCardIsOpen] = useState(false);
  const [sourceType, setSourceType] = useState<TransactionSourceType>("BANK_ACCOUNT");

  const [formData, setFormData] = useState<TransactionFormData>({
    description: "",
    amount: 0.0,
    issue_date: "",
    category: "",
    bank_account: bankDefault?.id || undefined,
    credit_card: undefined,
    is_installment: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});

  const [isLoading, setIsLoading] = useState(false);

  // Identifica se é edição de transação de cartão de crédito
  // Quando verdadeiro, restringe edição apenas para: descrição, valor e categoria
  const isCreditCardEditMode =
    mode === "edit" && transaction?.creditCardId != undefined;

  // Preenche o formulário quando estiver editando
  useEffect(() => {
    if (mode === "edit" && transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        issue_date: transaction.transactionDate,
        category: transaction.category.id || "",
        bank_account: transaction.bankAccountId ?? undefined,
        credit_card: transaction.creditCardId ?? undefined,
        is_installment: transaction.isInstallment,
        installment_number: transaction.installmentNumber ?? undefined,
        total_installments: transaction.totalInstallments ?? undefined,
      });
      setSourceType(
        transaction.creditCardId ? "CREDIT_CARD" : "BANK_ACCOUNT"
      );
      setAmmountInput(
        `R$ ${transaction.amount
          .toFixed(2)
          .replace(".", ",")
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`
      );
    } else {
      setFormData({
        description: "",
        amount: 0.0,
        issue_date: "",
        category: "",
        bank_account: bankDefault?.id || undefined,
        credit_card: undefined,
        is_installment: false,
      });
      setAmmountInput("");
    }
    setErrors({});
  }, [mode, transaction, visible, bankDefault, bankLoading]);

  const validateForm = (): boolean => {
    try {
      transactionSchema.parse(formData);

      if (formData.amount === 0) {
        setErrors((prev) => ({
          ...prev,
          amount: "Valor deve ser diferente de zero",
        }));
        console.log("Valor deve ser diferente de zero");
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof TransactionFormData, string>> =
          {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof TransactionFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }

      console.log("Erro de validação do formulário:", error);
      return false;
    }
  };

  const handleSave = async () => {
    console.log(formData);
    if (!validateForm()) return;

    console.log(formData);

    setIsLoading(true);
    try {
      if (isCreditCardEditMode) {
        const saveData: Partial<CreateTransactionRequest> = {
          description: formData.description,
          amount: formData.amount,
          ...(formData.category ? { categoryId: formData.category } : {}),
        };
        await onSave(saveData as CreateTransactionRequest);
      } else {
        const saveData: CreateTransactionRequest = {
          description: formData.description,
          amount: formData.amount,
          transactionDate:
            formData.issue_date || new Date().toISOString().slice(0, 10),
          ...(formData.bank_account ? { bankAccountId: formData.bank_account } : {}),
          ...(formData.credit_card ? { creditCardId: formData.credit_card } : {}),
          ...(formData.category ? { categoryId: formData.category } : {}),
          ...(typeof formData.is_installment !== "undefined"
            ? { isInstallment: formData.is_installment }
            : {}),
          ...(typeof formData.total_installments !== "undefined"
            ? { totalInstallments: formData.total_installments }
            : {}),
        } as CreateTransactionRequest;

        await onSave(saveData);
      }

      onClose();
    } catch (error) {
      Alert.alert(
        "Erro",
        mode === "create"
          ? "Erro ao criar transação. Tente novamente."
          : "Erro ao editar transação. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalContainer
        visible={visible}
        onClose={onClose}
        title={mode === "create" ? "Nova Transação" : "Editar Transação"}
        footer={
          <>
            <Button
              title="Cancelar"
              onPress={onClose}
              variant="outline"
              style={style.button}
            />
            <Button
              title={mode === "create" ? "Criar" : "Salvar"}
              onPress={handleSave}
              loading={isLoading}
              style={style.button}
            />
          </>
        }
      >
        <FormField
          label="Descrição"
          placeholder="Digite a descrição da transação"
          value={formData.description}
          onChangeText={(text: string) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          maxLength={50}
          error={errors.description}
        />

        <FormField
          label="Valor"
          placeholder="R$ 0,00"
          value={ammountInput}
          keyboardType="numeric"
          error={errors.amount}
          onChangeText={(text: string) => {
            const onlyDigits = text.replace(/\D/g, "");
            const numeric = onlyDigits.padStart(3, "0");

            // 👇 Remove zeros à esquerda da parte inteira, mas mantém 0 se tudo for zero
            const integerPart = numeric.slice(0, -2).replace(/^0+/, "") || "0";
            const decimalPart = numeric.slice(-2);

            const formattedInteger = integerPart.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              "."
            );
            const formatted = `${formattedInteger},${decimalPart}`;

            const value = parseFloat(`${integerPart}.${decimalPart}`);

            setAmmountInput(`R$ ${formatted}`);
            setFormData((prev) => ({
              ...prev,
              amount: isNaN(value) ? 0 : value,
            }));
          }}
        />

        <CategoryDropdown
          selectedCategoryId={formData.category}
          onSelect={(categoryId: string) =>
            setFormData((prev) => ({ ...prev, category: categoryId }))
          }
          isOpen={categoriesIsOpen}
          onToggle={() => setCategoriesIsOpen((prev) => !prev)}
          onCreateCategory={onCreateCategory}
        />

        <DatePickerField
          label="Data de Emissão"
          value={formData.issue_date}
          onDateChange={(isoDate) => {
            setFormData((prev) => ({
              ...prev,
              issue_date: isoDate,
            }));
          }}
          placeholder="DD/MM/AAAA"
          error={errors.issue_date}
          disabled={isCreditCardEditMode}
        />

        <TransactionTypeSelector
          selectedType={sourceType}
          onTypeSelect={(source_type) => {
            if (source_type === "BANK_ACCOUNT") {
              setFormData((prev) => ({
                ...prev,
                bank_account: bankDefault?.id || undefined,
                credit_card: undefined,
                is_installment: false,
                installment_number: undefined,
                total_installments: undefined,
              }));
              
            } else if (source_type === "CREDIT_CARD") {
              setFormData((prev) => ({
                ...prev,
                bank_account: undefined,
                credit_card: undefined,
              }));
            }

            setSourceType(source_type);
          }}
          disabled={isCreditCardEditMode}
        />

        {sourceType === "BANK_ACCOUNT" ? (
          <BankAccountDropDown
            selectedBankAccountId={formData.bank_account}
            onSelect={(id) =>
              setFormData((prev) => ({ ...prev, bank_account: id }))
            }
            error={errors.bank_account}
            isOpen={bankAccountIsOpen}
            onToggle={() => setBankAccountIsOpen((prev) => !prev)}
            onCreateAccount={onCreateBankAccount}
          />
        ) : (
          sourceType === "CREDIT_CARD" && (
            <>
              <CreditCardDropDown
                selectedCreditCardId={formData.credit_card}
                onSelect={(id) =>
                  setFormData((prev) => ({ ...prev, credit_card: id }))
                }
                error={errors.credit_card}
                isOpen={bankCreditCardIsOpen}
                onToggle={() => setCreditCardIsOpen((prev) => !prev)}
                onCreateCreditCard={onCreateCreditCard}
                disabled={isCreditCardEditMode}
              />

              <FormField
                label="Parcelas"
                placeholder="Número de parcelas"
                value={formData.total_installments?.toString() || ""}
                keyboardType="numeric"
                editable={!isCreditCardEditMode}
                onChangeText={(text: string) => {
                  const cleanedText = text.replace(/\D/g, "");
                  const value = parseInt(cleanedText, 10);

                  if (!isNaN(value) && value > 0) {
                    setFormData((prev) => {
                      let newInstallment = prev.installment_number;
                      if (newInstallment && newInstallment > value) {
                        newInstallment = value;
                      }
                      return {
                        ...prev,
                        is_installment: true,
                        total_installments: value,
                        installment_number: newInstallment,
                      };
                    });
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      is_installment: undefined,
                      total_installments: undefined,
                    }));
                  }
                }}
                error={errors.total_installments}
                maxLength={2}
              />

              <FormField
                label="Número da Parcela"
                placeholder="Número da parcela"
                value={formData.installment_number?.toString() || ""}
                keyboardType="numeric"
                editable={!isCreditCardEditMode}
                onChangeText={(text: string) => {
                  const cleanedText = text.replace(/\D/g, "");
                  const value = parseInt(cleanedText, 10);

                  if (!isNaN(value) && value > 0) {
                    setFormData((prev) => {
                      let newTotal = prev.total_installments;
                      if (!newTotal || value > newTotal) {
                        newTotal = value;
                      }
                      return {
                        ...prev,
                        is_installment: true,
                        installment_number: value,
                        total_installments: newTotal,
                      };
                    });
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      is_installment: undefined,
                      installment_number: undefined,
                    }));
                  }
                }}
                error={errors.installment_number}
                maxLength={2}
              />
            </>
          )
        )}
      </ModalContainer>
    </>
  );
};
