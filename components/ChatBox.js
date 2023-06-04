import React, { Component } from 'react';
import { View, ScrollView, TextInput, TouchableHighlight, Image, TouchableOpacity } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';
import { getDatabase, ref, push, set, get, update, serverTimestamp, } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebaseConfig.js';
// const Navigation = require('react-native-navigation');
import Header from './Header.js';

const blacksend = require('../assets/smallicons/greensend.png');
const greensend = require('../assets/smallicons/greensend.png');
const isIOS = Platform.OS === 'ios';

//TODO: Change
var user = 'bob';
var chatID = '343d';

class ChatScreen extends Component {
   constructor(props) {
      super(props);
      this.state = {
         message: '',
         textInputHeight: 40,
         sendicon: greensend,
         visibleSend: false,
      };
   }

   handleTextChange = (text) => {
      this.setState({ message: text });

      if (text.length > 0) {
         this.setState({ sendicon: greensend, visibleSend: true });
      } else {
         this.setState({ sendicon: blacksend, visibleSend: false });
      }

      if (text.length > 500) {
         alert('Please limit your input to 500 characters.');
      }
   };

   handleSend = () => {
      const { message } = this.state;
      if (message.length === 0) return;

      console.log('Sending message:', message);
      var originalMessage = message;
      this.setState({ message: '', sendicon: blacksend, visibleSend: false });

      /* TODO:
        - handleSend doesn't even work. forget the firebase stuff. get handlsend to trigger correctly
        - then do the firebase stuff
      */
      // const app = initializeApp(firebaseConfig);
      const db = getDatabase();
      const stamp = serverTimestamp();
      // const messageName = db.ServerValue.TIMESTAMP + '_u';
      push(ref(db, 'chats/' + user + '/' + chatID + '/'), {
         role: 'user',
         content: originalMessage,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         timestamp: stamp,
      });
      // update(ref(db, 'chats/' + user + '/' + chatID + '/' + messageName), {
      //    role: 'user',
      //    content: originalMessage,
      //    date: new Date().toLocaleDateString(),
      //    time: new Date().toLocaleTimeString(),
      //    timestamp: stamp,
      // });

      this.queryOpenAI(originalMessage, db);
   };

   queryOpenAI = (message, db) => {
      // TODO: Send API request to OpenAI

      const response = {
         "choices": [
            {
               "finish_reason": "length",
               "index": 0,
               "message": {
                  "content": "As an AI language model, I do not have personal preferences. However, according to critics and audience ratings, the best DC movie ever is The Dark Knight (2008), directed by Christopher Nolan and starring Christian Bale as Batman and Heath Ledger as the",
                  "role": "assistant"
               }
            }
         ],
         "created": 1685846626,
         "id": "chatcmpl-7NY0YUjQi3vOtenpnK2eT8oYFkOMg",
         "model": "gpt-3.5-turbo-0301",
         "object": "chat.completion",
         "usage": {
            "completion_tokens": 50,
            "prompt_tokens": 16,
            "total_tokens": 66
         }
      }
      const text = response.choices[0].message.content;
      const role = 'bot';
      const tokens = response.usage;
      const stamp = serverTimestamp();
      // const messageName = stamp.toSTring + '_b';

      push(ref(db, 'chats/' + user + '/' + chatID + '/'), {
         role: role,
         content: text,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         timestamp: stamp,
         tokens: tokens,
      });
   }


   handleContentSizeChange = (event) => {
      const { contentSize } = event.nativeEvent;
      this.setState({ textInputHeight: contentSize.height });
   };

   handleLeftButtonPress = (event) => {
      // TODO, go to home screen
      console.log("Going to home screen");
   };

   render() {
      const { message, textInputHeight, sendicon, visibleSend } = this.state;
      let button;
      if (visibleSend) {
         button = <IconButton
            icon={blacksend} size={17}
            iconColor={'white'}
            background={'white'}
            backgroundColor={'#51ad87'}
            onPress={this.handleSend}
         />
         // button = <IconButton
         //    icon={blacksend} size={17}
         //    iconColor={'#51ad87'}
         //    // background={'white'}
         //    // backgroundColor={'#51ad87'}
         //    onPress={() => console.log('Pressed')}
         // />
      } else {
         button = <IconButton
            icon={blacksend} size={17}
            iconColor={'#333'}
            onPress={this.handleSend}
         />
      }

      // TODO: Change title to name of chat
      // FEATURE: user swipes left on header. or swipes right. goes to next chat.
      return (
         <View style={{ flex: 1 }}>
            <Header title="Name of Chat" onPress={this.handleLeftButtonPress} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{/* Previous chat messages go here */}</ScrollView>
            <View
               style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#888',
                  paddingTop: 10,
                  width: '100%',
                  justifyContent: 'center',
               }}
            >
               <View
                  style={{
                     backgroundColor: '#4a4c59',
                     flexDirection: 'row',
                     alignItems: 'center',
                     width: '90%',
                     borderRadius: 10,
                     alignContent: 'center',
                     marginBottom: !isIOS ? 8 : 20,
                  }}
               >
                  <TextInput
                     multiline={true}
                     value={message}
                     onChangeText={this.handleTextChange}
                     onContentSizeChange={this.handleContentSizeChange}
                     placeholder="Send a message."
                     placeholderTextColor={'#aaa'}
                     maxLength={500}
                     style={{
                        flex: 1,
                        height: Math.min(130, Math.max(40, textInputHeight)),
                        color: 'white',
                        padding: 10,
                        paddingLeft: 14,
                     }}
                  />

                  {/* <IconButton icon={sendicon} size={20} onPress={() => console.log('Pressed')} /> */}
                  {button}

                  {/* <TouchableHighlight onPress={this.handleSend} style={{ backgroundColor: 'red' }}>
                  <Image source={sendicon} style={{ width: 20, height: 20, marginRight: 10 }} />
                </TouchableHighlight> */}

                  {/* <TouchableOpacity style={{ padding: 10 }} onPress={this.handleSend}>
                  <Text style={{ color: 'black' }}>Send</Text>
                </TouchableOpacity> */}
               </View>
            </View>
         </View>
      );
   }
}

export default ChatScreen;
