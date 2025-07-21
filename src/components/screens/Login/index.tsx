import React from "react";
import { Alert, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { LoginHeader } from "@/components/molecules/LoginHeader";
import { LoginSection } from "@/components/molecules/LoginSection";
import { styles } from "./styles";
import { useTheme } from "@/contexts/ThemeContext";

export function Login() {
  const { signIn, isLoading } = useAuth();
  const { theme } = useTheme();
  const style = styles(theme);

  const handleLogin = async () => {
    const success = await signIn();
    if (!success) {
      Alert.alert(
        "Erro na autenticação",
        "Não foi possível realizar o login. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={style.container}>
      <LoginHeader
        subtitle="Gerencie suas finanças de forma inteligente"
      />

      <LoginSection
        onLogin={handleLogin}
        isLoading={isLoading}
        instructionText="Faça login para acessar sua conta"
        buttonText="Clique aqui para entrar"
        loadingText="Conectando..."
      />
    </View>
  );
}
