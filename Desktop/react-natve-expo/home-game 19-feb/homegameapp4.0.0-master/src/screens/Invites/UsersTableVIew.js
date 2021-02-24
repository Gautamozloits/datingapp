/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput, StatusBar,
    Image, StyleSheet, Platform, ScrollView, Dimensions, Alert, ImageBackground
} from 'react-native';
import moment from "moment";

import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import Global from '../../../constants/Global';
import { SmallButton, PlainIcon, Checkbox, IconButton } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, PaymentFilter } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import { getUserDetail, getTotalUserOnSignleDate, postData, seatStatus, seatStatusLabel } from '../../api/service';
import ActionDropdown from '../../components/ActionDropdown';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
let screen_height = 0;
if (Platform.OS == 'android') {
    screen_height = height - StatusBar.currentHeight;
} else {
    screen_height = height;
}
const SCREEN_HEIGHT = screen_height;
export default class UsersTableVIew extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_date: '',
            date_1_selected: false,
            date_2_selected: false,
            date_3_selected: false,
            details: {},
            listRecords: [{ id: 1, request_status: 'clear' }, { id: 2, request_status: 'clear' }, { id: 3, request_status: 'waiting' }, { id: 4, request_status: 'waiting' }],
            gameDetails: {},
            user: {},
            showOwnerOptions: false,
            confirm_date: '',
            temp_confirm_date: '',
            contentStyle: {minHeight: normalize(40), maxHeight: normalize(350)}
        };
    }

    componentDidMount = async () => {
        let user = await getUserDetail();
        console.log(JSON.stringify(this.props.that.state.selectedGame))
        if(this.props.that.state.selectedGame.confirm_date_type){
           this.setState({temp_confirm_date: this.props.that.state.selectedGame.confirm_date_type,
            confirm_date: this.props.that.state.selectedGame.confirm_date_type}) 
        }
        this.setState({ gameDetails: this.props.that.state.selectedGame, user: user })

    }
    isGameOwner = () => {
        const { gameDetails, user } = this.state;
        if (gameDetails.hasOwnProperty('owner_id')) {
            if (gameDetails.owner_id === user.id) {
                return true;
            }
        }

        return false;
    }

    onRefresh = () => {
        this.setState({ refreshing: true })

        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 2000)
    }

    confirmGame = () => {
        const { gameDetails, user } = this.state;
        /*if(!this.state.confirm_date || this.state.confirm_date == ''){
            Alert.alert('Home Game', 'Are you sure want to deny this game?', [{
                text: 'Yes', onPress: async () => {
                    confirmGameFun;
                }
            },
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            ], { cancelable: false });
        }else{
            confirmGameFun;
        }*/
        
        
        this.props.that.setState({ showIndicator: true })
        let params = { game_id: gameDetails.game_id, confirm_date: this.state.confirm_date }
        postData('schedule-game/confirmGame', params).then(async (res) => {
            if (res.status) {
                //const { selectedGame } = this.props.that.state;
                this.props.that.setState({selectedGame: res.result})
                this.props.that.switchView('ViewTable', res.result)
                this.setState({temp_confirm_date:  res.result.confirm_date_type})
                ToastMessage(res.message);
            } else {
                ToastMessage(res.message, 'error');
            }
            this.props.that.setState({ showIndicator: false })
        })
    
    }
    thDate = (date_type) => {
        const { selectedGame } = this.props.that.state;
        const { gameDetails } = this.state;
        return (
            selectedGame[date_type] ?
                <View style={[styles.td, styles.tdCenter]}>
                    {(selectedGame.confirm_date_type === date_type) ? <View style={{ width: normalize(30), height: normalize(30), position: 'absolute', right: 0, top: 0 }}>
                    <ImageBackground source={Images.triangle_Confirmed} style={[{justifyContent:'flex-start', alignContent:'flex-end', alignItems:'flex-end'},{ width: '100%', height: '100%', top: 0, right: 0 }]} >
                        <Text style={[styles.text3]}>C</Text>
                    </ImageBackground>
                    </View> : null}
                    

                    <Text style={[styles.text1]}>{moment(selectedGame[date_type], 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
                    <Text style={[styles.text2]}>{moment(selectedGame[date_type], 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
                    <Text style={[styles.text2]}>{moment(selectedGame[date_type], 'YYYY-MM-DD HH:mm:ss').format('ddd')}</Text>
                    <View style={{ flexDirection: 'row' }}><PlainIcon name="check" color="#1BC773" type="FontAwesome5" fontSize={12} /><Text style={[styles.text2]}>{getTotalUserOnSignleDate(selectedGame.users, date_type)}</Text></View>
                </View>
                : null
        );
    }

    dateBox = (item, date_type, date_key) => {
        const { selectedGame } = this.props.that.state;
        let is_date_available = selectedGame[date_type];
        return (
            is_date_available ?
                <View style={[styles.td, styles.tdCenter, (item[date_key] == 'accepted') ? styles.bgGreen : styles.bgRed]}>
                    <View style={{ flexDirection: 'row' }}>
                        {(item[date_key] == 'accepted') ? <PlainIcon name="check" color="#1BC773" type="AntDesign" fontSize={20} /> :
                        (item[date_key] == 'decline') ? <PlainIcon name="close" color="#FF0000" type="AntDesign" fontSize={20} /> :
                        null}
                    </View>
                </View>
                : null
        );
    }

    selectConfirmDate = (date_type) => {
        console.log(this.state.confirm_date)
        if(this.state.confirm_date == date_type){
            this.setState({ confirm_date: '' })
        }else{
            this.setState({ confirm_date: date_type })
        }
        
    }
    confirmCheckBox = (date_type) => {
        const { selectedGame } = this.props.that.state;
        let is_date_available = selectedGame[date_type];
        var date_state = date_type + '_selected';
        const update = {};

        update[date_state] = !this.state[date_state];


        return (
            is_date_available ? <View style={[styles.td3, styles.tdCenter]}>
                <View style={{ flexDirection: 'row' }}>
                    <Checkbox
                        activeIcon='check-circle'
                        inactiveIcon='circle-o'
                        activeColor='#1BC773'
                        inactiveColor='#dddddd'
                        name="check"
                        checked={(this.state.confirm_date === date_type) ? true : false}
                        onPress={() => {
                                //(this.state.confirm_date == date_type) ? this.setState({ confirm_date: '' }) : this.setState({ confirm_date: date_type })
                                this.selectConfirmDate(date_type)
                                //this.setState({ confirm_date: date_type }) 
                            }
                        }
                        size={25} />
                </View>
            </View> : null
        )
    }

    footerRow() {
        var { confirm_date, temp_confirm_date } = this.state;
        return (<View key={'footer'} style={[styles.tr]}>
            <View style={[styles.td2, styles.inline, { justifyContent: 'center', alignItems: 'center', padding: 0 }]}>
                <View style={[{ justifyContent: 'center', alignItems: 'center', height: normalize(50), }]}>
                    {/* <SmallButton 
                    startColor={(confirm_date && confirm_date != '') ? "#2A395B" : '#F7F8F8'}
                    endColor={(confirm_date && confirm_date != '') ? "#080B12" : '#00000029'}
                    onPress={() => {
                        (confirm_date && confirm_date != '') ? this.confirmGame() : null                        
                    }} label="Confirm" fontSize={12} btnStyle={{ width: '100%' }} /> */}
                    {/* <SmallButton 
                    onPress={() => { this.confirmGame() }} label="Confirm" fontSize={12} btnStyle={{ width: '100%' }} /> */}
                    {(temp_confirm_date != confirm_date) ? <SmallButton 
                    onPress={() => { this.confirmGame() }} label="Confirm" fontSize={12} btnStyle={{ width: '100%' }} /> : <SmallButton 
                    label="Confirm" fontSize={12} btnStyle={{ width: '100%' }} 
                    startColor={'#dfdfdf'}
                    endColor={'#dfdfdf'}
                    />}
                </View>
            </View>
            {this.confirmCheckBox('date_1')}
            {this.confirmCheckBox('date_2')}
            {this.confirmCheckBox('date_3')}
        </View>);
    }


    renderRow = (item, index) => {
        const { selectedGame } = this.props.that.state;
        return (<View key={index} style={[styles.tr]}>
            <View style={[styles.td1, styles.inline, { alignItems: 'center', padding: 0 }]}>
                <View style={[{ flexDirection: 'row', width: '100%', height: normalize(50) }]}>
                    <View style={[{ alignItems: 'center', width: '75%', flexDirection: 'row', padding: 5 }]}>
                        <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.userImage} /><Text style={[styles.text4]} numberOfLines={1}>{item.name}</Text>
                    </View>
                    <View style={[Styles.tbCol, { width: '25%' }]}>

                        <View style={{ width: normalize(35), height: normalize(35), position: 'absolute', right: 0, top: 0 }}>
                            <ImageBackground source={Images['triangle_' + seatStatusLabel(item.seat_status_label)]} style={[{justifyContent:'flex-start', alignContent:'flex-end', alignItems:'flex-end'},{ width: '100%', height: '100%', top: 0, right: 0 }]} >
                            <Text style={[styles.text3]}>{seatStatus(item.seat_status_label)}</Text>
                            </ImageBackground>
                        </View>
                    </View>
                </View>
            </View>

            {this.dateBox(item, 'date_1', 'date_1_response')}
            {this.dateBox(item, 'date_2', 'date_2_response')}
            {this.dateBox(item, 'date_3', 'date_3_response')}
        </View>);
    }

    updateViewHeight(height) {
        //var  contentStyle  = this.state.contentStyle;
        var contentStyle = {minHeight: normalize(40), maxHeight: normalize(height-100)} 
        //contentStyle['maxHeight'] = height
        this.setState({contentStyle: contentStyle})
    }
    renderView = () => {
        const { listRecords, refreshing, showOwnerOptions } = this.state;
        const { selectedGame } = this.props.that.state;
        return (
            <View style={[styles.fixBox]}>
                <View style={styles.content}>
                    <View style={{ flex: 1 }}>
                        <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16, {padding:15}]}>Table View</Text>

                            {this.isGameOwner() ? <IconButton onPress={() => this.props.that.switchView('EditTable', selectedGame)} name="pencil-alt" color="#FFFFFF" type="FontAwesome5" fontSize={20} style={{padding:15}} /> : null}
                        </LinearGradient>
                        <View style={styles.innerSection} >

                            <View style={styles.content}>

                                <View style={[styles.table]}>
                                    <View style={[styles.tr]}>
                                        <View style={[styles.td1]}>

                                        </View>

                                        {this.thDate('date_1')}
                                        {this.thDate('date_2')}
                                        {this.thDate('date_3')}
                                    </View>
                                    <View style={[{flex:1 }]}>
                                        <ScrollView>
                                            {selectedGame.users.map((item, index) => {
                                                return ((!item.is_deleted) ? this.renderRow(item, index) : null)
                                            })}
                                            {this.isGameOwner() ? this.footerRow() : null}
                                        </ScrollView>                                       
                                    </View>
                                    

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );


    }

    render() {
        return (
            <ContainerTabScreen children={this.renderView()} styles={{ padding: normalize(20), paddingBottom: normalize(90) }} />
        );
    }
}
const styles = StyleSheet.create({
    table: {
        flex: 1
    },
    tr: {
        display: 'flex',
        flexDirection: 'row',
    },
    td: {
        flex: 1,
        borderColor: '#ededed',
        borderWidth: 0.5,
        padding: 5
    },
    td3: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: 'transparent',
        padding: 5
    },
    td1: {
        width: normalize(150),
        borderColor: '#ededed',
        borderWidth: 0.5,
        padding: 5
    },
    td2: {
        width: normalize(150),
        borderColor: 'transparent',
        borderWidth: 0.5,
        padding: 5
    },
    tdCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    tdCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inline: {
        flexDirection: 'row'
    },
    bgGreen: {
        backgroundColor: '#e9f9f1'
    },
    bgRed: {
        backgroundColor: '#FEECED'
    },
    text1: {
        ...Styles.green,
        ...Styles.fontBold,
        ...Styles.font12
    },
    text2: {
        ...Styles.textBlack,
        ...Styles.fontBold,
        ...Styles.font10
    },
    text3: {
        ...Styles.textWhite,
        ...Styles.fontBold,
        ...Styles.font10,
        //position: 'absolute',
        top: 3,
        right: 2
    },
    text4: {
        ...Styles.textPrimaryDark,
        ...Styles.fontMedium,
        ...Styles.font12,
        marginLeft: normalize(8),
        width: normalize(100)
    },
    triangle: {
        position: 'relative',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 30,
        borderTopWidth: 30,
        borderRightColor: 'transparent',
        borderTopColor: 'red'
    },
    triangleCornerTopRight: {
        transform: [
            { rotate: '90deg' }
        ]
    },
    triangleTopRight: {
        backgroundColor: '#1BC773',
        height: 30,
        width: 30,
        position: 'absolute',
        top: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fixBox: {
        flexGrow: 1,
        backgroundColor: '#FFF',
        borderRadius: 10,
        overflow: 'hidden',
        //marginBottom: 75,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    content: { 
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
},
    innerSection: {
        backgroundColor: '#FFF',
        flex: 1,
        height: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,

    },
    userImage: {
        width: normalize(30),
        height: normalize(30),
        borderRadius: 50
    },

});