import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View, SafeAreaView } from 'react-native';
import ChatScreen from './components/ChatBox';
import SideMenuCenterScreen from './components/SideMenuCenterScreen';
import MyDrawer from './components/Nav';
// import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         onPress={() => navigation.navigate('Notifications')}
//         title="Go to notifications"
//       />
//     </View>
//   );
// }

// function NotificationsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button onPress={() => navigation.goBack()} title="Go back home" />
//     </View>
//   );
// }

export default function App() {
  console.log("App executed")
  return (
    <View style={styles.container}>
      {/* <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={ChatScreen} />
          <Drawer.Screen name="Notifications" component={ChatScreen} />
        </Drawer.Navigator>
      </NavigationContainer> */}
      {/* <Text>hello world</Text> */}
      {/* <StatusBar style="auto" /> */}

      <ChatScreen />
      {/* <SideMenuCenterScreen /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#434654',
    backgroundColor: '#353640',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
