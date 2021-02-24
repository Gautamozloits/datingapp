/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text, TextInput as TextInput2,
    View,
    Image, ImageBackground, Dimensions, TouchableOpacity, AsyncStorage, ScrollView, StyleSheet
} from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import COLOR from '../styles/Color';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import { RoundButton, InputIcon } from '../components/Buttons/Button';
import FormLayout from './Views/FormLayout';
import normalize from 'react-native-normalize';
import Layout from '../../constants/Layout';

import { postData } from '../api/guestService';

import { ToastMessage } from '../components/ToastMessage';
import { Loader } from '../components/Loader'
import Global from '../../constants/Global';

import { TextInput } from 'react-native-paper';



const { width, height } = Dimensions.get('window');

export default class SignUpScreen extends ValidationComponent {

    constructor(props) {
        super(props);
        this.recaptchaVerifier = React.createRef();
        this.password = '';
        this.state = {
            name: '',
            email: '',
            username: '',
            password: '',
            confirm_password: '',
            passwordViewIcon: 'eye-off',
            verification_code: '',
            verificationId: '',
            countryCode: "+91",
            showModal: false,
        };
    }

    componentDidMount() {

    }

    onSubmit = async () => {
        
        if (this.checkValidForm()) {
            if (this.state.password !== this.state.confirm_password) {
                let errorMessage = 'Password and Confirm Password fields must be the same ';
                ToastMessage(errorMessage, "error")
            } else {
                let params = { username: this.state.username };
                postData('can_create_account', params).then(async (res) => {
                    if (res.status) {
                        this.signUp();
                    } else {
                        this.setState({ showIndicator: false })
                        ToastMessage(res.message, "error")
                    }
                })
            }
        }
    }

    
    signUp = async () => {
      
            this.setState({ showIndicator: true })
            
            if (this.checkValidForm()) {
               
                let params = { name: this.state.name, username: this.state.username, password: this.state.password, notification_token: Global.expoToken };
                postData('register', params).then(async (res) => {
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
        
    }

    checkValidForm = () => {
        //custom labels
        this.labels = {
            name: 'Name',
            username: 'Username',
            password: 'Password',
            confirm_password: 'Confirm Password'
        };
        //custom rules
        const defaultRules = {
            chars: /^[a-z][a-z\s]*$/i,
            onlynumber: /^\d+$/,
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
        this.messages.en['chars'] = 'The {0} field must contain only letters.';
        this.messages.en['onlynumber'] = 'The {0} field must be a valid number.';
        this.messages.en['required'] = 'The {0} field is required.';
        this.messages.en['length'] = 'The {0} field length must be {1}.';
        this.messages.en['minlength'] = 'The {0} field length must be greater than {1}.';
        this.messages.en['username'] = 'The {0} can contain any letters from a to z, any numbers from 0 through 9, - (hyphen or dash) _ (underscore).';

        this.validate({
            name: {  chars: true },
            username: { required: true, minlength: 5, username: true },
            password: { required: true },
            confirm_password: { equalPassword:this.state.password }
        });

        if (this.isFormValid()) {
            return true;
        } else {
            var errorMessage = '';
            if (this.isFieldInError('name')) {
                errorMessage = this.getErrorsInField('name').join('\n');
            } else if (this.isFieldInError('username')) {
                errorMessage = this.getErrorsInField('username').join('\n');
            }
            else if (this.isFieldInError('password')) {
                errorMessage = this.getErrorsInField('password').join('\n');
            } else if (this.isFieldInError('confirm_password')) {
                errorMessage = 'Password and Confirm Password fields must be the same.';
            }

            ToastMessage(errorMessage, "error")
            return false;
        }
    }

    loginView = () => {
        const { showIndicator, name, email, username, password, confirm_password, showModal, countryCode } = this.state;

        return (
            <ScrollView keyboardShouldPersistTaps='always' style={{ height: height, backgroundColor: '#FFF' }}>
               
                {showIndicator ? <Loader /> : null}
                <View style={{ flex: normalize(2.5), alignItems: 'center', alignContent: 'center' }}>
                    <View style={{
                        backgroundColor: '#1C2331',
                        height: normalize(510),
                        width: normalize(510),
                        marginTop: normalize(-300),
                        borderRadius: normalize(300),
                        overflow: 'hidden'
                    }}>
                        <ImageBackground source={Images.loginBG} style={{ height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }} resizeMode="cover">
                            <Image
                                style={{ height: normalize(130), marginBottom: normalize(40) }}
                                source={Images.appLogo}
                                resizeMode="contain"
                            />
                        </ImageBackground>
                    </View>
                </View>

                    <View style={{ flex: normalize(3.5), justifyContent: 'center', marginTop: normalize(50) }}>
                        <View style={Styles.loginform}>
                            <View style={[Styles.formGroupNew]}>
                            <TextInput
                                autoCapitalize='words'
                                maxLength={50}
                                style={[Styles.inputBoxStyle]}
                                label="Name"
                                value={name}
                                theme={{ colors: Layout.inputBoxTheme}}
                                onChangeText={text =>  this.setState({ name: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.user} />} style={Styles.inputLeftIcon}/>}
                            />

                            </View>

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

                            <View style={[Styles.formGroupNew]}>
                                <TextInput
                                    autoCapitalize='none'
                                    style={Styles.inputBoxStyle}
                                    label="Password"
                                    value={password}
                                    maxLength={50}
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

                            <View style={[Styles.formGroup]}>
                                <TextInput
                                    autoCapitalize='none'
                                    style={Styles.inputBoxStyle}
                                    label="Confirm Password"
                                    value={confirm_password}
                                    maxLength={50}
                                    theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
                                    onChangeText={text =>  this.setState({ confirm_password: text })}
                                    left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.lock} />} style={Styles.inputLeftIcon}/>}
                                    secureTextEntry={true}
                                />
                                    
                            
                            </View>

                            <View style={[Styles.formGroup, { marginTop: normalize(5) }]}>
                                <RoundButton onPress={this.onSubmit} startColor="#2A395B" endColor="#080B12" label="Register" />
                            </View>
                            <View style={[Styles.formInlineGroup, Styles.centerText]}>
                                <Text style={[Styles.font13, Styles.fontRegular, { color: COLOR.PRIMARY_LIGHT }]}>Already Have an Account?</Text><TouchableOpacity onPress={() => { this.props.navigation.navigate('Login'); }}><Text style={[Styles.font13, Styles.fontBold, { color: COLOR.PRIMARY_DARK }]}> LOGIN</Text></TouchableOpacity>
                            </View>

                        </View>

                    </View>

            </ScrollView>
        );
    }
    render() {

        return (
            <FormLayout children={this.loginView()} />
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
    input: {
        width: "100%",
        height: normalize(60),
        borderColor: 'transparent',
        borderBottomColor: '#A2A2A2',//#042C5C
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        borderWidth: 1,
        color: COLOR.PRIMARY_DARK,
        borderRadius: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})