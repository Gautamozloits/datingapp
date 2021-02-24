/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { Header, useHeaderHeight } from 'react-navigation-stack';
import normalize from 'react-native-normalize';
import { postWithFile, getUserDetail, postData } from '../../api/service';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import Global from '../../../constants/Global';
import FloatingLabel from '../../components/FloatingLabel';
import { RoundButton, IconButton } from '../../components/Buttons/Button';
import ContainerFixScreen from '../Views/ContainerFixScreen';

const { width, height } = Dimensions.get('window');

export default class Profile extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerTitle: () => <Text style={Styles.headerTitle}>Profile</Text>,
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={Images.menuIcon} style={{ height: 20 }} resizeMode="contain" />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getUser();
        })
    }

    componentDidMount = async () => {

        this.getUser();
    }
    getUser = async () => {
        let user = await getUserDetail();
        this.setState({ user: user })
    }
    renderView = () => {
        const { user } = this.state;
        return (
            <>
                <View style={{ height: height }}>
                    <View style={{ flex: normalize(2.5), alignItems: 'center', alignContent: 'center' }}>
                        <View style={{
                            backgroundColor: '#1C2331',
                            height: normalize(500),
                            width: normalize(500),

                            //marginLeft: -20,
                            marginTop: normalize(-250),
                            borderRadius: normalize(300),
                            overflow: 'hidden'
                        }}>
                            <ImageBackground source={Images.loginBG} style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }} resizeMode="cover">

                                <View style={styles.imageContainer}>
                                    <Image
                                        style={{ width: normalize(100), height: normalize(100), borderRadius: 50 }}
                                        source={(user.image && user.image !== "") ? { uri: Global.ROOT_PATH + user.image } : Images.userImage}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('EditProfile')}
                                        style={{
                                            backgroundColor: '#fff', borderRadius: 50, padding: 8, elevation: 5,
                                            position: 'absolute',
                                            //alignSelf:'flex-end',
                                            marginLeft: normalize(80),
                                        }}
                                    >
                                        <Entypo name="edit" size={15} color="black" />
                                    </TouchableOpacity>

                                </View>
                                <View style={[Styles.centerText, { marginTop: 10 }]}>
                                    <Text style={[Styles.font16, Styles.textWhite, Styles.fontBold]}>{user.name}</Text>
                                    <Text style={[Styles.font14, Styles.textWhite, Styles.fontMedium]}>{user.email}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                    <View style={{ flex: normalize(3.5), justifyContent: 'flex-start' }}>
                        <View style={{ marginTop: 20 }}>
                            <View style={[Styles.formGroup]}>
                                <FloatingLabel
                                    onPress={() => this.props.navigation.navigate('MyAccount')}
                                    other={true}
                                    icon={Images.user}
                                    style={{ backgroundColor: '#F7F8F8' }}
                                    labelStyle={[Styles.fontMedium, Styles.font14, Styles.textPrimaryDark]}
                                >My Account</FloatingLabel>
                            </View>

                            {/* <View style={[Styles.formGroup]}>
                                <FloatingLabel
                                    other={true}
                                    icon={Images.groupIcon}
                                    style={{ backgroundColor: '#F7F8F8' }}
                                    labelStyle={[Styles.fontMedium, Styles.font14, Styles.textPrimaryDark]}
                                >Manage User Groups</FloatingLabel>
                            </View>

                            <View style={[Styles.formGroup]}>
                                <FloatingLabel
                                    other={true}
                                    icon={Images.locationOnIcon}
                                    style={{ backgroundColor: '#F7F8F8' }}
                                    labelStyle={[Styles.fontMedium, Styles.font14, Styles.textPrimaryDark]}
                                >Manage Saved Locations</FloatingLabel>
                            </View>

                            <View style={[Styles.formGroup]}>
                                <FloatingLabel
                                    other={true}
                                    icon={Images.locationOnIcon}
                                    style={{ backgroundColor: '#F7F8F8' }}
                                    labelStyle={[Styles.fontMedium, Styles.font14, Styles.textPrimaryDark]}
                                >Notification</FloatingLabel>
                            </View> */}






                        </View>
                    </View>
                </View>
            </>
        );
    }
    render() {
        return (
            <ContainerFixScreen children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        marginTop: normalize(300),
        borderRadius: 50,
        justifyContent: 'center'
        // overflow: 'hidden',
    }
});