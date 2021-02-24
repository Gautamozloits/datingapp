/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';
import React from 'react';
import {
  StatusBar,
  View,
  Dimensions,
  Image,
  Platform, AsyncStorage
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import BottomTabNavigator from './BottomTabNavigator';
import GuestNavigation from './GuestNavigation';

import LoginScreen from '../src/screens/LoginScreen';
import MobileScreen from '../src/screens/MobileScreen';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';
import SignUpScreen from '../src/screens/SignUpScreen';
import SplashScreen from '../src/screens/SplashScreen';
import SideMenu from '../src/sidebar/SideMenu';
import COLOR from '../src/styles/Color';
import { getLoggedInUser } from '../src/api/guestService';
import { checkValidUser, postData, getCurrency } from '../src/api/service';
import Global from '../constants/Global';
import Images from '../constants/Images';
import * as Linking from 'expo-linking';
//import { Notifications } from 'expo';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');
let screen_height = 300;
if (Platform.OS == 'android') {
  screen_height = height + StatusBar.currentHeight;
} else {
  screen_height = height;
}
const SCREEN_HEIGHT = screen_height;


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


class AuthLoadingScreen extends React.Component {


  constructor(props) {
    super(props);
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();

    this._loading();
    this.setNewStartedGame();
    // this.setEndGame();
    this.state = {
      notification: {}
    };
  }

  componentDidMount() {
    //this.registerForPushNotificationsAsync();

    // This listener is fired whenever a notification is received while the app is foregrounded
    this.notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('...........................',notification)
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    this.responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        let active_game_arr = ['CHIPS_REQUEST', 'NEW_LEAVE_REQUEST', 'CHIPS_ADDED', 'CHIPS_REQUEST_APPROVED', 'CHIPS_REQUEST_REJECTED', 'LEAVE_REQUEST_APPROVED', 'LEAVE_REQUEST_REJECTED', 'NEW_LEAVE_REQUEST'];
        let schedule_game_arr = ['NEW_INVITATION', 'USER_RESPONDED_TO_INVITATION', 'SEAT_CONFIRMED', 'SCHEDULE_GAME_NO_RESPONSE'];
        let pending_payment_arr = ['CLEARED_OUTSTANDING_DUES']
        

        if(response.notification){
          if(response.notification.request){
            if(response.notification.request.content){
                if(response.notification.request.content.data){
                  if(response.notification.request.content.data.data){
                    let data = response.notification.request.content.data.data;
                    data = JSON.parse(data)
                    if(data.type){
                      if(active_game_arr.includes(data.type)){
                        this.props.navigation.navigate('ActiveGame');
                      }else if(schedule_game_arr.includes(data.type)){
                        let active_tab = 'sent';
                        if(data.type === 'NEW_INVITATION' || data.type === 'SEAT_CONFIRMED'){
                          active_tab = 'received';
                        }
                        this.props.navigation.navigate('Invites', {view: active_tab});
                      }else if(pending_payment_arr.includes(data.type)){
                        this.props.navigation.navigate('Payment');
                      }
                    }
                    //console.log('----------------------------',data)
                  }
                }
            }
          }
        }
      }
    );

    



  }

  registerForPushNotificationsAsync = async () => {
    
    if (Constants.isDevice) {
      
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("Token on homegame ", token.data)
      if (token && token.data) {
        let params = {notification_token: token.data};

        postData('user/update-token', params).then(async (res) => {
            console.log(res)
        })

      }

    } else {
      console.log('Must use physical device for Push Notifications');
    }

    // if (Platform.OS === 'android') {
    //   Notifications.setNotificationChannelAsync('default', {
    //     name: 'default',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C',
    //   });
    // }
  };

  _handleNotification = notification => {
    Vibration.vibrate();
    console.log('notification: ',notification);
    this.setState({ notification: notification });
  };

  // Fetch the token from storage then navigate to our appropriate place
  _loading = async () => {

    let routeName = 'Login';
    let route_params = {};
    var user = await getLoggedInUser();
    if (user.token && user.token != '') {
      let validUser = await checkValidUser();
      if (validUser) {
        Images.currancyIcon = getCurrency(user.country_code)
        // if(user.country_code == '91'){
        //   Images.currancyIcon = Images.indianRupee;
        // }else{
        //   Images.currancyIcon = Images.dollar;
        // }
      

        if (user.phone_number === '' || user.is_mobile_verified === 0) {
          routeName = 'AddMobile';
        } else {

          routeName = 'Home';
          const redirectUrl = await AsyncStorage.getItem('redirectUrl')
          console.log("redirect url ", redirectUrl)
          if(redirectUrl && redirectUrl !== ""){

           let  jsonValue = JSON.parse(redirectUrl);
            routeName = jsonValue.route_name;
            route_params = {view: jsonValue.route_type, game_id: jsonValue.game_id}
           
           console.log("consoling asyncStorange  ", jsonValue);

          }
       
         // this.registerForPushNotificationsAsync();
        }
      } else {
        await AsyncStorage.removeItem('user' + Global.LOCALSTORAGE);
        routeName = 'Login'
      }
    }
    setTimeout(() => {
      this.props.navigation.navigate(routeName, route_params);
    }, 0)

  };

  setNewStartedGame = async () => {
    if (Global.THIS_SOCKET) {
      Global.THIS_SOCKET.on("newGameStarted", async (res) => {
        if (res.status) {
          let gameUsers = res.data;
          var user = await getLoggedInUser();
          var user_id = user.id
          let index = gameUsers.indexOf(user_id.toString());
          if (index >= 0) {
            //this.setState({activeGameImage: Images.activeGame})
            Global.ACTIVE_GAME_IMAGE = Images.activeGame
            // setTimeout(() => {
            this.props.navigation.navigate('ActiveGame');
            // });
          }

          //this.getActiveGame();
        }
      });
    }
  }
  setEndGame = async () => {
    //socket.on('autoGetActiveGame', function(res){
    if (Global.THIS_SOCKET) {
      Global.THIS_SOCKET.on("endGameListiner", async (res) => {
        if (res.status) {
          let gameUsers = res.data;
          var user = await getLoggedInUser();
          var user_id = user.id
          let index = gameUsers.indexOf(user_id.toString());
          if (index >= 0) {
            Global.ACTIVE_GAME_IMAGE = Images.blackjack
          }

          //this.getActiveGame();
        }
      });
    }
  }

  render() {
    return (
      <SplashScreen />
    );
  }
}

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Guest: GuestNavigation,
    //Login: LoginScreen,
    //AddMobile: MobileScreen,
    //SignUp: SignUpScreen,
    //ForgotPassword: ForgotPasswordScreen,
    Main: BottomTabNavigator,
    SidebarMenu: SideMenu
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default createAppContainer(RootStack);
