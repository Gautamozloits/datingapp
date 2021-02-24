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
    Keyboard,
    StyleSheet,
    SafeAreaView,
    StatusBar, Image, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
export default class AppLayout extends React.Component {
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
            <KeyboardAwareScrollView  keyboardShouldPersistTaps={'always'} 
            style={[(Platform.OS === 'ios') ? styles.marginTop : null,{flex:1, backgroundColor:'#FFF'}]}
            showsVerticalScrollIndicator={false}>
                <SafeAreaView style={[Styles.safearea, { paddingBottom: 0 }]}>
                    <LinearGradient colors={["#2A395B", "#080B12"]} start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <StatusBar translucent={true} backgroundColor={'transparent'} />
                    </LinearGradient >
                    {this.props.children}
                </SafeAreaView>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    marginTop: {
        marginTop: -30
    }
});