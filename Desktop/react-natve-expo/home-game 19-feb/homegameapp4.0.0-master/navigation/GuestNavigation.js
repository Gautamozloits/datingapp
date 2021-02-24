import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../src/screens/LoginScreen';
import MobileScreen from '../src/screens/MobileScreen';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../src/screens/ResetPasswordScreen';

import SignUpScreen from '../src/screens/SignUpScreen';

import Images from '../constants/Images';
import Styles from '../src/styles/Styles';


import React from 'react';
import { View,Text, Image } from 'react-native';
//import { fromLeft } from 'react-navigation-transitions';

class MyCustomHeaderBackImage extends React.Component {
  render() {
    return (
      <Image
        source={Images.backArrow}
        style={Styles.headerImage}
      />
    );
  }
}

const Navigation=createStackNavigator({
 
    Login: {
    screen: LoginScreen,
    navigationOptions: {
        headerShown: false,
    }
  },
  AddMobile: {
    screen: MobileScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
        headerShown: false,
    }
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen,
  },
  ResetPassword: {
    screen: ResetPasswordScreen,
  },
  

},{
  //initialRouteName: 'ScreenA',
  //transitionConfig: () => fromLeft(),
});
export default createAppContainer(Navigation);