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

import { TextInput } from 'react-native-paper';
import COLOR from '../styles/Color';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import { RoundButton, InputIcon } from '../components/Buttons/Button';
import AppLayout from './Views/AppLayout';
import normalize from 'react-native-normalize';
import ValidationComponent from 'react-native-form-validator';
import { HeaderBG, HeaderLeftBack } from '../components/HeaderOptions';
import { postData } from '../api/service';
import { ToastMessage } from '../components/ToastMessage';
import { Loader } from '../components/Loader'
const { width, height } = Dimensions.get('window');

export default class ResetPasswordScreen extends ValidationComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Reset Password</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
        };
    };

    state = {
        user_id: '',
        otp: '',
        password: '',
        confirm_password: '',
        showIndicator: false,
        autoFocus: false,
        passwordViewIcon: 'eye-off'
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let user_id = this.props.navigation.state.params.user_id;
        this.setState({ user_id: user_id })
        //this.initAsync();
    }

    /**
     * Update new password
     */
    onSubmit = async () => {

        if (this.checkValidForm()) {
            if (this.state.password !== this.state.confirm_password) {
                let errorMessage = 'Password and Confirm Password fields must be the same';
                ToastMessage(errorMessage, "error")
            } else {
                let params = { user_id: this.state.user_id, otp: this.state.otp, newpassword: this.state.password };
                console.log(params);
                this.setState({ showIndicator: true })
                postData('reset-password', params).then(async (res) => {
                    console.log(res)
                    this.setState({ showIndicator: false })
                    if (res.status) {
                        ToastMessage(res.message)
                        this.props.navigation.navigate('Login');
                    } else {
                        ToastMessage(res.message, "error")
                    }
                })
            }

        }
    }

    /**
     * check form validation
     */
    checkValidForm = () => {
        this.validate({
            password: { required: true },
            confirm_password: { required: true }
        });

        if (this.isFormValid()) {
            return true;
        } else {
            var errorMessage = '';
            if (this.isFieldInError('password')) {
                errorMessage = 'The password field is required';
            } else if (this.isFieldInError('confirm_password')) {
                errorMessage = 'The confirm password field is required';
            }
            ToastMessage(errorMessage, "error")
            return false;
        }
    }

    renderView = () => {
        const { showIndicator, otp, password, confirm_password } = this.state;
        return (
            <ScrollView keyboardShouldPersistTaps='always' style={{ height: '100%' }} keyboardVerticalOffset={0} behavior="padding" enabled>
                <View style={{ height: height - 50, backgroundColor: '#FFF' }}>
                    {showIndicator ? <Loader /> : null}
                    <View style={[{ flex: 2.5 }, Styles.centerText]}>
                        <Image source={Images.forgotPassword2} resizeMode="contain" style={{ width: normalize(170), height: normalize(170) }} />
                    </View>
                    <View style={{ flex: 3.5, justifyContent: 'center', padding: 15 }}>
                        <Text style={[Styles.font18, Styles.textGray, Styles.fontMedium]}>Reset your password here.</Text>
                        <Text style={[Styles.font16, Styles.textGrayLight, Styles.fontRegular, { marginTop: 5 }]}>We have sent a verification code to your registered email ID.</Text>

                        <View style={[Styles.formGroupNew]}>
                            <TextInput
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="Password"
                                value={password}
                                maxLength={50}
                                theme={{ colors: { primary: "#042C5C", placeholder: '#77869E' } }}
                                onChangeText={text => this.setState({ password: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.lock} />} style={Styles.inputLeftIcon} />}
                                right={<TextInput.Icon forceTextInputFocus={false} name={this.state.passwordViewIcon} style={{
                                    marginRight: -15
                                }} size={20} color={"#77869E"} onPress={() => {
                                    this.setState({ passwordViewIcon: (this.state.passwordViewIcon == 'eye') ? 'eye-off' : 'eye' });
                                }} />}
                                secureTextEntry={(this.state.passwordViewIcon == 'eye') ? false : true}
                            />

                            <View style={[Styles.formGroup]}>
                                <TextInput
                                    autoCapitalize='none'
                                    style={Styles.inputBoxStyle}
                                    label="Confirm Password"
                                    value={confirm_password}
                                    maxLength={50}
                                    theme={{ colors: { primary: "#042C5C", placeholder: '#77869E' } }}
                                    onChangeText={text => this.setState({ confirm_password: text })}
                                    left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.lock} />} style={Styles.inputLeftIcon} />}
                                    secureTextEntry={true}
                                />


                            </View>

                            <View style={[Styles.formGroup, { marginTop: normalize(20) }]}>
                                <RoundButton onPress={this.onSubmit} startColor="#2A395B" endColor="#080B12" label="Change Password" />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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