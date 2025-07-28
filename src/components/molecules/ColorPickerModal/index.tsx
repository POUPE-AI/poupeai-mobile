import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/atoms/Button';
import ColorPicker, { Panel1, HueSlider } from 'reanimated-color-picker';
import { styles } from './styles';
import { ModalContainer } from '@/components/atoms/ModalContainer';
import { ModalHeader } from '@/components/atoms/ModalHeader';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentColor: string;
  onColorSelect: (color: any) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  currentColor,
  onColorSelect,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <ModalHeader 
        title="Escolher Cor"
        onClose={onClose}
        closeIcon="close"
      />
      
      <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
        {/* Preview da cor atual */}
        <View style={style.previewContainer}>
          <View style={[style.colorPreview, { backgroundColor: currentColor }]} />
        </View>

        {/* ColorPicker simplificado */}
        <View style={style.pickerContainer}>
          <ColorPicker 
            style={style.colorPicker} 
            value={currentColor} 
            onComplete={onColorSelect}
          >
            <Panel1 style={style.panel} />
            <HueSlider style={style.hueSlider} />
          </ColorPicker>
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
          title="Confirmar"
          onPress={onClose}
          style={style.confirmButton}
        />
      </View>
    </ModalContainer>
  );
};
