import React, { useState } from 'react';
import { View, Image, Pressable, TextInput, TouchableHighlight, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
// import { IconButton } from "@react-native-material/core";
import { IconButton, MD3Colors } from 'react-native-paper';
import { getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig.js';

// const app = initializeApp(firebaseConfig);



const ChatScreen = () => {
   const [message, setMessage] = useState('');
   const [textInputHeight, setTextInputHeight] = useState(40);
   const blacksend = require('../assets/smallicons/blacksend.png');
   const greensend = require('../assets/smallicons/greensend.png');
   const [sendicon, setSendicon] = useState(blacksend);
   const [visibleSend, setVisibleSend] = useState(false);
   const isIOS = Platform.OS === 'ios';

   const handleTextChange = (text) => {
      setMessage(text);
      if (text.length > 0) {
         console.log("CHANGED")
         setSendicon(greensend);
         setVisibleSend(true);
      }
      else {
         setSendicon(blacksend);
         setVisibleSend(false);
      }

      if (text.length > 500) {
         alert("Please limit your input to 500 characters.")
      }
   };

   const handleSend = () => {
      // Handle sending the message here

      if (message.length == 0) return;

      console.log('Sending message:', message);
      setMessage('');
      setSendicon(blacksend);
      setVisibleSend(false);

      /* TODO:
      - handleSend doesn't even work. forget the firebase stuff. get handlsend to trigger correctly
      - then do the firebase stuff
      
      */

      return;
      const db = getDatabase();
      set(ref(db, 'users/' + 'test'), {
         role: 'user',
         content: message,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
      });

      // const db = getDatabase();
      // db.ref('test')
      //    .once('value')
      //    .then((snapshot) => {
      //       const value = snapshot.val();
      //       console.log(value);
      //    })
      //    .catch((error) => {
      //       console.log('Error reading data:', error);
      //    });
   };

   const handleContentSizeChange = (event) => {
      const { contentSize } = event.nativeEvent;
      console.log('contentSize', contentSize)
      setTextInputHeight(contentSize.height);
   };
   // const getSendIcon = (){
   // return this.state.sendicon;
   // }

   // const enabled = ;
   // let button;
   // if (this.state.visibleSend) {
   //    button = <IconButton
   //       icon={greensend} size={20}
   //       onPress={() => console.log('Pressed')}
   //    />
   // } else {
   //    button = <IconButton
   //       icon={blacksend} size={20}
   //       onPress={() => console.log('Pressed')}
   //    />
   // }

   return (
      <View style={{ flex: 1 }} >
         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Previous chat messages go here */}
         </ScrollView>
         <View style={{
            flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#888',
            paddingTop: 10,
            width: '100%', justifyContent: 'center', // Center the second View horizontally
         }}>
            <View style={{
               backgroundColor: '#4a4c59', flexDirection: 'row', alignItems: 'center',
               width: '90%', borderRadius: 10, alignContent: 'center',
               marginBottom: !isIOS ? 8 : 0,
            }}>
               <TextInput
                  multiline={true}
                  value={message}
                  onChangeText={handleTextChange}
                  onContentSizeChange={handleContentSizeChange}
                  placeholder="Send a message."
                  placeholderTextColor={'#ccc'}
                  maxLength={500}
                  style={{
                     flex: 1,
                     height: Math.min(130, Math.max(40, textInputHeight)),
                     color: 'white',
                     padding: 10,
                     paddingLeft: 14,
                     // paddingVertical: 0,
                     // textAlignVertical: 'center',
                  }}
               />

               {/* <TouchableHighlight onPress={handleSend()} style={{ backgroundColor: 'red' }}>
                  <Image source={sendicon}
                     // <Image source={require('../assets/smallicons/blacksend.png')}
                     style={{ width: 20, height: 20, marginRight: 10 }}
                  />
               </TouchableHighlight> */}
               {/* {button} */}

               <IconButton
                  icon={sendicon} size={20}
                  onPress={() => console.log('Pressed')}
               />

               {/* <TouchableOpacity style={{ padding: 10 }} onPress={handleSend}>
                    <Text style={{ color: 'black' }}>Send</Text>
                </TouchableOpacity> */}
            </View>
         </View>
      </View>
   );
};

export default ChatScreen;
