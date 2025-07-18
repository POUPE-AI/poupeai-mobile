import { colors } from "@/constants/theme";
import { View } from "react-native";

export default function Screen() {
    return (
        <View style={{ flex: 1, backgroundColor: colors.theme['dark'].background }} />
    )
}