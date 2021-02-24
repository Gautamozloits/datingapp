/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { Header, useHeaderHeight } from 'react-navigation-stack';
import { CheckBox } from 'react-native-elements'

import { Ionicons, AntDesign } from '@expo/vector-icons';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { SmallButton, PlainIcon, SwitchExample } from '../../components/Buttons/Button';
import ContainerListScreen from '../Views/ContainerListScreen';
import { HeaderBG, HeaderLeftBack } from '../../components/HeaderOptions';
import { postData, getUserDetail } from '../../api/service';
import { Loader } from '../../components/Loader'
import { ToastMessage } from '../../components/ToastMessage';
import Global from '../../../constants/Global';
import normalize from 'react-native-normalize';

const { width, height } = Dimensions.get('window');

export default class GameSettings extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Settings</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
            headerBackTitle: " ",
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            saveBtn: 'Save',
            showIndicator: false,
            switch1Value: false,
            hidden_pols:false,
            open_invitation: true,
            date_selection: false,
            auto_confirm: false,
            quorum_user_count:8,
            isEditable: false
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const { params } = this.props.navigation.state;
            if (params) {
                if (params.settings.quorum_user_count) {
                    this.renderSettings(params.settings)
                }
            }
        });
        
    }

    renderSettings = async (settings) => {
        this.setState({
            hidden_pols: (settings.hidden_pols == 1) ? true : false,
            open_invitation: (settings.open_invitation == 1) ? true : false,
            date_selection: (settings.date_selection === 'single') ? true : false,
            auto_confirm: (settings.auto_confirm == 1) ? true : false,
            quorum_user_count: settings.quorum_user_count,
        })
    }
    updateSetting = () => {
        
        let params = {
            hidden_pols: (this.state.hidden_pols) ? 1 : 0,
            open_invitation: (this.state.open_invitation) ? 1 : 0,
            date_selection: (this.state.date_selection) ? 'single' : 'multiple',
            auto_confirm: (this.state.auto_confirm) ? 1 : 0,
            quorum_user_count: this.state.quorum_user_count,
        };
        this.props.navigation.navigate('CreateScheduleGame', { settings: params })

    }

    toggleSwitch1 = (value) => {
        this.setState({ hidden_pols: value })
    }
    toggleSwitch2 = (value) => {
        this.setState({ open_invitation: value })
    }
    toggleSwitch3 = (value) => {
        this.setState({ date_selection: value })
    }
    toggleSwitch4 = (value) => {
        this.setState({ auto_confirm: value })
    }

    renderView = () => {
        const { quorum_user_count, showIndicator } = this.state;
        return (
            <>
                {showIndicator ? <Loader /> : null}
                <View style={styles.content}>
                    <View style={{ flex: 5.5 }}>

                        <ScrollView style={[{ flex: 1 }]}>
                            <View style={styles.content}>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.cancelEye} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Hidden Poll</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#77869e'
                                                            falseColor='#e9ebee'
                                                            thumbColor='#77869e'
                                                            toggleSwitch1={this.toggleSwitch1}
                                                            switch1Value={this.state.hidden_pols} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Player's name and votes are confidential, Only you can see the results</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.invitationIcon} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Open Invitation</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#1bc773'
                                                            falseColor='#b4ffd9'
                                                            thumbColor='#1bc773'
                                                            toggleSwitch1={this.toggleSwitch2}
                                                            switch1Value={this.state.open_invitation} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Player can invite other players to the game</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.calander} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Limit One Date Selection</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#1bc773'
                                                            falseColor='#b4ffd9'
                                                            thumbColor='#1bc773'
                                                            toggleSwitch1={this.toggleSwitch3}
                                                            switch1Value={this.state.date_selection} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Player's can select only one of the dates</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <PlainIcon type="Image" name={Images.arrowSquare} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Automatically Confirm Game</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#1bc773'
                                                            falseColor='#b4ffd9'
                                                            thumbColor='#1bc773'
                                                            toggleSwitch1={this.toggleSwitch4}
                                                            switch1Value={this.state.auto_confirm} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Automatically confirm the game when the quorum is reached</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '70%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.twoUser} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>No of Players For Full Quorum</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '30%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <View style={{flexDirection:'row'}}>
                                                            <TouchableOpacity onPress={() => (quorum_user_count > 2) ? this.setState({quorum_user_count: parseInt(quorum_user_count)-1}) : null} 
                                                            style={{justifyContent:'center', backgroundColor:'#1bc773', padding:normalize(10), borderTopLeftRadius:15, borderBottomLeftRadius:15}}
                                                            >
                                                                <PlainIcon name="minus" fontSize={normalize(12)} color="#FFF" />
                                                            </TouchableOpacity>
                                                            <View style={[Styles.centerText, {width:normalize(25), backgroundColor:'#e9f9f1', width:normalize(30)}]}>
                                                                <TextInput
                                                                    defaultValue={quorum_user_count}
                                                                    value={`${quorum_user_count}`}
                                                                    onChangeText={(value) => this.setState({quorum_user_count: value})} 
                                                                    maxLength={3}
                                                                    keyboardType={"numeric"}
                                                                    style={[Styles.green, Styles.fontBold, Styles.font12, {width:'100%', textAlign:'center'}]}
                                                                    //style={[Styles.inputField]}
                                                                /> 
                                                                {/*<Text style={[Styles.green, Styles.fontBold, Styles.font12]}>{quorum_user_count}</Text> */}

                                                            </View>
                                                            <TouchableOpacity onPress={() => this.setState({quorum_user_count: parseInt(quorum_user_count)+1})} style={{justifyContent:'center', backgroundColor:'#1bc773', padding:normalize(10), borderTopRightRadius:15, borderBottomRightRadius:15}}>
                                                                <PlainIcon name="plus" fontSize={normalize(12)} color="#FFF" />
                                                            </TouchableOpacity>
                                                            
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Max number of players needed to confirm the game and close the table</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                        
                    </View>
                    <View style={{paddingBottom: 0, flex:0.5}}>
                            <View style={[styles.box, { justifyContent: 'center' }]}>
                                <SmallButton onPress={() => {
                                    this.updateSetting()
                                }} label={this.state.saveBtn} fontSize={12} btnStyle={{ width: '30%', height: 30 }} />
                            </View>
                        </View>
                </View>
            </>
        );
    }
    render() {
        return (
            <ContainerListScreen children={this.renderView()} styles={{ padding: 25, backgroundColor: '#fff' }} />
        );
    }
}

const styles = StyleSheet.create({
    content: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column' },
    box: { width: '100%', flex: 1, flexDirection: 'row' },
    boxContent: {
        paddingTop: 10,
    }
})