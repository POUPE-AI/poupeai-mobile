import { SafeAreaView, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { DrawerHeaderProps } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/theme"
import HeaderLogo from "../../../../assets/header-logo.svg"

export const Header = (props: DrawerHeaderProps) => {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                <Ionicons name="menu" size={32} color={colors.theme['dark'].text} />
            </TouchableOpacity>

            <HeaderLogo width={144} height={36} />

            <View style={{width: 32}} />
        </SafeAreaView>
    )
}