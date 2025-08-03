import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CreateCreditCardRequest } from "@/types";
import { z } from "zod";
import { styles } from "./styles";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { DropdownSelector } from "@/components/atoms/DropdownSelector";
import { CurrencyInput } from "@/components/atoms/CurrencyInput";
import { NumberInput } from "@/components/atoms/NumberInput";
import { colors } from "@/constants/theme";

const creditCardSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    credit_limit: z.number().min(0.01, "Limite deve ser maior que zero"),
    additional_info: z
      .string()
      .max(500, "Informações adicionais devem ter no máximo 500 caracteres"),
    closing_day: z
      .number()
      .min(1, "Dia do fechamento é obrigatório")
      .max(31, "Dia deve ser entre 1 e 31"),
    due_day: z
      .number()
      .min(1, "Dia do vencimento é obrigatório")
      .max(31, "Dia deve ser entre 1 e 31"),
    brand: z.string().min(1, "Bandeira é obrigatória"),
  })
  .refine((data) => data.closing_day !== data.due_day, {
    message: "Data de fechamento deve ser diferente da data de vencimento",
    path: ["due_day"],
  });

type CreditCardFormData = z.infer<typeof creditCardSchema>;

interface CreditCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateCreditCardRequest) => Promise<void>;
  card?: Card | null;
  mode: "create" | "edit";
}

const BRAND_OPTIONS = [
  { id: 1, label: "Visa" },
  { id: 2, label: "Mastercard" },
  { id: 3, label: "American Express" },
  { id: 4, label: "Elo" },
  { id: 5, label: "Hipercard" },
];

const BRAND_MAP: { [key: number]: string } = {
  1: "VISA",
  2: "MASTERCARD",
  3: "AMEX",
  4: "ELO",
  5: "HIPERCARD",
};

const REVERSE_BRAND_MAP: { [key: string]: number } = {
  VISA: 1,
  MASTERCARD: 2,
  AMEX: 3,
  ELO: 4,
  HIPERCARD: 5,
};

export const CreditCardModal: React.FC<CreditCardModalProps> = ({
  visible,
  onClose,
  onSave,
  card,
  mode,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [formData, setFormData] = useState<CreditCardFormData>({
    name: "",
    credit_limit: 0,
    additional_info: "",
    closing_day: 0,
    due_day: 0,
    brand: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreditCardFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === "edit" && card) {
      setFormData({
        name: card.name,
        credit_limit:
          typeof card.credit_limit === "string"
            ? parseFloat(card.credit_limit.replace(",", "."))
            : card.credit_limit,
        additional_info: card.additional_info || "",
        closing_day: card.closing_day,
        due_day: card.due_day,
        brand: card.brand,
      });
    } else {
      setFormData({
        name: "",
        credit_limit: 0,
        additional_info: "",
        closing_day: 0,
        due_day: 0,
        brand: "",
      });
    }
    setErrors({});
    setBrandDropdownOpen(false);
  }, [mode, card, visible]);

  const validateForm = (): boolean => {
    try {
      creditCardSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CreditCardFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CreditCardFormData] = err.message;
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
      const saveData: CreateCreditCardRequest = {
        name: formData.name,
        credit_limit: formData.credit_limit,
        additional_info: formData.additional_info || undefined,
        closing_day: formData.closing_day,
        due_day: formData.due_day,
        brand: formData.brand,
      };

      await onSave(saveData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cartão de crédito:", error);
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
      title={mode === "edit" ? "Editar Cartão" : "Novo Cartão"}
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
        label="Nome do Cartão"
        value={formData.name}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, name: text }))
        }
        placeholder="Ex: Cartão Nubank"
      />
      {errors.name && (
        <Text
          style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
        >
          {errors.name}
        </Text>
      )}

      <CurrencyInput
        label="Limite de Crédito"
        value={formData.credit_limit.toString()}
        onChangeText={(formattedValue, numericValue) =>
          setFormData((prev) => ({ ...prev, credit_limit: numericValue }))
        }
        placeholder="0,00"
        error={errors.credit_limit}
      />

      <View style={style.brandContainer}>
        <Text style={style.brandLabel}>Bandeira</Text>
        <DropdownSelector
          items={BRAND_OPTIONS}
          selectedId={REVERSE_BRAND_MAP[formData.brand] || 0}
          onSelect={(item) =>
            setFormData((prev) => ({
              ...prev,
              brand: BRAND_MAP[item.id] || "",
            }))
          }
          placeholder="Selecione a bandeira"
          isOpen={brandDropdownOpen}
          onToggle={() => setBrandDropdownOpen(!brandDropdownOpen)}
          error={!!errors.brand}
        />
        {errors.brand && (
          <Text
            style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
          >
            {errors.brand}
          </Text>
        )}
      </View>

      <View style={style.dayRow}>
        <View style={style.dayContainer}>
          <NumberInput
            label="Dia do Fechamento"
            value={formData.closing_day}
            onChangeNumber={(value) =>
              setFormData((prev) => ({ ...prev, closing_day: value }))
            }
            placeholder="1-31"
            error={errors.closing_day}
            minValue={1}
            maxValue={31}
          />
        </View>

        <View style={style.dayContainer}>
          <NumberInput
            label="Dia do Vencimento"
            value={formData.due_day}
            onChangeNumber={(value) =>
              setFormData((prev) => ({ ...prev, due_day: value }))
            }
            placeholder="1-31"
            error={errors.due_day}
            minValue={1}
            maxValue={31}
          />
        </View>
      </View>

      <FormField
        label="Informações Adicionais"
        value={formData.additional_info}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, additional_info: text }))
        }
        placeholder="Informações extras sobre o cartão..."
        multiline
        numberOfLines={3}
      />
      {errors.additional_info && (
        <Text
          style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
        >
          {errors.additional_info}
        </Text>
      )}
    </ModalContainer>
  );
};
