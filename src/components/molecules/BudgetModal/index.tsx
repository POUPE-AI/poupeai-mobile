import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { useCategories } from '@/hooks/useCategories';
import { Budget, CreateBudgetRequest } from '@/types';
import { z } from 'zod';
import { styles } from './styles';
import { ModalContainer } from '@/components/atoms/ModalContainer';
import { ModalHeader } from '@/components/atoms/ModalHeader';
import { FormField } from '@/components/atoms/FormField';
import { CategoryDropdown } from '@/components/molecules/CategoryDropdown';

const budgetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  category: z.number().min(1, 'Categoria é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => {
    const amount = parseFloat(val.replace(',', '.'));
    return !isNaN(amount) && amount > 0;
  }, 'Valor deve ser um número positivo'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateBudgetRequest) => Promise<void>;
  budget?: Budget | null;
  mode: 'create' | 'edit';
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
  
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = useMemo(() => 
    (categoriesData?.results || []).filter(cat => cat.type === 'expense'), 
    [categoriesData?.results]
  );

  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    category: 0,
    amount: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BudgetFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && budget) {
      setFormData({
        name: budget.name,
        category: budget.category,
        amount: budget.amount,
      });
    } else {
      setFormData({
        name: '',
        category: categories.length > 0 ? parseInt(categories[0].id) : 0,
        amount: '',
      });
    }
    setErrors({});
    setShowCategoryDropdown(false);
  }, [mode, budget, visible, categories.length]);

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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Converter BudgetFormData validado para CreateBudgetRequest
      const dataToSave: CreateBudgetRequest = {
        name: formData.name,
        category: formData.category,
        amount: formData.amount.replace(',', '.'), // Garantir formato correto
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = useCallback((value: string) => {
    let formatted = value.replace(/[^\d,.-]/g, '');
    formatted = formatted.replace('.', ',');
    return formatted;
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    const formatted = formatAmount(text);
    setFormData(prev => ({ ...prev, amount: formatted }));
  }, [formatAmount]);

  const getSelectedCategory = useCallback(() => {
    return categories.find(cat => parseInt(cat.id) === formData.category);
  }, [categories, formData.category]);

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <ModalHeader 
        title={mode === 'create' ? 'Novo Orçamento' : 'Editar Orçamento'}
        onClose={onClose}
      />

      <ScrollView style={style.content} contentContainerStyle={{paddingBottom: 16}} showsVerticalScrollIndicator={false}>
        <FormField
          label="Nome do Orçamento"
          placeholder="Ex: Orçamento Alimentação"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          maxLength={100}
          error={errors.name}
        />

        <CategoryDropdown
          categories={categories}
          selectedCategoryId={formData.category}
          onSelect={(categoryId) => setFormData(prev => ({ ...prev, category: categoryId }))}
          error={errors.category}
          isLoading={categoriesLoading}
          isOpen={showCategoryDropdown}
          onToggle={() => setShowCategoryDropdown(!showCategoryDropdown)}
          filterType="expense"
          onCreateCategory={onCreateCategory}
        />

        <FormField
          label="Valor Limite (R$)"
          placeholder="0,00"
          value={formData.amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          error={errors.amount}
        />
      </ScrollView>

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
  );
};
