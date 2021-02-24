/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Image, ImageBackground, Dimensions, AsyncStorage, StyleSheet, ScrollView
} from 'react-native';

import COLOR from '../styles/Color';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import FloatingLabel from '../components/FloatingLabel';
import { RoundButton, SocialButton, InputIcon } from '../components/Buttons/Button';
import AppLayout from './Views/AppLayout';
import normalize from 'react-native-normalize';
import ValidationComponent from 'react-native-form-validator';
import { HeaderBG, HeaderLeftBack } from '../components/HeaderOptions';

import Layout from '../../constants/Layout';
import { postData } from '../api/service';
import { ToastMessage } from '../components/ToastMessage';
import { Loader } from '../components/Loader';
import OTPScreen from './OTPScreen';

import Global from '../../constants/Global';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { TextInput } from 'react-native-paper';

const FIREBASE_CONFIG = Global.FIREBASE_CONFIG;
try {
    if (FIREBASE_CONFIG.apiKey) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
} catch (err) {
    // ignore app already initialized error on snack
}

const { width, height } = Dimensions.get('window');

export default class ForgotPasswordScreen extends ValidationComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Forgot Password</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
        };
    };

    state = {
        phone_number: '',
        user_id: '',
        showIndicator: false,
        autoFocus: false,
        verificationId: '',
    }
    constructor(props) {
        super(props);
        this.recaptchaVerifier = React.createRef();
    }

    componentDidMount() {
        //this.initAsync();
    }

    onSubmit = async () => {

        if (this.checkValidForm()) {
            let params = { phone_number: this.state.phone_number };
            this.setState({ showIndicator: true })
            postData('forgot-password', params).then(async (res) => {
                console.log(res)
                this.setState({ showIndicator: false })
                if (res.status) {
                    this.setState({ user_id: res.user_id })
                    this.sendOTP();
                } else {
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
            if(err.message == 'TOO_SHORT'){
                ToastMessage('This is not a valid phone number. Please enter valid phone number.', 'error');
            }
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
            this.setState({ showIndicator: false })
            this.props.navigation.navigate('ResetPassword', { user_id: this.state.user_id });

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
            <View style={{ bottom: 0, top: 0, width: '100%', height: height, minHeight: height }}>

                <FirebaseRecaptchaVerifierModal
                    title='Prove you are human!'
                    cancelLabel='Close'
                    ref={this.recaptchaVerifier}
                    firebaseConfig={FIREBASE_CONFIG}
                />
                <View style={{ height: height, backgroundColor: '#FFF' }}>
                    {showIndicator ? <Loader /> : null}
                    <View style={[{ flex: 1.8 }, Styles.centerText]}>
                        <Image source={Images.forgotPassword} resizeMode="contain" style={{ width: normalize(150), height: normalize(150) }} />
                    </View>
                    {isOTPView ? <OTPScreen that={this} /> :
                        <View style={{ flex: 3.5, justifyContent: 'center', padding: 15 }}>
                            <Text style={[Styles.font18, Styles.textGray, Styles.fontMedium]}>Please enter your registered mobile number.</Text>
                            <Text style={[Styles.font16, Styles.textGrayLight, Styles.fontRegular, { marginTop: 5 }]}>We will send a verification code to your registered mobile number.</Text>
                            <View style={[Styles.formGroup, { marginTop: 20 }]}>
                            <TextInput
                                returnKeyType='done'
                                maxLength={10}
                                keyboardType="number-pad"
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="Phone Number"
                                value={phone_number}
                                theme={{ colors: Layout.inputBoxTheme}}
                                onChangeText={text =>  this.setState({ phone_number: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.phoneIcon} />} style={Styles.inputLeftIcon}/>}
                            />
                                {/* <FloatingLabel
                                    icon={Images.phoneIcon}
                                    maxLength={10}
                                    onChangeText={value => {
                                        this.setState({ phone_number: value });
                                    }}
                                    refer='phone_number'
                                    value={phone_number}
                                    labelStyle={[Styles.fontRegular, Styles.font14]}
                                    keyboardType="number-pad"
                                    autoCapitalize='none'
                                >Phone Number</FloatingLabel> */}
                            </View>
                            <View style={[Styles.formGroup, { marginTop: normalize(20) }]}>
                                <RoundButton onPress={this.onSubmit} startColor="#2A395B" endColor="#080B12" label="Next" />
                            </View>
                        </View>
                    }
                </View>
            </View>
        );
    }
    render() {
        return (
            <AppLayout children={this.renderView()} />
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