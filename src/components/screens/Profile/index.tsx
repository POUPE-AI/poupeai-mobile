import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { styles } from "./styles";
import { useProfile, useDeactivateProfile } from "@/hooks/useProfile";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { MessageModal } from "@/components/molecules/MessageModal";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export const Profile = () => {
  const { theme } = useTheme();
  const style = styles(theme);
  const { signOut } = useAuth();

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
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

  const { data: profile, isLoading, error } = useProfile();
  const deactivateMutation = useDeactivateProfile();

  const handleDeactivateConfirm = async () => {
    try {
      await deactivateMutation.mutateAsync();
      setShowDeactivateModal(false);
      setMessageModal({
        visible: true,
        title: "Perfil Desativado",
        message:
          "Seu perfil foi desativado. Você tem 30 dias para reativá-lo antes da exclusão permanente.",
        type: "success",
      });
    } catch (error) {
      setMessageModal({
        visible: true,
        title: "Erro",
        message: "Não foi possível desativar o perfil. Tente novamente.",
        type: "error",
      });
    }
  };

  const handleMessageModalClose = () => {
    setMessageModal({ ...messageModal, visible: false });

    if (messageModal.type === "success") {
      router.replace("/profile-deactivated");
    }
  };

  const handleLogout = () => {
    signOut();
  };

  if (isLoading) {
    return <LoadingContent text="perfil" />;
  }

  if (error) {
    return <ErrorContent text="Erro ao carregar perfil" />;
  }

  if (!profile) {
    return <ErrorContent text="Perfil não encontrado" />;
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.section}>
          <Text style={style.sectionTitle}>Informações Pessoais</Text>

          <View style={style.infoCard}>
            <View style={style.infoItem}>
              <Text style={style.infoLabel}>Nome</Text>
              <Text style={style.infoValue}>{profile.firstName}</Text>
            </View>

            <View style={style.divider} />

            <View style={style.infoItem}>
              <Text style={style.infoLabel}>Sobrenome</Text>
              <Text style={style.infoValue}>{profile.lastName}</Text>
            </View>

            <View style={style.divider} />

            <View style={style.infoItem}>
              <Text style={style.infoLabel}>Email</Text>
              <Text style={style.infoValue}>{profile.email}</Text>
            </View>
          </View>
        </View>

        <View style={style.actionsSection}>
          <TouchableOpacity
            style={style.deactivateButton}
            onPress={() => setShowDeactivateModal(true)}
            disabled={deactivateMutation.isPending}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={style.deactivateButtonText.color}
            />
            <Text style={style.deactivateButtonText}>
              {deactivateMutation.isPending
                ? "Desativando..."
                : "Desativar Perfil"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={style.logoutButtonText.color}
            />
            <Text style={style.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showDeactivateModal}
        title="Desativar Perfil"
        message="Seu perfil será desativado e você terá 30 dias para reativar. Após esse período, todos os dados serão permanentemente excluídos. Deseja continuar?"
        confirmText="Desativar"
        cancelText="Cancelar"
        confirmVariant="danger"
        icon="warning-outline"
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setShowDeactivateModal(false)}
        loading={deactivateMutation.isPending}
      />

      <MessageModal
        visible={messageModal.visible}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        onClose={handleMessageModalClose}
      />
    </>
  );
};
