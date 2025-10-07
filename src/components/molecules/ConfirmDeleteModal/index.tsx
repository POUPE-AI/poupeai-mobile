import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { styles } from './styles';

interface ConfirmDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  itemName?: string;
  loading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // O erro será tratado pelo componente pai
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={style.overlay}>
        <View style={style.container}>
          <View style={style.header}>
            <Ionicons name="warning" size={24} color="#ff660f" />
            <Text style={style.title}>{title}</Text>
          </View>

          <View style={style.content}>
            <Text style={style.message}>{message}</Text>
            {itemName && (
              <Text style={style.itemName}>"{itemName}"</Text>
            )}
          </View>

          <View style={style.footer}>
            <Button
              title="Cancelar"
              onPress={onClose}
              variant="outline"
              style={style.cancelButton}
              disabled={loading}
            />
            <Button
              title="Excluir"
              onPress={handleConfirm}
              loading={loading}
              style={style.deleteButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
