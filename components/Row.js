import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            font: {},
            fontsLoaded: false
        }
    }

    async loadFonts() {
        await Font.loadAsync({
            'Poppins-Black': require('../assets/fonts/Geologica_Auto-Regular.ttf'),
            // 'Poppins-Black': require('../assets/fonts/Poppins-Medium.ttf'),
        });
        this.setState({ fontsLoaded: true });
        this.setState({ font: { fontFamily: 'Poppins-Black' } });
    }
    componentDidMount() {
        this.loadFonts();
    }

    render() {
        let image, bgColor, txtColor;
        if (this.props.text.role === 'bot') {
            image = require('../assets/smallicons/chat.png');
            bgColor = '#f5f5f5';
            txtColor = '#b4b7be';
            bgColor = '#434654';
        } else {
            image = require('../assets/smallicons/user.png');
            txtColor = '#d6d6dc';
            bgColor = '#353640';
        }
        return (
            <View style={{
                ...styles.container, paddingTop: 20, paddingBottom: 20,
                backgroundColor: bgColor
            }}>
                <View style={styles.imageContainer}>
                    <Image
                        source={image}
                        style={styles.image}
                    />
                </View>
                <Text style={{
                    ...this.state.font,
                    fontSize: 15,
                    // fontWeight: '600',
                    color: txtColor,
                    marginLeft: 9,
                    marginRight: 24
                }}>{this.props.text.content}</Text>
            </View>

        );

    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
    }, imageContainer: {
        alignSelf: 'flex-start',
    },
    image: {
        width: 22,
        height: 22,
        marginRight: 8,
        marginTop: 5
    },
    text: {
    },
});
export default Row;
