import { colors } from "@/constants/theme";
import { StyleSheet, StatusBar } from "react-native";

const HEADER_HEIGHT =  96 - (StatusBar.currentHeight || 60);

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary[500],
        height: HEADER_HEIGHT,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});