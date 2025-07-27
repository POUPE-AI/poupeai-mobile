import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Category, CategoryType } from '@/types';
import { z } from 'zod';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { styles } from './styles';

// Schema de validação Zod
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

  const onColorSelect = (color: any) => {
    setFormData(prev => ({ ...prev, color_hex: color.hex }));
  };

  const renderTypeSelector = () => (
    <View style={style.typeContainer}>
      <Text style={style.label}>Tipo</Text>
      <View style={style.typeButtonsContainer}>
        <TouchableOpacity
          style={[
            style.typeButton,
            formData.type === 'income' && style.typeButtonActive,
          ]}
          onPress={() => setFormData(prev => ({ ...prev, type: 'income' }))}
        >
          <Ionicons 
            name="trending-up" 
            size={20} 
            color={formData.type === 'income' ? '#fff' : style.typeButtonText.color} 
          />
          <Text style={[
            style.typeButtonText,
            formData.type === 'income' && style.typeButtonTextActive,
          ]}>Receita</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            style.typeButton,
            formData.type === 'expense' && style.typeButtonActive,
          ]}
          onPress={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
        >
          <Ionicons 
            name="trending-down" 
            size={20} 
            color={formData.type === 'expense' ? '#fff' : style.typeButtonText.color} 
          />
          <Text style={[
            style.typeButtonText,
            formData.type === 'expense' && style.typeButtonTextActive,
          ]}>Despesa</Text>
        </TouchableOpacity>
      </View>
      {errors.type && <Text style={style.errorText}>{errors.type}</Text>}
    </View>
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
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={style.container}>
          <View style={style.header}>
            <TouchableOpacity onPress={onClose} style={style.closeButton}>
              <Ionicons name="close" size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={style.title}>
              {mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'}
            </Text>
            <View style={style.placeholder} />
          </View>

          <View style={style.content}>
            <View style={style.fieldContainer}>
              <Text style={style.label}>Nome</Text>
              <TextInput
                style={[style.input, errors.name && style.inputError]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Digite o nome da categoria"
                placeholderTextColor={themeColors.textSecondary}
                maxLength={50}
              />
              {errors.name && <Text style={style.errorText}>{errors.name}</Text>}
            </View>

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
        </View>
      </Modal>

      {/* Modal do Color Picker */}
      <Modal
        visible={showColorPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={style.colorPickerContainer}>
          <View style={style.colorPickerHeader}>
            <TouchableOpacity onPress={() => setShowColorPicker(false)}>
              <Text style={style.colorPickerCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={style.colorPickerTitle}>Escolher Cor</Text>
            <TouchableOpacity onPress={() => setShowColorPicker(false)}>
              <Text style={style.colorPickerDone}>Pronto</Text>
            </TouchableOpacity>
          </View>
          
          <View style={style.colorPickerContent}>
            <ColorPicker 
              style={style.colorPicker} 
              value={formData.color_hex} 
              onComplete={onColorSelect}
            >
              <Preview style={style.colorPickerPreview} />
              <Panel1 style={style.colorPickerPanel} />
              <HueSlider style={style.colorPickerSlider} />
              <OpacitySlider style={style.colorPickerSlider} />
              <Swatches 
                style={style.colorPickerSwatches}
                swatchStyle={style.colorPickerSwatch}
                colors={predefinedColors}
              />
            </ColorPicker>
          </View>
        </View>
      </Modal>
    </>
  );
};
