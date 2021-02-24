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
    Platform,
    ImageBackground, Text
  } from 'react-native';
import Images from '../../constants/Images';

export default class SplashScreen extends React.Component {
   
    componentDidMount() {
   
    }

    render() {
        return (
            <ImageBackground source={Images.splashBg} style={{width: '100%', height: '100%', justifyContent:'center', alignItems:'center'}}>
            <Image
                style={{width: '80%'}}
                source={Images.appLogo}
                resizeMode="contain"
                />
          </ImageBackground>
        );
    }
}
