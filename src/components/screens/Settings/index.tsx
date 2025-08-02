import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { SettingsItem } from "@/components/molecules/SettingsItem";
import { ThemeDropdown } from "@/components/atoms/ThemeDropdown";
import { createSettingsScreenStyles } from "./styles";

export const SettingsScreen = () => {
  const { colors } = useTheme();
  const styles = createSettingsScreenStyles(colors);

  const navigateToNotifications = () => {
    //router.push('/settings/notifications');
  };

  const navigateToHelp = () => {
    router.push("/settings/help");
  };

  const navigateToAbout = () => {
    router.push("/settings/about");
  };

  const navigateToExport = () => {
    // modal to export data
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 88 }}
    >
      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Aparência
        </Text>
        <SettingsItem
          title="Tema"
          subtitle="Escolha entre claro, escuro ou sistema"
          icon="color-palette-outline"
          showChevron={false}
        >
          <ThemeDropdown />
        </SettingsItem>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Preferências
        </Text>
        <SettingsItem
          title="Notificações"
          subtitle="Gerencie suas notificações"
          icon="notifications-outline"
          disabled
          onPress={navigateToNotifications}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Dados
        </Text>
        <SettingsItem
          title="Exportar dados"
          subtitle="Baixe uma cópia dos seus dados"
          icon="download-outline"
          disabled
          onPress={navigateToExport}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Suporte
        </Text>
        <SettingsItem
          title="Ajuda e suporte"
          subtitle="Encontre respostas para suas dúvidas"
          icon="help-circle-outline"
          onPress={navigateToHelp}
        />
        <SettingsItem
          title="Sobre o app"
          subtitle="Versão e informações do aplicativo"
          icon="information-circle-outline"
          onPress={navigateToAbout}
        />
      </View>
    </ScrollView>
  );
};
