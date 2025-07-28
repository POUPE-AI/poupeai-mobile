import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/atoms/Button';
import ColorPicker, { Panel1, HueSlider } from 'reanimated-color-picker';
import { styles } from './styles';
import { ModalContainer } from '@/components/atoms/ModalContainer';

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
  
  const [previewColor, setPreviewColor] = useState(currentColor);

  useEffect(() => {
    if (visible) setPreviewColor(currentColor);
  }, [visible, currentColor]);

  // Função worklet para atualizar cor
  const handleChange = useCallback((color: any) => {
    'worklet';
    runOnJS(setPreviewColor)(color.hex);
  }, []);

  const handleConfirm = () => {
    onColorSelect(previewColor);
    onClose();
  };

  const handleCancel = () => {
    setPreviewColor(currentColor);
    onClose();
  };

  return (
    <ModalContainer 
      visible={visible} 
      onClose={handleCancel}
      title="Escolher Cor"
      footer={
        <>
          <Button
            title="Cancelar"
            onPress={handleCancel}
            variant="outline"
            style={style.cancelButton}
          />
          <Button
            title="Confirmar"
            onPress={handleConfirm}
            style={style.confirmButton}
          />
        </>
      }
    >
      <View style={style.previewContainer}>
        <View style={[style.colorPreview, { backgroundColor: previewColor }]} />
      </View>
      <View style={style.pickerContainer}>
        <ColorPicker 
          style={style.colorPicker} 
          value={previewColor} 
          onChange={handleChange}
        >
          <Panel1 style={style.panel} />
          <HueSlider style={style.hueSlider} />
        </ColorPicker>
      </View>
    </ModalContainer>
  );
};
