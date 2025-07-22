import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { createFAQItemStyles } from './styles';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { colors } = useTheme();
  const styles = createFAQItemStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text variant="subtitle" style={styles.question}>
          {question}
        </Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answer}>
          <Text variant="body" color="textSecondary" style={styles.answerText}>
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};
