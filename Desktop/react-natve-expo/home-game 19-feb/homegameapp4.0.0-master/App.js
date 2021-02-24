import React, { useRef, useState, useEffect } from "react";

import { Platform, Alert, StyleSheet, View, AppState, LogBox, AsyncStorage } from 'react-native';
import * as Sentry from 'sentry-expo';
import NetInfo from "@react-native-community/netinfo";

import RootStack from './navigation/routes';
import NavigationService from './navigation/NavigationService';
import { ToastMessage } from './src/components/ToastMessage';

import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from "react-native-flash-message";
import * as Linking from 'expo-linking';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import { getLoggedInUser, getDeviceInfo } from './src/api/guestService';
import { checkValidUser, postData } from './src/api/service';
import Constants from 'expo-constants';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import Global from './constants/Global';
const io = require('socket.io-client');
const SocketEndpoint = Global.SOCKET_URL;

const Stack = createStackNavigator();

Sentry.init({
  //dsn: 'https://a825d280aa7f44ad97f5198243703640@o444713.ingest.sentry.io/5419987',
  dsn: 'https://34e4f6e0358840ad9af62bd64ad16caa@o444713.ingest.sentry.io/5544855',
  //enableInExpoDevelopment: true,
  //debug: true,
  release: "home-game@3.1.0",
  autoSessionTracking: true,
  environment: "production",

});

export default function App(props) {


  // let redirectUrl = Linking.makeUrl('home/received?game_id=10');
  // navigation.navigate('invites', {view: 'active_tab'});
  // let redirectUrl = Linking.makeUrl(`Home/join?game_id=14`);
  // console.log('redirectUrl: ',redirectUrl)
  Linking.addEventListener('url', async function(res){
    // console.log('1111.......',res.url)
  
  let response = res.url;
  if(response){

  // console.log('this is consoling ' , redirectUrl)
  //exp://192.168.1.4:19000/--/Home/join?game_id=%20806=now
    let varOne = response.toString().split("/--/");
    // console.log('url - var one varOne - 1', varOne[1])
     let home = varOne[1].toString().split('/')
     let routeName = home[0]
    //  console.log('url - home route ', home[0])
     var received = home[1].toString().split('?')
    //  console.log(" this is received == type ",  received[0] )
     let routeType = received[0]
    //  console.log(" this is game-id = ",  received[1])
     var gameID = received[1].toString().split('=')
    //  console.log('game id here =  IIDDD' , parseInt(gameID[1]))
     let viewGameId = parseInt(gameID[1]);
     console.log("!!!!! name fo Route , Type and gameId ---",  routeName, routeType, viewGameId)

     let params = { route_name: routeName, route_type: routeType, game_id: viewGameId};
     console.log('url params....',JSON.stringify(params))
     let temp = await AsyncStorage.setItem('redirectUrl', JSON.stringify(params))

     console.log('!!!!consoling the temp ---', temp);
    

    }
})

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    LogBox.ignoreAllLogs()
    AppState.addEventListener("change", _handleAppStateChange);

    async function loadResourcesAndDataAsync() {
      try {
        Global.THIS_SOCKET = io(SocketEndpoint);
        Global.THIS_SOCKET.on('connect', (res) => {
          //ToastMessage("socket connected successfully")
          Global.IS_SOCKET_CONNECTED = true;
        });

        SplashScreen.preventAutoHideAsync();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'Bold': require('./assets/fonts/Bold.ttf'),
          'ExtraBold': require('./assets/fonts/ExtraBold.ttf'),
          'Light': require('./assets/fonts/Light.ttf'),
          'Medium': require('./assets/fonts/Medium.ttf'),
          'Regular': require('./assets/fonts/Regular.ttf'),
          'SemiBold': require('./assets/fonts/SemiBold.otf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        ToastMessage('No Internet Connection.')
      }
    });
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
     
  }, []);

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      var user = await getLoggedInUser();
      if (user) {

        console.log("App has come to the foreground!");
        updateDeviceToken();
      }

    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  async function updateDeviceToken() {
    if (Constants.isDevice) {
      var token = '';
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
        token = '';
      } else {
        var deviceInfo = await getDeviceInfo();
        let token_data = await Notifications.getExpoPushTokenAsync();
        if (token_data && token_data.data) {
          token = token_data.data;
        }
      }

      let params = { notification_token: token, device_info: deviceInfo, app_version: Global.APP_VERSION };
      postData('user/update-token', params).then(async (res) => {
        if (!res.success) {
          Alert.alert('Home Game', res.message, [{
            text: 'OK', onPress: async () => {
              console.log('here..')
              Linking.openURL(res.link);

            }
          }
          ])
        }
      })

    } else {
      console.log('Must use physical device for Push Notifications');
    }
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (<View style={{ flex: 1 }}>
      <RootStack
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      <FlashMessage style={{ zIndex: 50000 }} />
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
