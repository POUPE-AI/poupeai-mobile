import { CustomDrawer } from '@/components/molecules/CustomDrawer'
import { Drawer } from 'expo-router/drawer'
import { Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <Drawer
                drawerContent={(props) => <CustomDrawer {...props} />}
                
                screenOptions={{
                    header: (props) => <View><Text>teste</Text></View>,
                    headerShown: true,
                    swipeEnabled: true,
                    swipeEdgeWidth: 50,
                    swipeMinDistance: 10,
                }}>
                <Drawer.Screen name="(tabs)" options={{ title: 'Dashboard' }} />
            </Drawer>
        </GestureHandlerRootView>
    )
}