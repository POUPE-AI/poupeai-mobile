import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export default function IndexRedirect() {
  const { colors: colorsScheme } = useTheme();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/(drawer)/(tabs)/");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colorsScheme.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}
