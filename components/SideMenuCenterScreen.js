// const React = require('react');
// // const Navigation = require('react-native-navigation');
// const { View, Text } = require('react-native');
// const greensend = require('../assets/smallicons/greensend.png');

// class SideMenuCenterScreen extends React.Component {
//   static options() {
//     return {
//       topBar: {
//         leftButtons: {
//           id: 'sideMenu',
//           icon: '../assets/smallicons/greensend.png'
//         }
//       }
//     };
//   }

//   constructor(props) {
//     super(props);
//     Navigation.events().bindComponent(this);
//   }

//   render() {
//     return (
//       <View>
//         <Text>Click the hamburger icon to open the side menu</Text>
//       </View>
//     );
//   }

//   navigationButtonPressed({ buttonId }) {
//     if (buttonId === 'sideMenu') {
//       Navigation.mergeOptions(this.props.componentId, {
//         sideMenu: {
//           left: {
//             visible: true
//           }
//         }
//       });
//     }
//   }
// }