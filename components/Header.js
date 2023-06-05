import React from 'react';
import { Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Touchable } from 'react-native';
import { IconButton } from 'react-native-paper';
const lefty = require('../assets/smallicons/lefty.png');
const righty = require('../assets/smallicons/righty.png');
const plus = require('../assets/smallicons/plus.png');
const trash = require('../assets/smallicons/trash.png');

// TODO: Go to home page
// TODO: Create new chat
const Header = ({ title, onNewChat, onDeleteChat, onGoLeft, onGoRight }) => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safe}>
                <TouchableOpacity onPress={() => { onGoLeft(); }}
                    style={{ marginLeft: 4, backgroundColor: 'white' }}>
                    <IconButton
                        icon={lefty} size={20}
                        iconColor={'black'}
                        backgroundColor={'#fff'}
                        onPress={() => { onGoLeft(); }}
                        style={styles.button}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onDeleteChat(); }}
                    style={{ marginLeft: 6, backgroundColor: 'white' }}>
                    <IconButton
                        icon={trash} size={17}
                        iconColor={'black'}
                        backgroundColor={'#fff'}
                        onPress={() => { onDeleteChat(); }}
                        style={styles.button}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => { onNewChat(); }}
                    style={{ marginLeft: 4, backgroundColor: 'white' }}>
                    <IconButton
                        icon={plus} size={20}
                        iconColor={'black'}
                        backgroundColor={'#fff'}
                        onPress={() => { onNewChat(); }}
                        style={styles.button}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onGoRight(); }}
                    style={{ marginRight: 4, backgroundColor: 'white' }}>
                    <IconButton
                        icon={righty} size={20}
                        iconColor={'black'}
                        backgroundColor={'#fff'}
                        onPress={() => { onGoRight(); }}
                        style={styles.button}
                    />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    safe: {
        backgroundColor: '#fff', width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 8, // Added for spacing between button and text
    },
    title: {
        // marginLeft: -59,
        flex: 1,
        // color: '#255943',
        color: '#555',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

// const styles = StyleSheet.create({
//     container: {
//         // height: 60,
//         backgroundColor: '#ffffff',
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingTop: 0,
//         justifyContent: 'center', // Updated
//     },
//     button: {
//         width: 20,
//         height: 40,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         textAlign: 'center', // Added
//         flex: 1, // Added
//     },
// });


export default Header;