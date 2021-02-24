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
    StatusBar, Image, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';

export default class FixScreenWithoutPadding extends React.Component {
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

    }


    render() {
        return (
            <KeyboardAvoidingView style={{flex:1}} keyboardVerticalOffset = {0} >
            
               
            <SafeAreaView style={[Styles.safearea, {paddingBottom:0}]}>

            <ScrollView  keyboardShouldPersistTaps='always' style={{flex:1}}  keyboardVerticalOffset = {0} behavior="padding" enabled>
                 <LinearGradient colors={["#2A395B","#080B12"]} start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
                    <StatusBar translucent={true} backgroundColor={'transparent'} />
                </LinearGradient >
                <View style={[Styles.container, {padding: 0, backgroundColor:COLOR.BG_COLOR}]}>
                    {this.props.children}
                </View>
                </ScrollView>
            </SafeAreaView>
            
            
            </KeyboardAvoidingView>
        );
    }
}
