/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, AsyncStorage,
    Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity
} from 'react-native';
import Styles from '../../styles/Styles';
import FixScreenWithoutPadding from '../Views/FixScreenWithoutPadding';
import { postWithFile, getUserDetail, postData } from '../../api/service';
import { HeaderBG, HeaderLeftBack } from '../../components/HeaderOptions';
import { Loader } from '../../components/Loader';
import { ToastMessage } from '../../components/ToastMessage';
import Global from '../../../constants/Global';
import { TextInput } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default class MyAccount extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>My Account</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
            headerBackTitle: " ",

        };
    };
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            phone_number: '',
            nickname: '',
            user: {},
            autoFocus: false,
            isModalVisible: false,
            pickedImage: null,
        }
    }

    componentDidMount = async () => {
        let user = await getUserDetail();

        this.setState({ user: user, phone_number: (user.phone_number) ? user.phone_number : 'N/A', nickname: (user.nickname) ? user.nickname : 'N/A', email: (user.email) ? user.email : 'N/A' })
        setTimeout(() => {
            this.setState({ autoFocus: true });
        }, 100)
    }

    checkValidForm() {
        if (this.state.name === '') {
            ToastMessage('Please enter name', 'error')
            return false;
        } else if (this.state.nickname === '') {
            ToastMessage('Please enter nickname', 'error')
            return false;
        }
        return true;
    }

    updateProfile = () => {
        if (this.checkValidForm()) {
            this.setState({ loading: true })
            const data = new FormData();

            data.append('name', this.state.name);
            data.append('path', 'users');
            data.append('nickname', this.state.nickname);
            if (this.state.pickedImage) {
                data.append('image', this.state.pickedImage);
            }
            postWithFile('update-profile', data).then(async (res) => {
                if (res.status) {
                    ToastMessage(res.message)
                    await AsyncStorage.setItem('user' + Global.LOCALSTORAGE, JSON.stringify(res.data));
                    this.props.navigation.navigate('Profile')
                } else {
                    ToastMessage(res.message, "error")
                }
                this.setState({ loading: false })
            })
        }

    }
    openModal = () => {
        this.setState({ isModalVisible: true });
    }
    skipModal() {
        this.setState({ isModalVisible: false });
    }

    renderView = () => {
        const { user, isModalVisible, pickedImage, loading } = this.state;
        return (
            <>
                {(loading) ? <Loader /> : null}
                <View style={{ height: height, padding: 15 }}>

                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <View style={{ marginTop: 20 }}>


                            <View style={[Styles.formGroup]}>
                                <TextInput
                                editable={false}
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="Password"
                                value={'********'}
                                theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
                                onChangeText={text =>  this.setState({ password: text })}
                                right={
                                    <TextInput.Icon 
                                        forceTextInputFocus={false} 
                                        name={'pencil'} 
                                        style={{ marginRight:-15 }} 
                                        size={20} 
                                        color={"#77869E"} 
                                        onPress={() => {
                                            this.props.navigation.navigate('ChangePassword') 
                                        }} 
                                    />
                                }
                                secureTextEntry={true}
                            />
                            </View>

                            <View style={[Styles.formGroup]}>
                            <TextInput
                                editable={false}
                                autoCapitalize='none'
                                style={Styles.inputBoxStyle}
                                label="Mobile Number"
                                value={this.state.phone_number}
                                theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
                            />
                            </View>



                        </View>

                    </View>

                </View>
            </>
        );
    }
    render() {
        return (
            <FixScreenWithoutPadding children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        borderRadius: 50,
        justifyContent: 'center'
        // overflow: 'hidden',
    }
});