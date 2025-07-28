import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Goal } from "@/types/goals";
import { styles } from "./styles";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { formatCurrency } from "@/utils/currency";
import { z } from "zod";
import { colors } from "@/constants/theme";

const goalDepositSchema = z.object({
  depositAmount: z.string().min(1, 'Valor é obrigatório').refine((val) => {
    const amount = parseFloat(val.replace(',', '.'));
    return !isNaN(amount) && amount > 0;
  }, 'Valor deve ser maior que zero'),
  depositDate: z.string().min(1, 'Data é obrigatória').refine((val) => {
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(val)) return false;
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Data deve estar no formato válido'),
  note: z.string().optional(),
});

type GoalDepositFormData = z.infer<typeof goalDepositSchema>;

interface GoalDepositModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (depositAmount: string, depositDate: string, note?: string) => Promise<void>;
  goal: Goal | null;
}

export const GoalDepositModal: React.FC<GoalDepositModalProps> = ({
  visible,
  onClose,
  onConfirm,
  goal,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [formData, setFormData] = useState<GoalDepositFormData>({
    depositAmount: "",
    depositDate: "",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GoalDepositFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible && goal) {
      // Set today's date as default
      const today = new Date();
      const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD format
      setFormData({
        depositAmount: "",
        depositDate: todayString,
        note: "",
      });
      setErrors({});
    }
  }, [visible, goal]);

  const validateForm = (): boolean => {
    try {
      goalDepositSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof GoalDepositFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof GoalDepositFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleConfirm = async () => {
    if (!goal) return;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(formData.depositAmount, formData.depositDate, formData.note || undefined);
      onClose();
    } catch (error: any) {
      console.error("Erro ao confirmar depósito:", error);

      // Extract specific error messages from API response
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.deposit_amount) {
          setErrors(prev => ({ ...prev, depositAmount: errorData.deposit_amount[0] }));
        } else if (errorData.detail) {
          setErrors(prev => ({ ...prev, depositAmount: errorData.detail }));
        } else {
          setErrors(prev => ({ ...prev, depositAmount: "Erro ao processar depósito. Tente novamente." }));
        }
      } else {
        setErrors(prev => ({ ...prev, depositAmount: "Erro ao processar depósito. Tente novamente." }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const convertToISO = (dateString: string): string => {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  const convertFromISO = (isoString: string): string => {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const parts = isoString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return isoString;
  };

  const formatDateInput = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");
    
    // Apply DD/MM/YYYY mask
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return numbers.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    } else {
      return numbers.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    }
  };

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numbers = value.replace(/[^\d,\.]/g, "");
    
    // Handle decimal separator
    if (numbers.includes(',')) {
      const parts = numbers.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        return numbers;
      }
    }
    
    return numbers;
  };

  if (!goal) return null;

  const currentAmount = parseFloat(goal.current_balance.toString()) || 0;
  const goalAmount = parseFloat(goal.goal_amount.toString()) || 0;
  const remainingAmount = goalAmount - currentAmount;

  const footer = (
    <>
      <Button
        title="Cancelar"
        onPress={onClose}
        variant="outline"
        style={style.cancelButton}
      />
      <Button
        title="Confirmar Depósito"
        onPress={handleConfirm}
        loading={isLoading}
        style={style.confirmButton}
      />
    </>
  );

  return (
    <ModalContainer
      visible={visible}
      onClose={handleClose}
      title="Fazer Depósito"
      footer={footer}
    >
      <View style={style.goalInfo}>
        <Text style={style.goalTitle}>{goal.name}</Text>

        <View style={style.goalDetail}>
          <Text style={style.goalLabel}>Valor Atual:</Text>
          <Text style={style.goalValue}>
            {formatCurrency(currentAmount)}
          </Text>
        </View>

        <View style={style.goalDetail}>
          <Text style={style.goalLabel}>Meta:</Text>
          <Text style={style.goalValue}>
            {formatCurrency(goalAmount)}
          </Text>
        </View>

        <View style={style.goalDetail}>
          <Text style={style.goalLabel}>Falta:</Text>
          <Text style={[style.goalValue, { color: remainingAmount > 0 ? style.goalValue.color : '#4CAF50' }]}>
            {formatCurrency(Math.max(0, remainingAmount))}
          </Text>
        </View>
      </View>

      <FormField
        label="Valor do Depósito"
        value={formData.depositAmount}
        onChangeText={(text) => {
          const formatted = formatCurrencyInput(text);
          setFormData(prev => ({ ...prev, depositAmount: formatted }));
          // Clear error when changing amount
          if (errors.depositAmount) {
            setErrors(prev => ({ ...prev, depositAmount: undefined }));
          }
        }}
        placeholder="0,00"
        keyboardType="numeric"
      />
      {errors.depositAmount && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.depositAmount}</Text>}

      <FormField
        label="Data do Depósito"
        value={convertFromISO(formData.depositDate)}
        onChangeText={(text) => {
          const formatted = formatDateInput(text);
          const iso = convertToISO(formatted);
          setFormData(prev => ({ ...prev, depositDate: iso }));
          // Clear error when changing date
          if (errors.depositDate) {
            setErrors(prev => ({ ...prev, depositDate: undefined }));
          }
        }}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />
      {errors.depositDate && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.depositDate}</Text>}

      <FormField
        label="Observação (opcional)"
        value={formData.note || ""}
        onChangeText={(text) => setFormData(prev => ({ ...prev, note: text }))}
        placeholder="Adicione uma observação sobre este depósito..."
        multiline
        numberOfLines={3}
      />
      {errors.note && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.note}</Text>}
    </ModalContainer>
  );
};
