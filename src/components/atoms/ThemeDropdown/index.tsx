import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../../../contexts/ThemeContext';
import { createThemeDropdownStyles } from './styles';

interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Claro', icon: 'sunny' },
  { value: 'dark', label: 'Escuro', icon: 'moon' },
  { value: 'system', label: 'Sistema', icon: 'phone-portrait' },
];

export const ThemeDropdown = () => {
  const { themeMode, setThemeMode, colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const styles = createThemeDropdownStyles(colors);

  const selectedOption = themeOptions.find(option => option.value === themeMode);

  const handleSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: ThemeOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === themeMode && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={item.value === themeMode ? '#fff' : colors.text} 
      />
      <Text style={[
        styles.optionText,
        item.value === themeMode && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {item.value === themeMode && (
        <Ionicons name="checkmark" size={20} color="#fff" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.selectedValue}>
          <Ionicons 
            name={selectedOption?.icon as any} 
            size={18} 
            color={colors.text} 
          />
          <Text style={styles.selectedText}>
            {selectedOption?.label}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher Tema</Text>
            </View>
            <FlatList
              data={themeOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderOption}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
