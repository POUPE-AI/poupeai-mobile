import React from 'react';
import { Modal, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { styles } from './styles';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  onClose,
  children,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={style.container}>
        {children}
      </View>
    </Modal>
  );
};
