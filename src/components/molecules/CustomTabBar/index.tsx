import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { styles } from './styles';
import { TABS } from '@/constants/tabs';
import { AddButtonMenu } from '@/components/atoms/AddButtonMenu';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { theme } = useTheme();
  const style = styles(theme);
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
        router.navigate(route.name);
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
        style={style.tab}
      >
        <View style={[
          style.tabContent,
          isFocused && style.tabContentActive
        ]}>
          <Ionicons
            name={tabConfig.icon as any}
            size={20}
            color={isFocused ? colors.primary[500] : colors.theme[theme].textSecondary}
          />
          <Text style={[
            style.tabLabel,
            { color: isFocused ? colors.primary[500] : colors.theme[theme].textSecondary }
          ]}>
            {tabConfig.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={style.container}>
      {state.routes.slice(0, middleIndex).map((route: any, index: number) => renderTab(route, index))}

      <View style={style.addButtonContainer}>
        <AddButtonMenu
          onNewTransaction={() => { /* lógica para nova transação */ }}
          onNewGoal={() => { /* lógica para nova meta */ }}
          onNewBudget={() => { /* lógica para novo orçamento */ }}
        />
      </View>

      {state.routes.slice(middleIndex).map((route: any, index: number) => renderTab(route, index + middleIndex))}
    </View>
  );
}