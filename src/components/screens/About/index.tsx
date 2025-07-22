import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { createAboutScreenStyles } from './styles';

export const AboutScreen = () => {
  const { colors } = useTheme();
  const styles = createAboutScreenStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Versão
        </Text>
        <Text variant="body" color="textSecondary" style={styles.version}>
          1.0.0
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Sobre o aplicativo
        </Text>
        <Text variant="body" color="textSecondary" style={styles.description}>
          O PoupeAI é um aplicativo de gestão financeira pessoal que utiliza inteligência artificial para ajudar você a controlar suas finanças, criar orçamentos inteligentes e alcançar seus objetivos financeiros.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Desenvolvido por
        </Text>
        <Text variant="body" color="textSecondary" style={styles.developer}>
          <View style={styles.techList}>
          <Text variant="body" color="textSecondary" style={styles.techItem}>
            • Eudivan de Melo
          </Text>
          <Text variant="body" color="textSecondary" style={styles.techItem}>
            • Erisvaldo Balbino
          </Text>
          <Text variant="body" color="textSecondary" style={styles.techItem}>
            • Francisco Paulino
          </Text>
        </View>
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Licença
        </Text>
        <Text variant="body" color="textSecondary" style={styles.license}>
          Este aplicativo é distribuído sob licença MIT. Todos os direitos reservados © 2025 PoupeAI.
        </Text>
      </View>
    </ScrollView>
  );
};
