import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Budget, CreateBudgetRequest } from "@/types";
import { z } from "zod";
import { styles } from "./styles";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { CategoryDropdown } from "@/components/molecules/CategoryDropdown";
import { CurrencyInput } from "@/components/atoms/CurrencyInput";
import { useCategories } from "@/hooks/useCategories";
import { colors } from "@/constants/theme";

const budgetSchema = z.object({
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  category: z.number().min(1, "Categoria é obrigatória"),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateBudgetRequest) => Promise<void>;
  budget?: Budget | null;
  mode: "create" | "edit";
  onCreateCategory?: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  visible,
  onClose,
  onSave,
  budget,
  mode,
  onCreateCategory,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);
  const { data: categoriesResponse } = useCategories();

  const [formData, setFormData] = useState<BudgetFormData>({
    amount: 0,
    name: "",
    category: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BudgetFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === "edit" && budget) {
      setFormData({
        amount: budget.amount,
        name: budget.name,
        category: budget.category,
      });
    } else {
      setFormData({
        amount: 0,
        name: "",
        category: 0,
      });
    }
    setErrors({});
    setCategoryDropdownOpen(false);
  }, [mode, budget, visible]);

  const validateForm = (): boolean => {
    try {
      budgetSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof BudgetFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof BudgetFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const saveData: CreateBudgetRequest = {
        amount: formData.amount.toString(),
        name: formData.name,
        category: formData.category,
      };

      await onSave(saveData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <ModalContainer
      visible={visible}
      onClose={handleClose}
      title={mode === "edit" ? "Editar Orçamento" : "Novo Orçamento"}
      footer={
        <>
          <Button
            title="Cancelar"
            onPress={onClose}
            variant="outline"
            style={style.cancelButton}
          />
          <Button
            title={mode === "create" ? "Criar" : "Salvar"}
            onPress={handleSave}
            loading={isLoading}
            style={style.saveButton}
          />
        </>
      }
    >
      <FormField
        label="Nome do Orçamento"
        value={formData.name}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, name: text }))
        }
        placeholder="Ex: Alimentação Janeiro"
      />
      {errors.name && (
        <Text
          style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
        >
          {errors.name}
        </Text>
      )}

      <CurrencyInput
        label="Valor do Orçamento"
        value={formData.amount.toString()}
        onChangeText={(formattedValue, numericValue) =>
          setFormData((prev) => ({ ...prev, amount: numericValue }))
        }
        placeholder="0,00"
        error={errors.amount}
      />

      <CategoryDropdown
        categories={categoriesResponse?.results || []}
        selectedCategoryId={formData.category}
        onSelect={(categoryId) =>
          setFormData((prev) => ({ ...prev, category: categoryId }))
        }
        error={errors.category}
        isOpen={categoryDropdownOpen}
        onToggle={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
        filterType="expense"
        onCreateCategory={onCreateCategory}
      />
    </ModalContainer>
  );
};
