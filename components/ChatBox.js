import React, { Component } from 'react';
import { View, Keyboard, ScrollView, TextInput, KeyboardAvoidingView, Text, Alert, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { getDatabase, ref, push, set, remove, get, serverTimestamp } from 'firebase/database';
import Header from './Header.js';
import Row from './Row.js';
import API_KEY from '../OpenAI_API_KEY.js';
import * as FileSystem from 'expo-file-system';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebaseConfig.js';

const blacksend = require('../assets/smallicons/greensend.png');
const greensend = require('../assets/smallicons/greensend.png');
const isIOS = Platform.OS === 'ios';

// variables to keep track of chat user, chat id, etc.
var user = 'bob';
var idx = 0;
var numChats = 0;
var lastUsed = 0;
var chats = []
var chatID = 1;

class ChatScreen extends Component {
   constructor(props) {
      super(props);
      this.scrollViewRef = React.createRef();
      this.state = {
         message: '', //  message that user is typing
         textInputHeight: 40,
         sendicon: greensend,
         visibleSend: false, // whether or not to show the send button
         items: [], // array of messages
         chatTitle: 'Chat #' + chatID, // chat title
         iosKeyboardMargin: 20,
         // chatID: 1,
      };
   }

   // load the chat history for a particular user and chatID.
   loadChatHistory(dbRef) {
      get(dbRef)
         .then((snapshot) => {
            snapshot.forEach((child) => {
               this.state.items.push(child.val())
            })
         }).finally(() => {
            this.setState({ items: this.state.items })
         })
         .catch((error) => {
            console.error(error);
         });
   }

   // read the user ID from the file system. If it doesn't exist, generate a random one.
   //  this userId is used to store the chat histories for that user
   async readUser() {
      const filePath = FileSystem.documentDirectory + 'user.txt';
      // // commented: console.log(filePath)
      // Delete the file
      // FileSystem.deleteAsync(filePath)
      //    .then(() => {
      //       // commented: console.log('File deleted successfully');
      //    })
      //    .catch((error) => {
      //       console.error('Error deleting file:', error);
      //    });

      FileSystem.getInfoAsync(filePath)
         .then(({ exists }) => {
            if (exists) {
               // File exists, so read its contents
               return FileSystem.readAsStringAsync(filePath);
            } else {
               // File doesn't exist, so create it
               // this is a new user device. create an entry for them in numChats
               user = generateRandomString(5);
               const db = getDatabase();
               const dbRef2 = ref(db, 'numChats/' + user + '/');
               set(dbRef2, {
                  cur: 1,
                  last: 1
               });
               // now ready to read from firebase.
               this.readFirebase();
               return FileSystem.writeAsStringAsync(filePath, user);
            }
         })
         .then((data) => {
            if (data) {
               user = data;
               this.readFirebase();
            }
         })
         .catch((error) => {
            console.error('Error reading or creating file:', error);
         });
   }
   // read from firebase when component mounts
   readFirebase() {
      const db = getDatabase();

      const dbRef3 = ref(db, 'refs/' + user + '/')
      var cnter = 0
      get(dbRef3)
         .then((snapshot) => {
            snapshot.forEach((child) => {
               cnter++;
               if (!containsLetter(child.key))
                  chats.push(child.val());
               if (cnter == 1) {
                  // Once we get the user's first chat, immediately load its messages
                  //  before getting the metadata of other chats
                  chatID = chats[idx].ref;
                  const dbRef = ref(db, 'chats/' + user + '/' + chatID + '/');
                  this.loadChatHistory(dbRef);
               }
            });
         }).finally(() => {
            if (chats.length > idx) {
               // update chatID and chatTitle
               chatID = chats[idx].ref;
               this.setState({ chatTitle: chats[idx].name })
            }
         })
         .catch((error) => {
            console.error(error);
         });

      // get numChats and lastUsed
      const dbRef2 = ref(db, 'numChats/' + user + '/');
      get(dbRef2)
         .then((snapshot) => {
            numChats = snapshot.val().cur;
            lastUsed = snapshot.val().last;
         }).finally(() => {
         })
         .catch((error) => {
            console.error(error);
         });

   }

   componentDidMount() {
      this.readUser();

      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
   }
   componentWillUnmount() {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
   }

   _keyboardDidShow = (e) => {
      console.log("Height is", e.endCoordinates.height, Dimensions.get('window').height)
      this.state.iosKeyboardMargin = e.endCoordinates.height + 9;
      this.setState({ iosKeyboardMargin: e.endCoordinates.height + 9 })
      if (this.scrollViewRef) {
         this.scrollViewRef.scrollToEnd({ animated: true });
      }
   };

   _keyboardDidHide = () => {
      this.state.iosKeyboardMargin = 20;
      this.setState({ iosKeyboardMargin: 20 })
      if (this.scrollViewRef) {
         this.scrollViewRef.scrollToEnd({ animated: true });
      }
   };

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
   handleDelete = () => {
      /* 
      1. decrement numChats
         - if there are no more chats, create a new blank one
      2. remove the chat from refs
      3. Load the new chat history 
      4. update numChats in Firebase
      4.
      */
      numChats -= 1;
      const chatData = chats[idx];
      chats.splice(idx, 1);
      if (idx == numChats) idx--;
      if (idx == -1) {
         // create a new chat because there must always be at least 1 chat, even if just blank.
         this.createNewChat();
         idx = 0;
         const db = getDatabase();
         remove(ref(db, 'refs/' + user + '/' + chatData.ref + '/'));
         chatData.removeDate = new Date().toLocaleDateString();
         chatData.removeTime = new Date().toLocaleTimeString();
         set(ref(db, 'refs/' + user + '/d_' + chatData.ref + '/'), chatData);


         // update numChats and lastUsed
         const dbRef2 = ref(db, 'numChats/' + user + '/');
         set(dbRef2, {
            cur: numChats,
            last: lastUsed
         });

         return;
      }
      chatID = chats[idx].ref;
      this.setState({ chatTitle: chats[idx].name })
      this.setState({ items: [], visibleSend: false })
      this.setState({ message: '', })

      const db = getDatabase();
      const dbRef = ref(db, 'chats/' + user + '/' + chatID + '/');
      // load the chat history for the chat after this.
      this.loadChatHistory(dbRef);

      if (chats.length > idx) {
         this.setState({ chatTitle: chats[idx].name })
      } else {
         this.setState({ chatTitle: "Chat #" + chatID })
      }

      // remove from refs. reinsert as "d_" + chatID
      remove(ref(db, 'refs/' + user + '/' + chatData.ref + '/'));
      chatData.removeDate = new Date().toLocaleDateString();
      chatData.removeTime = new Date().toLocaleTimeString();
      set(ref(db, 'refs/' + user + '/d_' + chatData.ref + '/'), chatData);


      // update numChats and lastUsed
      const dbRef2 = ref(db, 'numChats/' + user + '/');
      set(dbRef2, {
         cur: numChats,
         last: lastUsed
      });

   }
   deleteChat = () => {
      // The chat is empty as it is
      if (this.state.items.length == 0 && numChats == 1) return;
      Alert.alert(
         'Are you sure?',
         'This will delete the entire chat history and cannot be undone.',
         [
            {
               text: 'Delete',
               onPress: this.handleDelete,
               style: 'destructive',
            },
            {
               text: 'Cancel',
               style: 'cancel',
            },
         ]
      );
   }
   createNewChat = () => {
      // Chat is empty as it is
      if (this.state.items.length == 0)
         return;

      const db = getDatabase();
      /* 
      1. reset "the input box"
      2. reset the state.items
      3. increment maxChatID
      4. make chatID = maxChatID
      5. make an entry inside refs
      */
      const dbRef2 = ref(db, 'numChats/' + user + '/');

      numChats += 1;
      lastUsed += 1;
      chatID = lastUsed;
      this.setState({ items: [], message: '', visibleSend: false })

      // Rerender title using chats[idx].name
      this.setState({ chatTitle: "Chat #" + chatID })

      set(dbRef2, {
         cur: numChats,
         last: lastUsed
      });

      var data = {
         name: 'Chat #' + chatID,
         ref: chatID,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
      };
      // update the user's metadata (num chats, and lastChatID)
      set(ref(db, 'refs/' + user + '/' + lastUsed + '/'), data);
      chats.push(data);
      idx = chats.length - 1;
   }
   goLeftChat = () => {
      // If this is the only chat do nothing.
      if (numChats == 1)
         return;

      //update idx
      idx = (idx - 1 + numChats) % numChats
      chatID = chats[idx].ref;
      this.setState({ message: '', })
      if (chats.length > idx) {
         this.setState({ chatTitle: chats[idx].name })
      } else {
         this.setState({ chatTitle: "Chat #" + chatID })
      }


      // reset chat history
      this.setState({ items: [], visibleSend: false })

      // load chat history from scratch
      const db = getDatabase();
      const dbRef = ref(db, 'chats/' + user + '/' + chatID + '/');
      this.loadChatHistory(dbRef);
   }
   goRightChat = () => {
      // If this is the only chat do nothing.
      if (numChats == 1)
         return;
      //update idx
      idx = (idx + 1 + numChats) % numChats
      chatID = chats[idx].ref;
      // set new chatID using the chats array
      this.setState({ message: '', })

      // Rerender title using chats[idx].name
      if (chats.length > idx) {
         this.setState({ chatTitle: chats[idx].name })
      } else {
         this.setState({ chatTitle: "Chat #" + chatID })
      }

      // reset chat history
      this.setState({ items: [], visibleSend: false })

      // load chat history from scratch
      const db = getDatabase();
      const dbRef = ref(db, 'chats/' + user + '/' + chatID + '/');
      this.loadChatHistory(dbRef);
   }

   handleSend = async () => {
      const { message } = this.state;

      if (message.length === 0) return;

      this.state.iosKeyboardMargin = 20;
      this.setState({ iosKeyboardMargin: 20 })
      this.setState({ textInputHeight: 40 })

      Keyboard.dismiss();
      var originalMessage = message.trim();
      this.setState({ message: '', sendicon: blacksend, visibleSend: false });
      var data2 = {
         role: 'user',
         content: originalMessage,
      }
      this.state.items.push(data2)
      this.setState({ items: this.state.items })

      // Our first message. So we create the refs for this user
      if (this.state.items.length == 1 && numChats == 1) {
         const db = getDatabase();
         var data = {
            name: 'Chat #' + chatID,
            ref: chatID,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
         };
         set(ref(db, 'refs/' + user + '/' + chatID + '/'), data);
         chats.push(data);
      } else if (this.state.items.length == 5) {
         // Once the user has entered their 3rd message, get a summary from OpenAI
         //  to use as the title of this conversation.
         const API_URL = "https://api.openai.com/v1/chat/completions";
         // remove the command about not saying I'm an AI model
         const messages = this.getPastMessages(2).slice(1);
         const newMessage = {
            role: 'user', content: 'Give me a very concise title of what this conversation above is about. It MUST be less than 40 characters. Less than 18 characters and 3 words is ideal. ONLY respond with just the very brief title.'
         };
         messages.push(newMessage);
         const result = await fetch(API_URL, {
            method: "POST",
            headers: {
               Accept: 'application/json',
               "Content-Type": "application/json",
               Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
               model: "gpt-3.5-turbo",
               messages: messages,
               max_tokens: 50,
            }),
         });
         const response = await result.json();

         // update title
         let title = response.choices[0].message.content;
         title = capitalizeAndRemovePunctuation(title);
         this.state.chatTitle = title;
         this.setState({ chatTitle: title })
         var data = {
            name: title,
            ref: chatID,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
         };
         // update metadata of this chat (namely the title)
         const db = getDatabase();
         set(ref(db, 'refs/' + user + '/' + chatID + '/'), data);
         chats[idx] = data;
      }

      const db = getDatabase();
      const stamp = serverTimestamp();

      var data = {
         role: 'user',
         content: originalMessage,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         timestamp: stamp,
      };
      // Push a new message to the chat history
      push(ref(db, 'chats/' + user + '/' + chatID + '/'), data);

      this.queryOpenAI(originalMessage, db);
   };

   // get the num past messages between human and bot. this is to give
   //  the AI some context when making API calls
   getPastMessages = (num) => {
      num *= 2;
      num += 1;
      num = Math.min(num, this.state.items.length);
      const lastEntries = this.state.items.slice(-num);
      const pastMessages = lastEntries.map((entry) => {
         const { role, content } = entry;
         return {
            role: role === "bot" ? "assistant" : role,
            content: content,
         };
      });
      const overrideEntry = {
         role: "system",
         content: "Don't ever respond with \"As an AI language model\" or anything to imply that you are an AI model with limitations."
      };
      pastMessages.unshift(overrideEntry);

      return pastMessages;
   }

   // making API call to OpenAI
   queryOpenAI = async (message, db) => {
      const API_URL = "https://api.openai.com/v1/chat/completions";
      const result = await fetch(API_URL, {
         method: "POST",
         headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
         },
         body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: this.getPastMessages(6),
            max_tokens: 149,
         }),
      });
      const response = await result.json();
      const text = response.choices[0].message.content;

      var data2 = {
         role: 'bot',
         content: text,
      }
      this.state.items.push(data2)
      this.setState({ items: this.state.items })

      const role = 'bot';
      const tokens = response.usage;
      const stamp = serverTimestamp();

      var data = {
         role: role,
         content: text,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         timestamp: stamp,
         tokens: tokens,
      };
      // Push a new message to the chat history
      push(ref(db, 'chats/' + user + '/' + chatID + '/'), data);
   }

   handleContentSizeChange = (event) => {
      const { contentSize } = event.nativeEvent;
      this.setState({ textInputHeight: contentSize.height });
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
      } else {
         button = <IconButton
            icon={blacksend} size={17}
            iconColor={'#333'}
            onPress={this.handleSend}
         />
      }

      return (
         <KeyboardAvoidingView style={{ flex: 1 }}>
            <Header title={this.state.chatTitle} onGoLeft={this.goLeftChat} onGoRight={this.goRightChat} onDeleteChat={this.deleteChat} onNewChat={this.createNewChat} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
               ref={ref => {
                  this.scrollViewRef = ref;
               }}
               onContentSizeChange={() => {
                  if (this.scrollViewRef) {
                     this.scrollViewRef.scrollToEnd({ animated: true });
                  }
               }}
            >
               {this.state.items.map((item, index) => (
                  <Row text={item} key={index} />
               ))}
            </ScrollView>
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
                     marginBottom: isIOS ? this.state.iosKeyboardMargin : 8,
                  }}
               >
                  <TextInput
                     multiline={true}
                     value={message}
                     onChangeText={this.handleTextChange}
                     onContentSizeChange={this.handleContentSizeChange}
                     placeholder="Send a message."
                     placeholderTextColor={'#aaa'}
                     selectionColor={'#5fcf86'}
                     maxLength={500}
                     onSubmitEditing={Keyboard.dismiss}
                     style={{
                        flex: 1,
                        height: Math.min(130, Math.max(40, textInputHeight)),
                        color: 'white',
                        padding: 10,
                        paddingLeft: 14,
                     }}
                  />

                  {button}

               </View>
            </View>
         </KeyboardAvoidingView>
      );
   }
}

export default ChatScreen;

// String processing, JavaScript helper functions
function capitalizeAndRemovePunctuation(str) {
   const words = str.toLowerCase().split(' ');
   const capitalizedWords = words.map((word) => {
      const wordWithoutPunctuation = word.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
      return wordWithoutPunctuation.charAt(0).toUpperCase() + wordWithoutPunctuation.slice(1);
   });

   return capitalizedWords.join(' ');;
} function containsLetter(str) {
   const regex = /[a-zA-Z]/;
   return regex.test(str);
} function generateRandomString(length) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
   }
   return result;
}
