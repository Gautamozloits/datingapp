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
    StatusBar, Image, ScrollView, KeyboardAvoidingView, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
const screenHeight = Math.round(Dimensions.get('window').height);

export default class ActiveGameLayout extends React.Component {
    constructor(props) {
        super(props);
        this.password = '';
        this.state = {
            username: '',
            isModalOpen: false,
            modalText: '',
        };
    }

    componentDidMount() {
        console.log('screenHeight: ',screenHeight)
    }


    render() {
        return (
            <KeyboardAvoidingView style={{height:screenHeight}} 
            keyboardVerticalOffset = {(this.props.offset) ? this.props.offset : 0} 
            behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <SafeAreaView style={[Styles.safearea, {paddingBottom:0}]}>
                 <LinearGradient colors={["#2A395B","#080B12"]} start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
                    <StatusBar translucent={true} backgroundColor={'transparent'} />
                </LinearGradient >
                
                {/* <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} /> */}

                <View style={[Styles.container,{padding: 20, backgroundColor:COLOR.BG_COLOR},this.props.styles]}>
                    {this.props.children}
                </View>

            </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}
