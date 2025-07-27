import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ReactQueryProvider>
          <AuthProvider>
            <StatusBar style="light" />
            <Slot />
          </AuthProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
