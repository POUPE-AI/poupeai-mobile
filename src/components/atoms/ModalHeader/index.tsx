import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { colors } from '@/constants/theme';
import { styles } from './styles';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  closeIcon?: keyof typeof Ionicons.glyphMap;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  closeIcon = 'chevron-down',
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.header}>
      <TouchableOpacity style={style.closeButton} onPress={onClose}>
        <Ionicons name={closeIcon} size={24} color={colors.theme[theme].text} />
      </TouchableOpacity>
      <Text style={style.title}>{title}</Text>
      <View style={style.placeholder} />
    </View>
  );
};
