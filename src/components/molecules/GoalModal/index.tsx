import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { parseISO, isAfter, isToday, addDays, format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Goal, CreateGoalRequest } from "@/types/goals";
import { z } from "zod";
import { styles } from "./styles";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { ColorSelector } from "@/components/atoms/ColorSelector";
import { CurrencyInput } from "@/components/atoms/CurrencyInput";
import { DatePickerField } from "@/components/atoms/DatePickerField";
import { colors } from "@/constants/theme";
import { DEFAULT_COLOR } from "@/constants/colors";

const goalSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  color_hex: z
    .string()
    .min(1, "Cor é obrigatória")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato hexadecimal"),
  initial_balance: z
    .number()
    .min(0, "Saldo inicial deve ser maior ou igual a zero"),
  goal_amount: z.number().min(0.01, "Valor da meta deve ser maior que zero"),
  target_at: z
    .string()
    .min(1, "Data da meta é obrigatória")
    .refine((val) => {
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(val)) return false;
      const date = parseISO(val);
      const today = new Date();
      return isToday(date) || isAfter(date, today);
    }, "Data da meta deve ser hoje ou uma data futura"),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateGoalRequest) => Promise<void>;
  goal?: Goal | null;
  mode: "create" | "edit";
}

export const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  onClose,
  onSave,
  goal,
  mode,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    description: "",
    color_hex: DEFAULT_COLOR,
    initial_balance: 0,
    goal_amount: 0,
    target_at: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof GoalFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === "edit" && goal) {
      setFormData({
        name: goal.name,
        description: goal.description || "",
        color_hex: goal.color_hex,
        initial_balance:
          typeof goal.initial_balance === "string"
            ? parseFloat(goal.initial_balance.replace(",", "."))
            : goal.initial_balance,
        goal_amount:
          typeof goal.goal_amount === "string"
            ? parseFloat(goal.goal_amount.replace(",", "."))
            : goal.goal_amount,
        target_at: goal.target_at,
      });
    } else {
      // Set tomorrow as default target date
      const tomorrow = addDays(new Date(), 1);
      const tomorrowString = format(tomorrow, "yyyy-MM-dd");

      setFormData({
        name: "",
        description: "",
        color_hex: DEFAULT_COLOR,
        initial_balance: 0,
        goal_amount: 0,
        target_at: tomorrowString,
      });
    }
    setErrors({});
  }, [mode, goal, visible]);

  const validateForm = (): boolean => {
    try {
      goalSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof GoalFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof GoalFormData] = err.message;
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
      const saveData: CreateGoalRequest = {
        name: formData.name,
        description: formData.description || undefined,
        color_hex: formData.color_hex,
        initial_balance: formData.initial_balance.toString(),
        goal_amount: formData.goal_amount.toString(),
        target_at: formData.target_at,
      };

      await onSave(saveData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const footer = (
    <>
      <Button
        title="Cancelar"
        onPress={handleClose}
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
  );

  return (
    <ModalContainer
      visible={visible}
      onClose={handleClose}
      title={mode === "edit" ? "Editar Meta" : "Nova Meta"}
      footer={footer}
    >
      <FormField
        label="Nome da Meta"
        value={formData.name}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, name: text }))
        }
        placeholder="Ex: Viagem de férias"
      />
      {errors.name && (
        <Text
          style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
        >
          {errors.name}
        </Text>
      )}

      <FormField
        label="Descrição (opcional)"
        value={formData.description}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, description: text }))
        }
        placeholder="Descrição da sua meta..."
        multiline
        numberOfLines={3}
      />
      {errors.description && (
        <Text
          style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
        >
          {errors.description}
        </Text>
      )}

      <CurrencyInput
        label="Saldo Inicial"
        value={formData.initial_balance.toString()}
        onChangeText={(formattedValue, numericValue) =>
          setFormData((prev) => ({ ...prev, initial_balance: numericValue }))
        }
        placeholder="0,00"
        error={errors.initial_balance}
      />

      <CurrencyInput
        label="Valor da Meta"
        value={formData.goal_amount.toString()}
        onChangeText={(formattedValue, numericValue) =>
          setFormData((prev) => ({ ...prev, goal_amount: numericValue }))
        }
        placeholder="0,00"
        error={errors.goal_amount}
      />

      <DatePickerField
        label="Data da Meta"
        value={formData.target_at}
        onDateChange={(isoDate) =>
          setFormData((prev) => ({ ...prev, target_at: isoDate }))
        }
        placeholder="DD/MM/AAAA"
        error={errors.target_at}
        minimumDate={new Date()}
      />

      <ColorSelector
        label="Cor da Meta"
        selectedColor={formData.color_hex}
        onColorSelect={(color) =>
          setFormData((prev) => ({ ...prev, color_hex: color }))
        }
        error={errors.color_hex}
      />
      {errors.target_at && (
        <Text
          style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
        >
          {errors.target_at}
        </Text>
      )}
    </ModalContainer>
  );
};
