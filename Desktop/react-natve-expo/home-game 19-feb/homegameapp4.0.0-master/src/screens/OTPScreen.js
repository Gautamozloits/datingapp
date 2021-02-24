/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Image, ImageBackground, Dimensions, AsyncStorage, StyleSheet
} from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

import * as GoogleSignIn from 'expo-google-sign-in';
import { CheckBox } from 'react-native-elements'
import COLOR from '../styles/Color';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import FloatingLabel from '../components/FloatingLabel';
import { RoundButton, SocialButton } from '../components/Buttons/Button';
import FixScreenWithoutPadding from './Views/FixScreenWithoutPadding';
import normalize from 'react-native-normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ValidationComponent from 'react-native-form-validator';

import { postData } from '../api/service';
import { ToastMessage } from '../components/ToastMessage';
import { Loader } from '../components/Loader'
const { width, height } = Dimensions.get('window');
import OTPTextInput  from 'react-native-otp-textinput';
export default class OTPScreen extends React.Component {
    state = {
        phone_number: '',
        otpInput:'',
        showIndicator: false,
        autoFocus: false,
    }
    constructor(props) {
        super(props);        
    }

    componentDidMount() {
        //this.initAsync();
    }
    
    clearText = () => {
        this.otpInput.clear();
    }
     
    setText = () => {
        this.otpInput.setValue("1234");
    }

    render() {
        const { showIndicator, phone_number } = this.state;
        return (
          
                <View style={{ flex: normalize(3.5), justifyContent: 'center' }}>
                    <View style={Styles.loginform}>
                        <View style={[Styles.formGroup]}>
                            <OTPTextInput 
                            textInputStyle={{width:'10%'}}
                            inputCount={6}
                            tintColor={'#2A395B'}
                            inputCellLength={1}
                            ref={(e) => (this.input1 = e)}
                            handleTextChange={(text) => this.setState({otpInput: text})}
                            />
                        </View>
                    
                        <View style={[Styles.formGroup, {marginTop:normalize(5)}]}>
                            <RoundButton onPress={() => 
                                this.props.that.signUp(this.state.otpInput)
                                } startColor="#2A395B" endColor="#080B12" label="Verify" />
                        </View>

                        <View style={[Styles.formInlineGroup, Styles.centerText]}>
                            <Text style={[Styles.font13, Styles.fontRegular, { color: COLOR.PRIMARY_LIGHT }]}>Didn't receive code?</Text><TouchableOpacity onPress={() => {this.props.that.onSubmit();}}><Text style={[Styles.font13, Styles.fontBold, { color: COLOR.PRIMARY_DARK }]}> RESEND</Text></TouchableOpacity>
                        </View>

                    </View>
                </View>
            
        );
    }
}

const styles = StyleSheet.create({
    checkBoxContainer: { backgroundColor: 'transparent', borderWidth: 0, paddingLeft: 0, marginLeft: 0 },
    checkBoxText: {
        color: COLOR.BLACK_LIGHT,
        fontSize: normalize(15),
        fontWeight: '200',
        fontFamily: 'Regular'
    },
    checkBoxImage: {height:normalize(20), width:normalize(20)},
})