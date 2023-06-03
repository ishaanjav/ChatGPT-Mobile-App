import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ChatScreen from './components/ChatBox';


export default function App() {
  console.log("App executed")
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>hello world</Text> */}
      {/* <StatusBar style="auto" /> */}

      <ChatScreen />
    </SafeAreaView>
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
