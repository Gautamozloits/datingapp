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
import { Loader } from '../components/Loader';
import OTPScreen from './OTPScreen';

import Global from '../../constants/Global';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";

const FIREBASE_CONFIG = Global.FIREBASE_CONFIG;
try {
    if (FIREBASE_CONFIG.apiKey) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
} catch (err) {
    // ignore app already initialized error on snack
}

const { width, height } = Dimensions.get('window');

export default class MobileScreen extends ValidationComponent {
    state = {
        phone_number: '',
        showIndicator: false,
        autoFocus: false,
        isOTPView: false,
        verification_code: '',
        verificationId: '',
    }
    constructor(props) {
        super(props);
        this.recaptchaVerifier = React.createRef();
    }


    componentDidMount() {
    }
    onSubmit = async () => {
        if (this.checkValidForm()) {
            let params = { phone_number: this.state.phone_number };
            postData('can_create_account', params).then(async (res) => {

                if (res.status) {
                    this.sendOTP();
                } else {
                    this.setState({ showIndicator: false })
                    ToastMessage(res.message, "error")
                }
            })
        }
    }

    sendOTP = async () => {
        try {
            var phoneNumber = '+91' + this.state.phone_number;
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                this.recaptchaVerifier.current
            );
            this.setState({ verificationId: verificationId, isOTPView: true, showIndicator: false });
            ToastMessage("Verification code has been sent to your phone.", 'success');
        } catch (err) {
            ToastMessage(err.message, 'error');
        }
    }

    signUp = async (otp) => {
        try {
            this.setState({ showIndicator: true })
            const credential = firebase.auth.PhoneAuthProvider.credential(
                this.state.verificationId,
                otp
            );
            await firebase.auth().signInWithCredential(credential);
            if (this.checkValidForm()) {
                let params = { phone_number: this.state.phone_number };
                postData('check_valid_mobile', params).then(async (res) => {

                    this.setState({ showIndicator: false })
                    if (res.status) {
                        await AsyncStorage.setItem('user' + Global.LOCALSTORAGE, JSON.stringify(res.data));
                        ToastMessage(res.message)
                        this.props.navigation.navigate('Home');
                    } else {
                        ToastMessage(res.message, "error")
                    }
                })
            }

        } catch (err) {
            this.setState({ showIndicator: false })
            ToastMessage(err.message, "error");
        }

    }

    checkValidForm = () => {
        this.validate({
            phone_number: { required: true },
        });

        if (this.isFormValid()) {
            return true;
        } else {
            var errorMessage = '';
            if (this.isFieldInError('phone_number')) {
                errorMessage = 'The phone number field is required';
            }
            ToastMessage(errorMessage, "error")
            return false;
        }
    }

    renderView = () => {
        const { showIndicator, phone_number, isOTPView } = this.state;
        return (
            <View style={{ height: height, backgroundColor: '#FFF' }}>
                <FirebaseRecaptchaVerifierModal
                    title='Prove you are human!'
                    cancelLabel='Close'
                    ref={this.recaptchaVerifier}
                    firebaseConfig={FIREBASE_CONFIG}
                />
                {showIndicator ? <Loader /> : null}
                <View style={{ flex: normalize(2.5), alignItems: 'center', alignContent: 'center' }}>
                    <View style={{
                        backgroundColor: 'orange',
                        height: normalize(550),
                        width: normalize(550),

                        //marginLeft: -20,
                        marginTop: normalize(-300),
                        borderRadius: normalize(300),
                        overflow: 'hidden'
                    }}>
                        <ImageBackground source={Images.loginBG} style={{ height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }} resizeMode="cover">
                            <Image
                                style={{ width: normalize(200), height: normalize(200), marginBottom: normalize(40) }}
                                source={Images.appLogo}
                                resizeMode="contain"
                            />
                        </ImageBackground>
                    </View>
                </View>
                {isOTPView ? <OTPScreen that={this} /> :
                    <View style={{ flex: normalize(3.5), justifyContent: 'center' }}>
                        <View style={Styles.loginform}>
                            <View style={[Styles.formGroup]}>
                                <FloatingLabel
                                    returnKeyType='done'
                                    icon={Images.phoneIcon}
                                    maxLength={10}
                                    onChangeText={value => {
                                        this.setState({ phone_number: value });
                                    }}
                                    value={phone_number}
                                    refer='phone_number'
                                    autoFocus={this.state.autoFocus}
                                    //required={true}
                                    labelStyle={[Styles.fontRegular, Styles.font14]}
                                    //inputStyle={[this.isFieldInError('email') ? Styles.fieldError : null]}
                                    keyboardType="number-pad"
                                >Phone Number</FloatingLabel>
                            </View>

                            <View style={[Styles.formGroup, { marginTop: normalize(5) }]}>
                                <RoundButton onPress={this.onSubmit} startColor="#2A395B" endColor="#080B12" label="Send OTP" />
                            </View>

                            <View style={[Styles.formInlineGroup, Styles.centerText]}>
                                <Text style={[Styles.font13, Styles.fontRegular, { color: COLOR.PRIMARY_LIGHT }]}>Already Have an Account?</Text><TouchableOpacity onPress={() => { this.props.navigation.navigate('Login'); }}><Text style={[Styles.font13, Styles.fontBold, { color: COLOR.PRIMARY_DARK }]}> LOGIN</Text></TouchableOpacity>
                            </View>

                        </View>
                    </View>
                }
            </View>
        );
    }
    render() {
        return (
            <FixScreenWithoutPadding children={this.renderView()} />
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
    checkBoxImage: { height: normalize(20), width: normalize(20) },
})