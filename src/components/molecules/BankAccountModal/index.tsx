import React, { useState, useEffect } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Account, CreateBankAccountRequest } from '@/types';
import { z } from 'zod';
import { styles } from './styles';
import { ModalContainer } from '@/components/atoms/ModalContainer';
import { ModalHeader } from '@/components/atoms/ModalHeader';
import { FormField } from '@/components/atoms/FormField';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { colors } from '@/constants/theme';

const bankAccountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres'),
  initial_balance: z.string().refine((val) => {
    const amount = parseFloat(val.replace(',', '.'));
    return !isNaN(amount);
  }, 'Valor deve ser um número válido'),
  is_default: z.boolean(),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

interface BankAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateBankAccountRequest) => Promise<void>;
  account?: Account | null;
  mode: 'create' | 'edit';
}

export const BankAccountModal: React.FC<BankAccountModalProps> = ({
  visible,
  onClose,
  onSave,
  account,
  mode,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const [formData, setFormData] = useState<BankAccountFormData>({
    name: '',
    description: '',
    initial_balance: '0',
    is_default: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BankAccountFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && account) {
      setFormData({
        name: account.name,
        description: account.description,
        initial_balance: account.initial_balance,
        is_default: account.is_default,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        initial_balance: '0',
        is_default: false,
      });
    }
    setErrors({});
  }, [mode, account, visible]);

  const validateForm = (): boolean => {
    try {
      bankAccountSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof BankAccountFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof BankAccountFormData] = err.message;
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
      const saveData: CreateBankAccountRequest = {
        name: formData.name,
        description: formData.description,
        initial_balance: parseFloat(formData.initial_balance.replace(',', '.')),
        is_default: formData.is_default,
      };

      await onSave(saveData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conta bancária:', error);
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
    >
      <ModalHeader
        title={mode === 'edit' ? 'Editar Conta' : 'Nova Conta'}
        onClose={handleClose}
      />
      
      <ScrollView style={style.content} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <FormField
          label="Nome da Conta"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Conta Corrente BB"
        />
        {errors.name && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.name}</Text>}
        
        <FormField
          label="Descrição"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Descrição opcional da conta..."
          multiline
          numberOfLines={3}
        />
        {errors.description && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.description}</Text>}
        
        <FormField
          label="Saldo Inicial"
          value={formData.initial_balance}
          onChangeText={(text) => setFormData(prev => ({ ...prev, initial_balance: text }))}
          placeholder="0,00"
          keyboardType="numeric"
        />
        {errors.initial_balance && <Text style={{ color: colors.feedback.error, fontSize: 12, marginTop: 4 }}>{errors.initial_balance}</Text>}

        <View style={style.switchContainer}>
          <FormField label="Conta Padrão">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ color: colors.theme[theme].textSecondary, fontSize: 14 }}>
                Define esta conta como padrão para novas transações
              </Text>
              <Switch
                value={formData.is_default}
                onValueChange={(value) => setFormData(prev => ({ ...prev, is_default: value }))}
                trackColor={{ false: colors.theme[theme].border, true: colors.primary[500] }}
                thumbColor={formData.is_default ? colors.primary[600] : colors.theme[theme].surface}
              />
            </View>
          </FormField>
        </View>
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
