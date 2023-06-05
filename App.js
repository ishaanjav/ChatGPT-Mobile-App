import { StyleSheet, Text, Button, View, SafeAreaView } from 'react-native';
import ChatScreen from './components/ChatBox';


export default function App() {
  console.log("App executed")
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#353640',
  },
});
