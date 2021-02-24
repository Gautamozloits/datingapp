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
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

import * as GoogleSignIn from 'expo-google-sign-in';
import { CheckBox } from 'react-native-elements'
import { TextInput } from 'react-native-paper';

import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { RoundButton, InputIcon } from '../../components/Buttons/Button';
import FixScreenWithoutPadding from '../Views/FixScreenWithoutPadding';
import normalize from 'react-native-normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ValidationComponent from 'react-native-form-validator';
import { HeaderBG, HeaderLeftBack } from '../../components/HeaderOptions';

import { postData } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';
import { Loader } from '../../components/Loader';
import FormLayout from '../Views/FormLayout';

const { width, height } = Dimensions.get('window');

export default class ChangePasswordScreen extends ValidationComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Change Password</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
            headerBackTitle: " ",
        };
    };

    state = {
        email: '',
        otp: '',
        oldpassword:'',
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
        let email ='';
        this.setState({email: email})
        //this.initAsync();
    }
    
    onSubmit = async () => {
        
        if (this.checkValidForm()) {
            if (this.state.password !== this.state.confirm_password) {
                let errorMessage = 'New Password and confirm password must be the same';
                ToastMessage(errorMessage, "error")
            } else {
                let params = { oldpassword: this.state.oldpassword, newpassword: this.state.password, confirmpassword: this.state.confirm_password};
                this.setState({ showIndicator: true })
                postData('change-password', params).then(async (res) => {
                    
                    this.setState({ showIndicator: false })
                    if (res.status) {
                        ToastMessage(res.message)
                        this.props.navigation.navigate('Profile')
                    } else {
                        ToastMessage(res.message, "error")
                    }
                })
            }
            
        }
    }


    checkValidForm = () => {
        this.validate({
            oldpassword: { required: true },
            password: { required: true },
            confirm_password: { required: true }
        });

        if (this.isFormValid()) {
            return true;
        } else {
            var errorMessage = '';
            if (this.isFieldInError('oldpassword')) {
                errorMessage = 'The current password field is required';
            } else if (this.isFieldInError('password')) {
                errorMessage = 'The password field is required';
            } else if (this.isFieldInError('confirm_password')) {
                errorMessage = 'The confirm password field is required';
            }
            ToastMessage(errorMessage, "error")
            return false;
        }
    }

    renderView = () => {
        const { showIndicator, otp, password,oldpassword, confirm_password } = this.state;
        return (
            <ScrollView keyboardShouldPersistTaps='always'  style={{flex:1}}>
            <View style={{ height: height, backgroundColor: '#FFF' }}>
                {showIndicator ? <Loader /> : null}
                <View style={[{ flex: 2.2}, Styles.centerText]}>
                   <Image source={Images.forgotPassword2} resizeMode="contain" style={{width:normalize(170), height:normalize(170)}}/>
                </View>
                <View style={{ flex: 3.8, padding: 15 }}>
                    <Text style={[Styles.font18, Styles.textGray, Styles.fontMedium]}>Change your password here.</Text>
                        
                        <View style={[Styles.formGroup, {marginTop:10}]}>
                            <TextInput
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="Current Password"
                                value={oldpassword}
                                maxLength={50}
                                theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
                                onChangeText={text =>  this.setState({ oldpassword: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.lock} />} style={Styles.inputLeftIcon}/>}
                                secureTextEntry={true}
                            />

                            {/* <FloatingLabel
                                icon={Images.lock}
                                maxLength={10}
                                onChangeText={value => {
                                    this.setState({ oldpassword: value });
                                }}
                                value={oldpassword}
                                refer='oldpassword'
                                autoFocus={this.state.autoFocus}
                                required={true}
                                labelStyle={[Styles.fontRegular, Styles.font14]}
                                autoCapitalize='none'
                                secureTextEntry={true}
                            >Current Password</FloatingLabel> */}
                        </View>

                        <View style={[Styles.formGroup]}>
                            <TextInput
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="New Password"
                                value={password}
                                maxLength={50}
                                theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
                                onChangeText={text =>  this.setState({ password: text })}
                                left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.lock} />} style={Styles.inputLeftIcon}/>}
                                secureTextEntry={true}
                            />
                            {/* <FloatingLabel
                                icon={Images.lock}
                                maxLength={10}
                                onChangeText={value => {
                                    this.setState({ password: value });
                                }}
                                value={password}
                                refer='password'
                                autoFocus={this.state.autoFocus}
                                required={true}
                                labelStyle={[Styles.fontRegular, Styles.font14]}
                                autoCapitalize='none'
                                secureTextEntry={true}
                            >New Password</FloatingLabel> */}
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
                                right={<TextInput.Icon forceTextInputFocus={false} name={this.state.passwordViewIcon} style={{
                                    marginRight:-15
                                }} size={20} color={"#77869E"} onPress={() => {
                                    this.setState({ passwordViewIcon: (this.state.passwordViewIcon == 'eye') ? 'eye-off' : 'eye' }); 
                                }} />}
                                secureTextEntry={(this.state.passwordViewIcon == 'eye') ? false : true}
                            />

                            {/* <FloatingLabel
                                icon={Images.lock}
                                maxLength={10}
                                onChangeText={value => {
                                    this.setState({ confirm_password: value });
                                }}
                                value={confirm_password}
                                refer='confirm_password'
                                autoFocus={this.state.autoFocus}
                                required={true}
                                autoCapitalize='none'
                                labelStyle={[Styles.fontRegular, Styles.font14]}
                                leftIcon={this.state.passwordViewIcon}
                                onLeftPress={() => this.setState({passwordViewIcon:(this.state.passwordViewIcon == 'eye') ? 'eye-slash' : 'eye'})}
                                secureTextEntry={(this.state.passwordViewIcon == 'eye') ? false : true}
                            >Re-enter Password</FloatingLabel> */}
                        </View>
                    
                        <View style={[Styles.formGroup, {marginTop:normalize(20)}]}>
                            <RoundButton onPress={this.onSubmit} startColor="#2A395B" endColor="#080B12" label="Change Password" />
                        </View>

                        

                </View>
            </View>
            </ScrollView>
        );
    }
    render() {
        return (
            <FormLayout offset={70} children={this.renderView()} />
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