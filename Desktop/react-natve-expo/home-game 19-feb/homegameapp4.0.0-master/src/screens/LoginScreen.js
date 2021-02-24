/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Image, ImageBackground, Dimensions, AsyncStorage, StyleSheet, ScrollView, Keyboard, Alert
} from 'react-native';
import * as Linking from 'expo-linking';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import * as GoogleSignIn from 'expo-google-sign-in';
import { CheckBox } from 'react-native-elements'
import COLOR from '../styles/Color';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import FloatingLabel from '../components/FloatingLabel';
import { RoundButton, SocialButton, InputIcon } from '../components/Buttons/Button';
import AppLayout from './Views/AppLayout';
import normalize from 'react-native-normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ValidationComponent from 'react-native-form-validator';

import { postData, getDeviceInfo } from '../api/guestService';
import { getCurrency } from '../api/service';
import { ToastMessage } from '../components/ToastMessage';
import { Loader } from '../components/Loader'
import Global from '../../constants/Global';
import Layout from '../../constants/Layout';
const { width, height } = Dimensions.get('window');

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

import { TextInput } from 'react-native-paper';


export default class LoginScreen extends ValidationComponent {
    state = {
        username: '',
        password: '',
        showIndicator: false,
        rememberMe: false,
        autoFocus: false,
        passwordViewIcon: 'eye-off'
    }
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setRememberData()
        
 
    }

    setRememberData = async () => {
        let rememberData = await AsyncStorage.getItem('rememberData' + Global.LOCALSTORAGE);
        if (rememberData) {
            rememberData = JSON.parse(rememberData);

            this.setState({ username: rememberData.username, password: rememberData.password, rememberMe: true })
            this.setState({ autoFocus: true });
        }

    }

    
    

    registerForPushNotificationsAsync = async () => {
    
        if (Constants.isDevice) {
          
          const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
          );
          let finalStatus = existingStatus;
          
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(
              Permissions.NOTIFICATIONS
            );
            console.log('-----')
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            ToastMessage('To receive push notifications, please allow permission from settings.');
            return '';
          }
          let token = await Notifications.getExpoPushTokenAsync();
          if (token && token.data) {
            Global.expoToken = token.data;
            return Global.expoToken;
          }
    
        } else {
            ToastMessage('Must use physical device for Push Notifications');
            return '';
        }
      };

    onSubmit = async () => {
        var deviceInfo = await getDeviceInfo();
        var push_token = await this.registerForPushNotificationsAsync();
        if (this.checkValidForm()) {
            let params = { username: this.state.username, password: this.state.password, notification_token: push_token, device_info: deviceInfo, app_version: Global.APP_VERSION};
            this.setState({ showIndicator: true })
            postData('login', params).then(async (res) => {
                if (this.state.rememberMe) {
                    await AsyncStorage.setItem('rememberData' + Global.LOCALSTORAGE, JSON.stringify(params));
                } else {
                    await AsyncStorage.removeItem('rememberData' + Global.LOCALSTORAGE);
                }

                this.setState({ showIndicator: false })
                if (res.status) {LOCALSTORAGE
                    await AsyncStorage.setItem('user' + Global.LOCALSTORAGE, JSON.stringify(res.data));
                    ToastMessage(res.message)
                    if (res.data.is_mobile_verified === 1) {
                        Images.currancyIcon = getCurrency(res.data.country_code)
                            

                        this.props.navigation.navigate('Home');
                    } else {
                        this.props.navigation.navigate('AddMobile');
                    }
                } else {
                    if(res.app_version && res.app_version === 'invalid'){
                        Alert.alert('Home Game', res.message, [{
                            text: 'OK', onPress: async () => {
                              console.log('here..')
                              Linking.openURL(res.link);
                
                            }
                          }
                          ])
                    }else{
                        ToastMessage(res.message, "error")
                    }
                }
            })
        }
    }

    checkValidForm = () => {
        //custom labels
        this.labels = {
            username: 'Username',
            password: 'Password'
        };
        //custom rules
        const defaultRules = {
            username: /^([a-zA-Z0-9-_]+)$/,
            length(length, value) {
                if (length === void (0)) {
                  throw 'ERROR: It is not a valid length, checkout your length settings.';
                } else if (value.length == length) {
                  return true;
                }
                return false;
            },
        };

        this.rules = {
            ...this.rules,
            ...defaultRules
        };

        //custom message
        this.messages.en['onlynumber'] = 'The {0} field must be a valid number.';
        this.messages.en['required'] = 'The {0} field is required.';
        this.messages.en['minlength'] = 'The {0} field length must be greater than {1}.';
        this.messages.en['username'] = 'The {0} can contain any letters from a to z, any numbers from 0 through 9, - (hyphen or dash) _ (underscore).';
        
        this.validate({
            username: { required: true, minlength: 5, username: true },
            password: { required: true }
        });

        if (this.isFormValid()) {
            return true;
        } else {
            var errorMessage = '';
            if (this.isFieldInError('username')) {
                errorMessage = this.getErrorsInField('username').join('\n');
            } else if (this.isFieldInError('password')) {
                errorMessage = this.getErrorsInField('password').join('\n');
            }
            ToastMessage(errorMessage, "error")
            return false;
        }
    }

    loginView = () => {
        const { showIndicator, username, password } = this.state;
        return (
            <ScrollView keyboardShouldPersistTaps='always' style={{ height: height, backgroundColor: '#FFF' }}>
                {showIndicator ? <Loader /> : null}
                <View style={{ flex: normalize(2.5), alignItems: 'center', alignContent: 'center' }}>
                    <View style={{
                        backgroundColor: '#1C2331',
                        height: normalize(550),
                        width: normalize(510),
                        marginTop: normalize(-300),
                        borderRadius: normalize(300),
                        overflow: 'hidden'
                    }}>
                        <ImageBackground source={Images.loginBG} style={{ height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', }} resizeMode="cover">
                            <Image
                                style={{ height: normalize(130), marginBottom: normalize(40) }}
                                source={Images.appLogo}
                                resizeMode="contain"
                            />
                        </ImageBackground>
                    </View>
                </View>
                <View style={{ flex: normalize(3.2), justifyContent: 'center', marginTop: normalize(50) }}>
                    <View style={Styles.loginform}>
                        <View style={[Styles.formGroupNew]}>
                        <TextInput
                                autoCapitalize='sentences'
                                maxLength={20}
                                style={[Styles.inputBoxStyle]}
                                label="Username"
                                value={username}
                                theme={{ colors: Layout.inputBoxTheme}}
                                onChangeText={text =>  this.setState({ username: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.user} />} style={Styles.inputLeftIcon}/>}
                            />

                        </View>
                        <View style={[Styles.formGroupNew, { position: 'relative' }]}>
                            <TextInput
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="Password"
                                value={password}
                                theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
                                onChangeText={text =>  this.setState({ password: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.lock} />} style={Styles.inputLeftIcon}/>}
                                right={<TextInput.Icon forceTextInputFocus={false} name={this.state.passwordViewIcon} style={{
                                    marginRight:-15
                                }} size={20} color={"#77869E"} onPress={() => {
                                    this.setState({ passwordViewIcon: (this.state.passwordViewIcon == 'eye') ? 'eye-off' : 'eye' }); 
                                }} />}
                                secureTextEntry={(this.state.passwordViewIcon == 'eye') ? false : true}
                            />
                           
                        </View>

                        <View style={[Styles.formGroup, { paddingBottom: normalize(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <CheckBox
                                containerStyle={styles.checkBoxContainer}
                                title='Remember me'
                                titleProps={{ fontSize: 20, fontWeight: '100' }}
                                textStyle={styles.checkBoxText}
                                checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={styles.checkBoxImage} />}
                                uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={styles.checkBoxImage} />}
                                checked={this.state.rememberMe}
                                onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}

                            />
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                <Text style={[Styles.font13, Styles.fontRegular, { textAlign: 'right', color: COLOR.BLACK_LIGHT }]}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.formGroup, { marginTop: normalize(10) }]}>
                            <RoundButton onPress={this.onSubmit} startColor="#2A395B" endColor="#080B12" label="LOGIN" />
                        </View>
                        <View style={[Styles.formInlineGroup, Styles.centerText]}>
                            <Text style={[Styles.font13, Styles.fontRegular, { color: COLOR.PRIMARY_LIGHT }]}>Don't Have an Account?</Text><TouchableOpacity onPress={() => { this.props.navigation.navigate('SignUp'); }}><Text style={[Styles.font13, Styles.fontBold, { color: COLOR.PRIMARY_DARK }]}> SIGN UP</Text></TouchableOpacity>
                        </View>

                        {/* <View style={[Styles.formInlineGroup, Styles.centerText, { marginTop: normalize(10), marginBottom: normalize(10) }]}>
                            <View style={{ borderWidth: normalize(3), borderColor: "#DCDCDC", width: '100%', height: normalize(1) }}></View>
                            <View style={{ position: 'absolute', backgroundColor: '#FFF', padding: normalize(10), borderRadius: normalize(50), bottom: normalize(5) }}>
                                <Text style={[Styles.font14, Styles.fontRegular, { textAlign: 'center', color: COLOR.PRIMARY }]}>OR</Text>
                            </View>
                        </View>

                        <View style={[Styles.formGroup]}>
                            <Text style={[Styles.font13, Styles.fontRegular, { textAlign: 'center', color: COLOR.PRIMARY }]}>Sign up with Social Networks</Text>
                        </View>

                        <View style={[Styles.tbRow, { justifyContent: 'space-around', marginTop: normalize(1) }]}>
                            <View style={[Styles.tbCol, { width: '48%' }]}>
                                <SocialButton onPress={this.logInWithFB.bind()} image={Images.fbIcon} fontSize={11} startColor="#164CBD" endColor="#164CBD" label="Sign in with facebook" />
                            </View>
                            <View style={[Styles.tbCol, { width: '48%' }]}>
                                <SocialButton onPress={this.signInAsync.bind()} image={Images.googleIcon} fontSize={11} startColor="#DD4B39" endColor="#DD4B39" label="Sign in with Google" />
                            </View>
                        </View> */}
                    </View>
                </View>
            </ScrollView>
        );
    }

    render() {
        return (
            <AppLayout children={this.loginView()} />
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
