import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";

// Previne que a splash screen seja ocultada automaticamente
SplashScreen.preventAutoHideAsync();

// Componente interno que usa o contexto de autenticação
function AppContent() {
  const { isLoading, isNavigationReady } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [layoutMounted, setLayoutMounted] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aguarda tanto o carregamento da auth quanto a navegação estar pronta
        if (!isLoading && isNavigationReady && layoutMounted) {
          // Pequeno delay adicional para garantir estabilidade
          setTimeout(() => {
            setAppIsReady(true);
          }, 150);
        }
      } catch (e) {
        console.warn("Erro durante a preparação da app:", e);
        // Mesmo em caso de erro, marca como pronta para não travar na splash
        setAppIsReady(true);
      }
    }

    prepare();
  }, [isLoading, isNavigationReady, layoutMounted]);

  const onLayoutRootView = useCallback(async () => {
    // Marca que o layout foi montado
    setLayoutMounted(true);

    if (appIsReady) {
      // Remove a splash screen quando tudo estiver pronto
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Oculta splash screen quando app estiver pronta
  useEffect(() => {
    if (appIsReady && layoutMounted) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, layoutMounted]);

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <Slot />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
