import { colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.theme['light'].surface,
    },
    drawerItem: {
        marginHorizontal: -12,
        borderRadius: 0,
    },
})