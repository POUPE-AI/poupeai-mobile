import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { styles } from "./styles";
import WebView from "react-native-webview";

interface ReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  attachmentUrl: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  visible,
  onClose,
  attachmentUrl,
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
        {/* Header */}
        <View style={style.header}>
          <TouchableOpacity style={style.closeButton} onPress={onClose}>
            <Ionicons
              name="chevron-down"
              size={24}
              color={colors.theme[theme].text}
            />
          </TouchableOpacity>
          <Text style={style.title}>Comprovante</Text>
          <View style={style.placeholder} />
        </View>

        {/* WebView precisa estar fora do ScrollView */}
        <View style={style.webviewContainer}>
          <WebView
            source={{ uri: attachmentUrl }}
            style={style.webview}
            startInLoadingState={true}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </View>
    </Modal>
  );
};
