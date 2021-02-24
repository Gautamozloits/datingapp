/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar, Image, ScrollView
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';

export default class Header extends React.Component {
   
    static navigationOptions = ({ navigation }) => {
        return {
          //Heading/title of the header
          title: navigation.getParam('Title', 'Home'),
          headerTitleAlign: 'center',
          //Heading style
          headerStyle: {
            backgroundColor: navigation.getParam('BackgroundColor', 'red'),
          },
          //Heading text color
          headerTintColor: navigation.getParam('HeaderTintColor', '#fff'),
          headerBackground:() => (
            <LinearGradient
              colors={['#2A395B', '#080B12']}
              style={{ flex: 1, height: 80, textAlign:'center' }}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('Right')}>
              <Image source={Images.notification} style={{height:20}} resizeMode="contain"/>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('FirstPage')}>
              <Image source={Images.menuIcon} style={{height:20}} resizeMode="contain"/>
            </TouchableOpacity>
          ),
        };
      };
      
    componentDidMount() {

    }


    render() {
        return (
            <SafeAreaView style={[Styles.safearea, {paddingBottom:20}]}>
                 <LinearGradient colors={["#2A395B","#080B12"]} start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
                    <StatusBar translucent={true} backgroundColor={'transparent'} />
                </LinearGradient >
                
                {/* <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} /> */}

                <View style={[Styles.container, {padding: 15, backgroundColor:COLOR.BG_COLOR}]}>
                    {this.props.children}
                </View>

            </SafeAreaView>
        );
    }
}
