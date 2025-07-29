import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { colors } from '@/constants/theme';
import { styles } from './styles';

interface DropdownItem {
  id: number;
  label: string;
  color?: string;
}

interface DropdownSelectorProps {
  items: DropdownItem[];
  selectedId?: string | number;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
  error?: boolean;
  showColorDot?: boolean;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  items,
  selectedId,
  onSelect,
  placeholder = 'Selecione uma opção',
  isOpen,
  onToggle,
  error = false,
  showColorDot = false,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const selectedItem = items.find(item => item.id === selectedId);

  return (
    <View style={[style.container, error && style.containerError]}>
      <TouchableOpacity style={style.button} onPress={onToggle}>
        {selectedItem ? (
          <>
            {showColorDot && selectedItem.color && (
              <View style={[style.colorDot, { backgroundColor: selectedItem.color }]} />
            )}
            <Text style={style.buttonText}>{selectedItem.label}</Text>
          </>
        ) : (
          <Text style={[style.buttonText, { color: colors.theme[theme].textSecondary }]}>
            {placeholder}
          </Text>
        )}
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.theme[theme].text} 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <ScrollView style={style.dropdown} nestedScrollEnabled>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                style.item,
                index === items.length - 1 && style.itemLast
              ]}
              onPress={() => onSelect(item)}
            >
              {showColorDot && item.color && (
                <View style={[style.colorDot, { backgroundColor: item.color }]} />
              )}
              <Text style={style.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
