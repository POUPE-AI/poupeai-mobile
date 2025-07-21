import React from 'react';
import { Alert, View } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { styles } from './styles';

interface LoginSectionProps {
  onLogin: () => Promise<void>;
  isLoading: boolean;
  instructionText: string;
  buttonText: string;
  loadingText: string;
}

export const LoginSection = ({ 
  onLogin, 
  isLoading, 
  instructionText, 
  buttonText, 
  loadingText 
}: LoginSectionProps) => {
  const handleLogin = async () => {
    try {
      await onLogin();
    } catch (error) {
      Alert.alert(
        'Erro', 
        'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="body" color="text" align="center" style={styles.instructionText}>
        {instructionText}
      </Text>
      
      <Button
        title={buttonText}
        loading={isLoading}
        loadingText={loadingText}
        onPress={handleLogin}
        size="medium"
        style={styles.button}
      />
    </View>
  );
};
