import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { getDatabase } from "firebase/database";

const database = getDatabase();

const ChatScreen = () => {
   const [message, setMessage] = useState('');
   const [textInputHeight, setTextInputHeight] = useState(40);
   const blacksend = require('../assets/smallicons/blacksend.png');
   const greensend = require('../assets/smallicons/greensend.png');
   const [sendicon, setSendicon] = useState(blacksend);
   const isIOS = Platform.OS === 'ios';

   const handleTextChange = (text) => {
      setMessage(text);
      if (text.length > 0) {
         setSendicon(greensend);
      }
      else {
         setSendicon(blacksend);
      }

      if (text.length > 500) {
         alert("Please limit your input to 500 characters.")
      }
   };

   const handleSend = () => {
      // Handle sending the message here
      console.log('Sending message:', message);
      setMessage('');
   };

   const handleContentSizeChange = (event) => {
      const { contentSize } = event.nativeEvent;
      console.log('contentSize', contentSize)
      setTextInputHeight(contentSize.height);
   };
   // const getSendIcon = (){
   // return this.state.sendicon;
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
                  placeholderTextColor={'#fff'}
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
               <Image source={sendicon}
                  // <Image source={require('../assets/smallicons/blacksend.png')}
                  style={{ width: 20, height: 20, marginRight: 10 }} />

               {/* <TouchableOpacity style={{ padding: 10 }} onPress={handleSend}>
                    <Text style={{ color: 'black' }}>Send</Text>
                </TouchableOpacity> */}
            </View>
         </View>
      </View>
   );
};

export default ChatScreen;
