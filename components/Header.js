import React from 'react';
import { Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Touchable } from 'react-native';
import { IconButton } from 'react-native-paper';
const arrow = require('../assets/smallicons/leftback.png');

// write me a regular empty function
const goHome = () => {
    console.log('Going Home');
};

// TODO: Go to home page
const Header = ({ title, onPress }) => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safe}>
                <TouchableOpacity onPress={() => { console.log(' presssed') }}
                    style={{ marginLeft: 10, backgroundColor: 'white' }}>
                    <IconButton
                        icon={arrow} size={20}
                        iconColor={'black'}
                        backgroundColor={'#fff'}
                        onPress={() => { console.log(' presssed') }}
                        style={styles.button}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
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
        marginLeft: -59,
        flex: 1,
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