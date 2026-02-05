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
import { Button } from "@/components/atoms/Button";
import { styles } from "./styles";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "primary",
  icon = "alert-circle-outline",
  iconColor,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={style.overlay}>
          <TouchableWithoutFeedback>
            <View style={style.container}>
              <View style={style.iconContainer}>
                <Ionicons
                  name={icon}
                  size={48}
                  color={iconColor || style.icon.color}
                />
              </View>

              <Text style={style.title}>{title}</Text>
              <Text style={style.message}>{message}</Text>

              <View style={style.buttonsContainer}>
                <TouchableOpacity
                  style={[style.button, style.cancelButton]}
                  onPress={onCancel}
                  disabled={loading}
                >
                  <Text style={style.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    style.button,
                    confirmVariant === "danger"
                      ? style.dangerButton
                      : style.confirmButton,
                  ]}
                  onPress={onConfirm}
                  disabled={loading}
                >
                  <Text
                    style={
                      confirmVariant === "danger"
                        ? style.dangerButtonText
                        : style.confirmButtonText
                    }
                  >
                    {loading ? "Aguarde..." : confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
