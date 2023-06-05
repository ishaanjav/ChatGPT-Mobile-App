import React, { Component } from 'react';
import { View, Keyboard, ScrollView, TextInput, TouchableHighlight, Image, TouchableOpacity, Text } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';
import { getDatabase, ref, push, child, set, get, update, serverTimestamp, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';
import { onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebaseConfig.js';
// const Navigation = require('react-native-navigation');
import Header from './Header.js';
import Row from './Row.js';

const blacksend = require('../assets/smallicons/greensend.png');
const greensend = require('../assets/smallicons/greensend.png');
const isIOS = Platform.OS === 'ios';

//TODO: Change
var user = 'bob';
var chatID = '343d';
var index = 0;

// const items = [
//    // <Row text="a" role='user' />,
//    // <Row text="b" role='bot' />,
//    // <Row text="c" role='user' />,
//    // <Row text="d" role='bot' />,
// ]

class ChatScreen extends Component {
   constructor(props) {
      super(props);
      this.scrollViewRef = React.createRef();
      this.state = {
         message: '',
         textInputHeight: 40,
         sendicon: greensend,
         visibleSend: false,
         items: [],
      };
   }

   componentDidMount() {

      console.log('Reading Firebase');
      const db = getDatabase();
      const dbRef = ref(db, 'chats/' + user + '/' + chatID + '/');
      // onChildAdded(dbRef, (data) => {
      //    console.log(data)
      // });

      get(dbRef)
         .then((snapshot) => {
            snapshot.forEach((child) => {
               // console.log("Added", index)
               // this.state.items.push(<Row text={child.val()} key={index} />);
               this.state.items.push(child.val())
               index++;
            })
         }).finally(() => {
            console.log("Finally", this.state.items.length)
            // console.log(this.state.items);
            this.setState({ items: this.state.items })
            // this.forceUpdate();
         })
         .catch((error) => {
            console.error(error);
         });

      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);


      //TODO: send the entire chat history as a prompt to OpenAI.
      //   Question: Does OpenAI API itself remember the previous api messages sent?
      ///     or do I have to resend all of them?
      // console.log("\n")
      // console.log("\n")

      // onValue(dbRef, (snapshot) => {
      //    snapshot.forEach((child) => {
      //       console.log("Insert", index)
      //       this.state.items.push(<Row text={child.val()} key={index} />);
      //       index++;
      //    });
      // }, {
      //    onlyOnce: true
      // });
      // console.log(this.state.items);
   }
   componentWillUnmount() {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
   }

   _keyboardDidShow = () => {
      if (this.scrollViewRef) {
         this.scrollViewRef.scrollToEnd({ animated: true });
      }
   };

   _keyboardDidHide = () => {
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

   handleSend = () => {
      const { message } = this.state;

      if (message.length === 0) return;

      console.log('Sending message:', message);
      Keyboard.dismiss();
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
      var data = {
         role: 'user',
         content: originalMessage,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         timestamp: stamp,
      };
      push(ref(db, 'chats/' + user + '/' + chatID + '/'), data);

      // this.state.items.push(<Row text={data} key={index} />);
      this.state.items.push(data)
      index++;

      this.queryOpenAI(originalMessage, db);
   };

   queryOpenAI = async (message, db) => {
      // TODO: Send API request to OpenAI
      // const result = await fetch(API_URL, {
      //    method: "POST",
      //    headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${API_KEY}`,
      //    },
      //    body: JSON.stringify({
      //       model: "gpt-3.5-turbo",
      //       messages: [{ role: "user", content: message }],
      //       max_tokens: 90,
      //    }),
      // });

      // const response = await result.json();

      const response = {
         "choices": [
            {
               "finish_reason": "length",
               "index": 0,
               "message": {
                  // "content": "As an AI language model, I do not have personal preferences. However, according to critics and audience ratings, the best DC movie ever is The Dark Knight (2008), directed by Christopher Nolan and starring Christian Bale as Batman and Heath Ledger as the",
                  "content": "Man of Steel is often considered the best DC movie ever because it offers a fresh and modern take on the classic superhero origin story.\n\nThe movie explores Superman's origins on the planet Krypton and his upbringing on Earth, as well as his struggle to find his place in the world and his role as a hero. The film is visually stunning and action=packed, with some of the best and most intense superhero action scenes ever seen on screen. \n\n It also has a powerful emotional core, with themes of love, sacrifice, and heroism that resonate with audiences. Overall, Man of Steel is a well-crafted and entertaining movie that successfully re-introduced Superman to a new generation of moviegoers.",
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
      var data = {
         role: role,
         content: text,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         timestamp: stamp,
         tokens: tokens,
      };
      push(ref(db, 'chats/' + user + '/' + chatID + '/'), data);

      // this.state.items.push(<Row text={data} key={index} />);
      this.state.items.push(data)
      index++;

      console.log(this.state.items.length)
   }


   handleContentSizeChange = (event) => {
      const { contentSize } = event.nativeEvent;
      this.setState({ textInputHeight: contentSize.height });
   };

   handleLeftButtonPress = (event) => {
      // TODO, go to home screen
      console.log("Going to home screen");
   };
   renderItems() {
      // Check if items array is not empty
      // if (this.state.items.length > 0) {
      console.log("HEREEE", this.state.items.length)
      // console.log(this.state.items);
      return this.state.items.map((item, index) => (
         // Render individual item components here
         <Text key={index}>{item.role}</Text>
      ));
   }

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

      // TODO: Change title to name of chat
      // FEATURE: user swipes left on header. or swipes right. goes to next chat.
      return (
         <View style={{ flex: 1 }}>
            <Header title="Name of Chat" onPress={this.handleLeftButtonPress} />
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
               {/* {Object.entries(this.state.items).map(([key, value]) => {
                  return (
                     <Text>
                        {key}: {value}
                     </Text>
                  );
               })} */}
               {/* {this.renderItems()} */}
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
