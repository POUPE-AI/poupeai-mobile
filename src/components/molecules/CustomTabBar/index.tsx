import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { styles } from './styles';
import { TABS } from '@/constants/tabs';
import { AddButtonMenu } from '@/components/atoms/AddButtonMenu';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const middleIndex = Math.floor(TABS.length / 2);

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    
    const tabConfig = TABS.find(tab => tab.name === route.name);
    if (!tabConfig) return null;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <TouchableOpacity
        key={route.name}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tab}
      >
        <View style={[
          styles.tabContent,
          isFocused && styles.tabContentActive
        ]}>
          <Ionicons
            name={tabConfig.icon as any}
            size={20}
            color={isFocused ? colors.primary[500] : colors.theme.light.textSecondary}
          />
          <Text style={[
            styles.tabLabel,
            { color: isFocused ? colors.primary[500] : colors.theme.light.textSecondary }
          ]}>
            {tabConfig.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Renderizar as primeiras tabs */}
      {state.routes.slice(0, middleIndex).map((route: any, index: number) => renderTab(route, index))}

      {/* Botão + no meio */}
      <View style={styles.addButtonContainer}>
        <AddButtonMenu
          onNewTransaction={() => { /* lógica para nova transação */ }}
          onNewGoal={() => { /* lógica para nova meta */ }}
          onNewBudget={() => { /* lógica para novo orçamento */ }}
        />
      </View>

      {/* Renderizar as últimas tabs com o índice correto */}
      {state.routes.slice(middleIndex).map((route: any, index: number) => renderTab(route, index + middleIndex))}
    </View>
  );
}