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
    StatusBar, Image, ScrollView, KeyboardAvoidingView, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../../styles/Styles';
const screenHeight = Math.round(Dimensions.get('window').height);
export default class FormLayout extends React.Component {
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

            <KeyboardAvoidingView
            keyboardShouldPersistTaps={'always'} 
            style={[(Platform.OS === 'ios') ? styles.marginTop : null,{flex:1, backgroundColor:'#FFF'}]}
            showsVerticalScrollIndicator={false}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset = {(this.props.offset) ? this.props.offset : 0} 
            >
                
                <SafeAreaView style={[Styles.safearea, { paddingBottom: 0 }]}>
                    <LinearGradient colors={["#2A395B", "#080B12"]} start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <StatusBar translucent={true} backgroundColor={'transparent'} />
                    </LinearGradient >
                    
                    {this.props.children}
                    
                </SafeAreaView>
                </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    marginTop: {
        marginTop: -30
    }
});