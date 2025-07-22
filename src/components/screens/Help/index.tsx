import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/atoms/Text';
import { FAQItem } from '@/components/molecules/FAQItem';
import { createHelpScreenStyles } from './styles';

export const HelpScreen = () => {
  const { colors } = useTheme();
  const styles = createHelpScreenStyles(colors);

  const faqData = [
    {
      question: "Como adiciono uma nova transação?",
      answer: "Para adicionar uma nova transação, vá até a tela principal e toque no botão '+' no canto inferior direito. Preencha os dados da transação como valor, categoria e descrição."
    },
    {
      question: "Como categorizo minhas transações?",
      answer: "Ao criar uma transação, você pode selecionar uma categoria existente ou criar uma nova. As categorias ajudam a organizar e analisar seus gastos."
    },
    {
      question: "Como funciona o sistema de orçamentos?",
      answer: "Na aba 'Orçamentos', você pode definir limites de gastos por categoria e período. O app mostrará alertas quando você estiver próximo do limite."
    },
    {
      question: "Posso definir metas financeiras?",
      answer: "Sim! Na aba 'Metas' você pode criar objetivos financeiros como poupar para uma viagem ou emergência. O app acompanhará seu progresso."
    },
    {
      question: "Como exporto meus dados?",
      answer: "Vá em Configurações > Exportar dados. Você pode baixar um arquivo com todas suas informações financeiras para backup ou análise externa."
    },
    {
      question: "O app funciona offline?",
      answer: "Sim, todas as funcionalidades básicas funcionam offline. Os dados são sincronizados quando você tem conexão com a internet."
    },
    {
      question: "Como altero o tema do aplicativo?",
      answer: "Nas Configurações, você encontra a opção 'Tema' onde pode escolher entre claro, escuro ou seguir o sistema."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim, utilizamos criptografia de ponta a ponta e autenticação segura via Keycloak. Seus dados financeiros são protegidos seguindo as melhores práticas de segurança."
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text variant="body" color="textSecondary" style={styles.subtitle}>
          Encontre respostas para as dúvidas mais comuns
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Perguntas Frequentes
        </Text>
        
        <View style={styles.faqContainer}>
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Precisa de mais ajuda?
        </Text>
        
        <View style={styles.contactCard}>
          <Ionicons name="mail-outline" size={24} color={colors.textSecondary} />
          <View style={styles.contactInfo}>
            <Text variant="subtitle">
              Entre em contato
            </Text>
            <Text variant="body" color="textSecondary">
              suporte@poupeai.com
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
