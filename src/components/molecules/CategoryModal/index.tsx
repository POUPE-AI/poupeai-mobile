import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { runOnJS } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Category } from '@/types';
import { z } from 'zod';
import { styles } from './styles';
import { TypeSelector } from '@/components/atoms/TypeSelector';
import { ModalContainer } from '@/components/atoms/ModalContainer';
import { ModalHeader } from '@/components/atoms/ModalHeader';
import { FormField } from '@/components/atoms/FormField';
import { ColorPickerModal } from '@/components/molecules/ColorPickerModal';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  color_hex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal válido'),
  type: z.enum(['income', 'expense'], { message: 'Tipo deve ser receita ou despesa' }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<void>;
  category?: Category | null;
  mode: 'create' | 'edit';
}

const predefinedColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
];

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
    name: '',
    color_hex: '#4ECDC4',
    type: 'expense',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Preenche o formulário quando estiver editando
  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        color_hex: category.color_hex,
        type: category.type,
      });
    } else {
      setFormData({
        name: '',
        color_hex: '#4ECDC4',
        type: 'expense',
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
        'Erro',
        mode === 'create' 
          ? 'Erro ao criar categoria. Tente novamente.' 
          : 'Erro ao editar categoria. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color_hex: color }));
  };

  const updateColorFormData = (colorHex: string) => {
    setFormData(prev => ({ ...prev, color_hex: colorHex }));
  };

  const onColorSelect = (color: any) => {
    'worklet';
    runOnJS(updateColorFormData)(color.hex);
  };

  const renderTypeSelector = () => (
    <TypeSelector
      selectedType={formData.type}
      onTypeSelect={(type) => setFormData(prev => ({ ...prev, type }))}
      error={errors.type}
    />
  );

  const renderColorSelector = () => (
    <View style={style.colorContainer}>
      <Text style={style.label}>Cor</Text>
      
      {/* Cores predefinidas */}
      <View style={style.predefinedColorsContainer}>
        {predefinedColors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              style.colorSwatch,
              { backgroundColor: color },
              formData.color_hex === color && style.colorSwatchSelected,
            ]}
            onPress={() => handleColorSelect(color)}
          />
        ))}
        
        {/* Botão para abrir color picker personalizado */}
        <TouchableOpacity
          style={[style.colorSwatch, style.customColorButton]}
          onPress={() => setShowColorPicker(true)}
        >
          <Ionicons name="color-palette" size={16} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      {errors.color_hex && <Text style={style.errorText}>{errors.color_hex}</Text>}
    </View>
  );

  return (
    <>
      <ModalContainer visible={visible} onClose={onClose}>
        <ModalHeader 
          title={mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'}
          onClose={onClose}
          closeIcon="close"
        />

        <View style={style.content}>
          <FormField
            label="Nome"
            placeholder="Digite o nome da categoria"
            value={formData.name}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
            maxLength={50}
            error={errors.name}
          />

          {renderTypeSelector()}

          {renderColorSelector()}
        </View>

        {/* Footer com botões */}
        <View style={style.footer}>
          <Button
            title="Cancelar"
            onPress={onClose}
            variant="outline"
            style={style.cancelButton}
          />
          <Button
            title={mode === 'create' ? 'Criar' : 'Salvar'}
            onPress={handleSave}
            loading={isLoading}
            style={style.saveButton}
          />
        </View>
      </ModalContainer>

      <ColorPickerModal
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        currentColor={formData.color_hex}
        onColorSelect={onColorSelect}
      />
    </>
  );
};
