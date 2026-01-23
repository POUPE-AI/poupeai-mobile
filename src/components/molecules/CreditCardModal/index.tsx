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
import { useInstitutions } from "@/hooks/useInstitutions";

const creditCardSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    credit_limit: z.number().min(0.01, "Limite deve ser maior que zero"),
    closing_day: z
      .number()
      .min(1, "Dia do fechamento é obrigatório")
      .max(31, "Dia deve ser entre 1 e 31"),
    due_day: z
      .number()
      .min(1, "Dia do vencimento é obrigatório")
      .max(31, "Dia deve ser entre 1 e 31"),
    institutionId: z.number().min(1, "Instituição é obrigatória"),
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
    closing_day: 1,
    due_day: 1,
    institutionId: 1,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreditCardFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const { data: institutionData, isLoading: institutionIsLoading } =
    useInstitutions();

  useEffect(() => {
    if (!visible) return;

    if (mode === "edit" && card) {
      setFormData({
        name: card.name,
        credit_limit: card.creditLimit,
        closing_day: card.closingDay,
        due_day: card.dueDay,
        institutionId: card.institutionId,
      });
    } else {
      setFormData({
        name: "",
        credit_limit: 0,
        closing_day: 1,
        due_day: 1,
        institutionId: institutionData?.[0]?.id || 1,
      });
    }
    setErrors({});
    setBrandDropdownOpen(false);
  }, [mode, card, visible, institutionData]);

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
        creditLimit: formData.credit_limit,
        closingDay: formData.closing_day,
        dueDay: formData.due_day,
        institutionId: formData.institutionId,
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
        <Text style={style.brandLabel}>Instituição</Text>
        <DropdownSelector
          items={
            institutionData?.map((inst) => ({
              id: inst.id,
              label: inst.name,
            })) || []
          }
          selectedId={formData.institutionId}
          onSelect={(item) =>
            setFormData((prev) => ({
              ...prev,
              institutionId: item.id,
            }))
          }
          placeholder="Selecione a instituição"
          isOpen={brandDropdownOpen}
          onToggle={() => setBrandDropdownOpen(!brandDropdownOpen)}
          error={!!errors.institutionId}
          disabled={institutionIsLoading}
        />
        {institutionIsLoading && (
          <Text
            style={{
              color: colors.theme[theme].text,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Carregando instituições...
          </Text>
        )}
        {errors.institutionId && (
          <Text
            style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}
          >
            {errors.institutionId}
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
    </ModalContainer>
  );
};
