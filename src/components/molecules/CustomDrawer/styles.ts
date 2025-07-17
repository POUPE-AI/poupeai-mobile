import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.theme[theme].surface,
    },
    drawerItem: {
        marginHorizontal: -12,
        borderRadius: 0,
    },
    userHeader: {
        marginHorizontal: -16,
        marginTop: -40,
        marginBottom: 20,
        paddingVertical: 24,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    userInfo: {
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.theme['dark'].text,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: colors.theme['dark'].text,
        fontWeight: '400',
        opacity: 0.8,
    },
    sectionSeparator: {
        height: 1,
        backgroundColor: colors.theme[theme].border,
        marginHorizontal: 16,
        marginVertical: 8,
    },
})