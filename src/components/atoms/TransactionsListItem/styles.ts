import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: colors.theme[theme].surface,
        borderRadius: 8,
        borderLeftWidth: 6,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        elevation: 1,
    },
    leftContainer: {
        flex: 1,
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.theme[theme].text,
    },
    categoryText: {
        fontSize: 14,
        color: colors.theme[theme].textSecondary,
    },
    rightContainer:{
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText:{
        fontSize: 12,
        color: colors.theme[theme].textSecondary,
    }
});