import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { styles } from "./styles";
import { useReactivateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { MessageModal } from "@/components/molecules/MessageModal";

export const ProfileDeactivated = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  const { signOut } = useAuth();

  const [messageModal, setMessageModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const reactivateMutation = useReactivateProfile();

  const handleReactivate = async () => {
    try {
      await reactivateMutation.mutateAsync();
      setMessageModal({
        visible: true,
        title: "Perfil Reativado",
        message:
          "Seu perfil foi reativado com sucesso! Você pode continuar usando o app normalmente.",
        type: "success",
      });
    } catch (error) {
      setMessageModal({
        visible: true,
        title: "Erro",
        message: "Não foi possível reativar o perfil. Tente novamente.",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <View style={style.container}>
      <View style={style.content}>
        <View style={style.iconContainer}>
          <Ionicons name="alert-circle" size={64} color={style.icon.color} />
        </View>

        <Text style={style.title}>Perfil Desativado</Text>

        <Text style={style.message}>
          Seu perfil está temporariamente desativado. Você tem 30 dias para
          reativá-lo antes que todos os seus dados sejam permanentemente
          excluídos.
        </Text>

        <Text style={style.submessage}>
          Caso deseje continuar usando o PoupeAI, clique no botão abaixo para
          reativar seu perfil.
        </Text>

        <View style={style.buttonsContainer}>
          <TouchableOpacity
            style={style.reactivateButton}
            onPress={handleReactivate}
            disabled={reactivateMutation.isPending}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text style={style.reactivateButtonText}>
              {reactivateMutation.isPending
                ? "Reativando..."
                : "Reativar Perfil"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.logoutButton}
            onPress={handleLogout}
            disabled={reactivateMutation.isPending}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={style.logoutButtonText.color}
            />
            <Text style={style.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </View>

      <MessageModal
        visible={messageModal.visible}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        onClose={() => setMessageModal({ ...messageModal, visible: false })}
      />
    </View>
  );
};
