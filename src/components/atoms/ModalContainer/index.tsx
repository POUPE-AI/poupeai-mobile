import React from 'react';
import { Modal, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { colors } from '@/constants/theme';
import { styles } from './styles';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeIcon?: keyof typeof Ionicons.glyphMap;
  footer?: React.ReactNode;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  onClose,
  title,
  children,
  closeIcon = 'chevron-down',
  footer,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  // If no title is provided, render in backward compatibility mode
  if (!title) {
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
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={style.container}>
        {/* Fixed Header */}
        <View style={style.header}>
          <TouchableOpacity style={style.closeButton} onPress={onClose}>
            <Ionicons name={closeIcon} size={24} color={colors.theme[theme].text} />
          </TouchableOpacity>
          <Text style={style.title}>{title}</Text>
          <View style={style.placeholder} />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={style.scrollView}
          contentContainerStyle={style.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={style.content}>
            {children}
          </View>
        </ScrollView>

        {/* Fixed Footer */}
        {footer && (
          <View style={style.footer}>
            {footer}
          </View>
        )}
      </View>
    </Modal>
  );
};
