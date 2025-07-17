import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { styles } from './styles';
import { useTheme } from '@/contexts/ThemeContext';

interface AddButtonMenuProps {
  onNewTransaction: () => void;
  onNewGoal: () => void;
  onNewBudget: () => void;
}

export const AddButtonMenu = ({ onNewTransaction, onNewGoal, onNewBudget }: AddButtonMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { theme } = useTheme();

  const openMenu = () => {
    setIsVisible(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
      setIsVisible(false);
  };

  const handleMenuOption = (callback: () => void) => {
    closeMenu();
    setTimeout(callback, 100); 
  };

  const menuItems = [
    {
      title: 'Nova Transação',
      icon: 'card-outline',
      onPress: () => handleMenuOption(onNewTransaction),
      color: colors.primary[500],
    },
    {
      title: 'Nova Meta',
      icon: 'trophy-outline',
      onPress: () => handleMenuOption(onNewGoal),
      color: '#10B981',
    },
    {
      title: 'Novo Orçamento',
      icon: 'wallet-outline',
      onPress: () => handleMenuOption(onNewBudget),
      color: '#F59E0B',
    },
  ];

  const style = styles(theme);

  return (
    <>
      <TouchableOpacity
        style={style.addButton}
        onPress={openMenu}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={style.overlay}
          onPress={closeMenu}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              style.menuContainer,
              {
                opacity: animation,
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {menuItems.map((item, index) => (
              <Animated.View
                key={item.title}
                style={[
                  style.menuItem,
                  {
                    opacity: animation,
                    transform: [
                      {
                        translateY: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[style.menuButton, { backgroundColor: item.color }]}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon as any} size={20} color="#fff" />
                  <Text style={style.menuButtonText}>{item.title}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}