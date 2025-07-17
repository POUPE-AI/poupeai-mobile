import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const containerMargin = 8;

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: width - (containerMargin * 2),
    margin: containerMargin,
    
    overflow: 'hidden',

    flexDirection: 'row',
    backgroundColor: colors.theme[theme].surface,
    borderRadius: 16,
    paddingHorizontal: 8,
    height: 60,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  tabContentActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },

  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
});