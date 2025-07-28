import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Goal, CreateGoalRequest } from '@/types/goals';
import { z } from 'zod';
import { styles } from './styles';
import { ModalContainer } from '@/components/atoms/ModalContainer';
import { FormField } from '@/components/atoms/FormField';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { ColorSelector } from '@/components/atoms/ColorSelector';
import { colors } from '@/constants/theme';
import { DEFAULT_COLOR } from '@/constants/colors';

const goalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  color_hex: z.string().min(1, 'Cor é obrigatória').regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal'),
  initial_balance: z.string().refine((val) => {
    const amount = parseFloat(val.replace(',', '.'));
    return !isNaN(amount) && amount >= 0;
  }, 'Saldo inicial deve ser um número válido'),
  goal_amount: z.string().refine((val) => {
    const amount = parseFloat(val.replace(',', '.'));
    return !isNaN(amount) && amount > 0;
  }, 'Valor da meta deve ser maior que zero'),
  target_at: z.string().min(1, 'Data da meta é obrigatória').refine((val) => {
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(val)) return false;
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(date.getTime()) && date >= today;
  }, 'Data da meta deve ser hoje ou uma data futura'),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateGoalRequest) => Promise<void>;
  goal?: Goal | null;
  mode: 'create' | 'edit';
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
    name: '',
    description: '',
    color_hex: DEFAULT_COLOR,
    initial_balance: '0',
    goal_amount: '',
    target_at: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof GoalFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && goal) {
      setFormData({
        name: goal.name,
        description: goal.description || '',
        color_hex: goal.color_hex,
        initial_balance: goal.initial_balance.toString(),
        goal_amount: goal.goal_amount.toString(),
        target_at: goal.target_at,
      });
    } else {
      // Set tomorrow as default target date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      setFormData({
        name: '',
        description: '',
        color_hex: DEFAULT_COLOR,
        initial_balance: '0',
        goal_amount: '',
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
        initial_balance: parseFloat(formData.initial_balance.replace(',', '.')).toString(),
        goal_amount: parseFloat(formData.goal_amount.replace(',', '.')).toString(),
        target_at: formData.target_at,
      };

      await onSave(saveData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numbers = value.replace(/[^\d,\.]/g, '');
    
    // Handle decimal separator
    if (numbers.includes(',')) {
      const parts = numbers.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        return numbers;
      }
    }
    
    return numbers;
  };

  const formatDateInput = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Apply DD/MM/YYYY mask
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return numbers.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    } else {
      return numbers.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    }
  };

  const convertToISO = (dateString: string): string => {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  };

  const convertFromISO = (isoString: string): string => {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const parts = isoString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return isoString;
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
        title={mode === 'create' ? 'Criar' : 'Salvar'}
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
      title={mode === 'edit' ? 'Editar Meta' : 'Nova Meta'}
      footer={footer}
    >
      <FormField
          label="Nome da Meta"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Viagem de férias"
        />
        {errors.name && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.name}</Text>}
        
        <FormField
          label="Descrição (opcional)"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Descrição da sua meta..."
          multiline
          numberOfLines={3}
        />
        {errors.description && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.description}</Text>}
        
        <FormField
          label="Saldo Inicial"
          value={formData.initial_balance}
          onChangeText={(text) => {
            const formatted = formatCurrencyInput(text);
            setFormData(prev => ({ ...prev, initial_balance: formatted }));
          }}
          placeholder="0,00"
          keyboardType="numeric"
        />
        {errors.initial_balance && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.initial_balance}</Text>}

        <FormField
          label="Valor da Meta"
          value={formData.goal_amount}
          onChangeText={(text) => {
            const formatted = formatCurrencyInput(text);
            setFormData(prev => ({ ...prev, goal_amount: formatted }));
          }}
          placeholder="0,00"
          keyboardType="numeric"
        />
        {errors.goal_amount && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.goal_amount}</Text>}

        <FormField
          label="Data da Meta"
          value={convertFromISO(formData.target_at)}
          onChangeText={(text) => {
            const formatted = formatDateInput(text);
            const iso = convertToISO(formatted);
            setFormData(prev => ({ ...prev, target_at: iso }));
          }}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
        />

        <ColorSelector
          label="Cor da Meta"
          selectedColor={formData.color_hex}
          onColorSelect={(color) => setFormData(prev => ({ ...prev, color_hex: color }))}
          error={errors.color_hex}
        />
        {errors.target_at && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.target_at}</Text>}
    </ModalContainer>
  );
};
