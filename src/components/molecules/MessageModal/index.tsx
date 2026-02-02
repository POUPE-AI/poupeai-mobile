import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { styles } from "./styles";

interface MessageModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  buttonText?: string;
  onClose: () => void;
}

export const MessageModal = ({
  visible,
  title,
  message,
  type = "info",
  buttonText = "Ok",
  onClose,
}: MessageModalProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark-circle" as const,
          color: style.successIcon.color,
        };
      case "error":
        return {
          name: "close-circle" as const,
          color: style.errorIcon.color,
        };
      default:
        return {
          name: "information-circle" as const,
          color: style.infoIcon.color,
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={style.overlay}>
          <TouchableWithoutFeedback>
            <View style={style.container}>
              <View style={style.iconContainer}>
                <Ionicons
                  name={iconConfig.name}
                  size={56}
                  color={iconConfig.color}
                />
              </View>

              <Text style={style.title}>{title}</Text>
              <Text style={style.message}>{message}</Text>

              <TouchableOpacity
                style={[
                  style.button,
                  type === "success" && style.successButton,
                  type === "error" && style.errorButton,
                ]}
                onPress={onClose}
              >
                <Text style={style.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
