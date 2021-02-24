/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, AsyncStorage,
    Image, ImageBackground, StyleSheet, Dimensions, ScrollView, TouchableOpacity, StatusBar
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { Header, useHeaderHeight } from 'react-navigation-stack';
import normalize from 'react-native-normalize';
import { postWithFile, getUserDetail, postData } from '../../api/service';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { ImageModal } from '../../components/ImageModal';
import { RoundButton, IconButton } from '../../components/Buttons/Button';
import FormLayout from '../Views/FormLayout';
import { HeaderBG, HeaderLeftBack } from '../../components/HeaderOptions';
import { Loader } from '../../components/Loader';
import { ToastMessage } from '../../components/ToastMessage';
import Global from '../../../constants/Global';

const { width, height } = Dimensions.get('window');
var barHeight = 0;
if (Platform.OS == 'android') {
    barHeight = StatusBar.currentHeight;
}

export default class EditProfile extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Profile Details</Text>,
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
            nickname: '',
            user: {},
            autoFocus: false,
            isModalVisible: false,
            pickedImage: null,
        }
    }

    componentDidMount = async () => {
        let user = await getUserDetail();
        this.setState({ user: user, name: user.name, nickname: user.nickname })
        setTimeout(() => {
            this.setState({ autoFocus: true });
        }, 100)
    }

    checkValidForm() {
        if (this.state.name === '') {
            ToastMessage('Please enter name', 'error')
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
            if (this.state.nickname || this.state.nickname == '') {
                data.append('nickname', this.state.nickname);
            }
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
            <ScrollView keyboardShouldPersistTaps='always'  style={{flex:1}}>
                {(loading) ? <Loader /> : null}
                <View style={{ height: height - (barHeight + 55), padding: 15 }}>
                    <View style={{ flex: 1, alignItems: 'center', alignContent: 'center', marginTop: 30 }}>

                        <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }} >

                            <View style={styles.imageContainer}>
                                <Image
                                    style={{ width: normalize(100), height: normalize(100), borderRadius: 50 }}
                                    source={(pickedImage && pickedImage.uri !== "") ? { uri: pickedImage.uri } : (user.image) ? { uri: Global.ROOT_PATH + user.image } : (Images.userImage)}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={() => this.openModal()}
                                    style={{
                                        backgroundColor: '#fff', borderRadius: 50, padding: 8, elevation: 5,
                                        position: 'absolute',
                                        marginLeft: normalize(80),
                                    }}>
                                    <Entypo name="camera" size={15} color="black" />
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                    <View style={{ flex: 4, justifyContent: 'flex-start' }}>
                        <View style={{ marginTop: 20 }}>
                            <View style={[Styles.formGroup]}>
                                <TextInput
                                    autoCapitalize='words'
                                    autoFocus={this.state.autoFocus}
                                    style={Styles.inputBoxStyle}
                                    label="Name"
                                    value={this.state.name}
                                    maxLength={50}
                                    theme={{ colors: { primary: "#042C5C", placeholder: '#77869E' } }}
                                    onChangeText={text => this.setState({ name: text })}
                                />


                            </View>
                            <View style={[Styles.formGroup]}>
                                <TextInput
                                    autoCapitalize='words'
                                    autoFocus={this.state.autoFocus}
                                    style={Styles.inputBoxStyle}
                                    label="Nickname"
                                    value={this.state.nickname}
                                    maxLength={50}
                                    theme={{ colors: { primary: "#042C5C", placeholder: '#77869E' } }}
                                    onChangeText={text => this.setState({ nickname: text })}
                                />
                            </View>
                        </View>

                    </View>
                    <ImageModal type={"user"} that={this} isVisible={isModalVisible} />
                    <View style={[Styles.formGroup, { flex: 1 }]}>
                        <RoundButton onPress={() =>
                            this.updateProfile()
                        } startColor="#2A395B" endColor="#080B12" label={'UPDATE'} fontSize={16} />
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
    imageContainer: {
        borderRadius: 50,
        justifyContent: 'center'
        // overflow: 'hidden',
    }
});