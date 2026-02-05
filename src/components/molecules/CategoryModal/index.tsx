import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { Category } from "@/types";
import { z } from "zod";
import { styles } from "./styles";
import { TypeSelector } from "@/components/atoms/TypeSelector";
import { ModalContainer } from "@/components/atoms/ModalContainer";
import { FormField } from "@/components/atoms/FormField";
import { ColorSelector } from "@/components/atoms/ColorSelector";
import { IconSelector } from "@/components/atoms/IconSelector";
import { DEFAULT_COLOR } from "@/constants/colors";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  colorHex: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato hexadecimal válido"),
  iconName: z.string().min(1, "Ícone é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Tipo deve ser receita ou despesa",
  }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<void>;
  category?: Category | null;
  mode: "create" | "edit";
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onSave,
  category,
  mode,
}) => {
  const { theme, colors: themeColors } = useTheme();
  const style = styles(theme);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    colorHex: DEFAULT_COLOR,
    iconName: "pricetag-outline",
    type: "EXPENSE",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  // Preenche o formulário quando estiver editando
  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        colorHex: category.colorHex,
        iconName: category.iconName || "pricetag-outline",
        type: category.type === "INCOME" ? "INCOME" : "EXPENSE",
      });
    } else {
      setFormData({
        name: "",
        colorHex: DEFAULT_COLOR,
        iconName: "pricetag-outline",
        type: "EXPENSE",
      });
    }
    setErrors({});
  }, [mode, category, visible]);

  const validateForm = (): boolean => {
    try {
      categorySchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CategoryFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      Alert.alert(
        "Erro",
        mode === "create"
          ? "Erro ao criar categoria. Tente novamente."
          : "Erro ao editar categoria. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, colorHex: color }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData((prev) => ({ ...prev, iconName: icon }));
  };

  const renderTypeSelector = () => (
    <TypeSelector
      selectedType={formData.type === "INCOME" ? "income" : "expense"}
      onTypeSelect={(type) =>
        setFormData((prev) => ({
          ...prev,
          type: type === "income" ? "INCOME" : "EXPENSE",
        }))
      }
      error={errors.type}
    />
  );

  const renderColorSelector = () => (
    <ColorSelector
      label="Cor"
      selectedColor={formData.colorHex}
      onColorSelect={handleColorSelect}
      error={errors.colorHex}
    />
  );

  const renderIconSelector = () => (
    <IconSelector
      label="Ícone"
      selectedIcon={formData.iconName}
      onIconSelect={handleIconSelect}
      error={errors.iconName}
    />
  );

  return (
    <>
      <ModalContainer
        visible={visible}
        onClose={onClose}
        title={mode === "create" ? "Nova Categoria" : "Editar Categoria"}
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
          label="Nome"
          placeholder="Digite o nome da categoria"
          value={formData.name}
          onChangeText={(text: string) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          maxLength={50}
          error={errors.name}
        />

        {renderTypeSelector()}

        {renderIconSelector()}

        {renderColorSelector()}
      </ModalContainer>
    </>
  );
};
