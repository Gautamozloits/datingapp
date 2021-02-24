/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput, ImageBackground,
    Image, StyleSheet, ScrollView, TouchableHighlight
} from 'react-native';
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';
import { getData, postData, getTotalUserOnSignleDate, getTotalValidUsers, seatStatusLabel, seatStatus } from '../../api/service';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import Global from '../../../constants/Global';
import { SmallButton, PlainIcon, TextButton, UserCircleButton } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';

import { AddNewPersonModal } from '../Comman/AddNewPersonModal';
import { PhoneBooks } from '../Comman/PhoneBooks';

import { AddPlayerModal } from '../Home/AddPlayerModal';
import { PockerBuddies } from '../Comman/PockerBuddies';

import { TouchableOpacity } from 'react-native-gesture-handler';

export default class UsersEditTableVIew extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date_1_selected: false,
            date_2_selected: false,
            date_3_selected: false,
            gameDetails: false,
            listRecords: [{ id: 1, request_status: 'clear' }, { id: 2, request_status: 'clear' }, { id: 3, request_status: 'waiting' }, { id: 4, request_status: 'waiting' }],
            isAddPlayerModalVisible: false,
            isPhoneBookModalVisible: false,
            SELECTED_GROUP_USERS: [],
            groups: [],
            date_1_array: [],
            date_2_array: [],
            date_3_array: [],
            date_1_array_decline: [],
            date_2_array_decline: [],
            date_3_array_decline: [],
        };
    }

    componentDidMount() {
        const { selectedGame } = this.props.that.state;
        this.setState({ gameDetails: JSON.parse(JSON.stringify(selectedGame)) })
        this.getGroups();
        this.updateDateArray('date_1');
        this.updateDateArray('date_2');
        this.updateDateArray('date_3');
    }
    
    updateDateArray = (date_type) => {
        const { selectedGame } = this.props.that.state;
        var gameDetails = selectedGame;
        var userArray = []
        var date_key = 'date_1_response';
        var waiting_no = 'waiting_no_1';
        if (date_type == 'date_2') {
            date_key = 'date_2_response';
            waiting_no = 'waiting_no_2';
        } else if (date_type == 'date_3') {
            date_key = 'date_3_response';
            waiting_no = 'waiting_no_3';
        }

        gameDetails.users.map((item, index) => {
            if (item[date_key] == 'accepted') {
                var new_array = {
                    game_user_id: item.game_user_id,
                    name: item.name,
                    phone_number: item.phone_number,
                    response: item[date_key],
                    waiting_no: item[waiting_no]
                }
                userArray.push(new_array)
            }
        });

        userArray.sort((a, b) => {
            return a.waiting_no - b.waiting_no;
        });

        if (date_type == 'date_1') {
            this.setState({ date_1_array: userArray });
        } else if (date_type == 'date_2') {
            this.setState({ date_2_array: userArray });
        } else if (date_type == 'date_3') {
            this.setState({ date_3_array: userArray });
        }

    }
    getGroups = () => {
        getData('groups').then(async (res) => {
            if (res.status) {
                this.setState({ groups: res.data })
            } else {
                ToastMessage(res.message, "error")
            }
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })

        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 2000)
    }

    checkUncheckDate = (item, date_type, index, response) => {
        var new_response = '';
        // if(response == 'accepted'){
        //     new_response = 'decline';
        // }else if(response == 'decline'){
        //     new_response = '';
        // }else if(!response || response == ''){
        //     new_response = 'accepted';
        // }
        var date_key = 'date_1_response';
        var waiting_no = 'waiting_no_1';
        if (date_type == 'date_2') {
            date_key = 'date_2_response';
            waiting_no = 'waiting_no_2';
        } else if (date_type == 'date_3') {
            date_key = 'date_3_response';
            waiting_no = 'waiting_no_3';
        }

        var array_key = 'date_1_array';
        if (date_type == 'date_2') {
            array_key = 'date_2_array';
        } else if (date_type == 'date_3') {
            array_key = 'date_3_array';
        }

        var decline_array_key = array_key + '_decline';

        var date_array = this.state[array_key];
        var decline_date_array = this.state[decline_array_key];
        //check
        let a_index = date_array.findIndex((val, i) => {
            return val.game_user_id == item.game_user_id;
        })
        if (a_index < 0 && response == 'accepted') {
            var new_array = {
                game_user_id: item.game_user_id,
                name: item.name,
                phone_number: item.phone_number,
                response: 'accepted',
                waiting_no: item[waiting_no]
            }

            date_array.push(new_array)

            //remove from decline array
            let b_index = decline_date_array.findIndex((val, i) => {
                return val.game_user_id == item.game_user_id;
            })
            if (b_index >= 0) {
                decline_date_array.splice(b_index, 1)
            }
        }
        if (a_index >= 0 && response == 'accepted') {
            let b_index = decline_date_array.findIndex((val, i) => {
                return val.game_user_id == item.game_user_id;
            })
            if (b_index >= 0) {
                decline_date_array.splice(b_index, 1)
            }
        }
        if ((!response || response == '' || response == 'decline')) {
            if (a_index >= 0) {
                date_array.splice(a_index, 1)
            }
            var new_array = {
                game_user_id: item.game_user_id,
                name: item.name,
                phone_number: item.phone_number,
                response: response,
                waiting_no: item[waiting_no]
            }
            let b_index = decline_date_array.findIndex((val, i) => {
                return val.game_user_id == item.game_user_id;
            })
            if (b_index >= 0) {
                decline_date_array[b_index].response = response;
            } else {
                decline_date_array.push(new_array)
            }



            //date_array.push(new_array)


        }
        const { gameDetails } = this.state;
        if (gameDetails.date_selection === 'single') {
            item['date_1_response'] = '';
            item['date_2_response'] = '';
            item['date_3_response'] = '';
            item[date_key] = response;


            // let selectedDates = item.selected_dates;
            // let index = selectedDates.indexOf(date_type)
            // if (index >= 0) {
            //     selectedDates = [];
            // } else {
            //     selectedDates = [];
            //     selectedDates.push(date_type)
            // }
            // item.selected_dates = selectedDates;
        } else if (gameDetails.date_selection === 'multiple') {
            item[date_key] = response;

            // let selectedDates = item.selected_dates;
            // let index = selectedDates.indexOf(date_type)
            // if (index >= 0) {
            //     selectedDates.splice(index, 1);
            // } else {
            //     selectedDates.push(date_type)
            // }
            // item.selected_dates = selectedDates;
        }
        gameDetails.users[index] = item;
        // var { listRecords } = this.state;
        this.setState({ gameDetails: gameDetails })
        this.forceUpdate();

    }

    removeUser = (item, index) => {
        const { gameDetails } = this.state;
        item['is_deleted'] = true;

        gameDetails.users[index] = item;
        this.setState({ gameDetails: gameDetails })
        this.forceUpdate()
    }

    addNewPerson = () => {
        this.setState({ isAddPlayerModalVisible: true, SELECTED_GROUP_USERS: [{ id: '', name: '', nickname: '', phone_number: '', isVisible: false, assign_groups: [], groups: [] }] })
    }

    selectContact(user) {
        console.log('user: ',user)
        let { SELECTED_GROUP_USERS } = this.state;
        SELECTED_GROUP_USERS[0].id = user.id;
        SELECTED_GROUP_USERS[0].name = user.name;
        SELECTED_GROUP_USERS[0].nickname = user.nickname;
        SELECTED_GROUP_USERS[0].username = user.username;
        SELECTED_GROUP_USERS[0].phone_number = user.phone_number

        this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS, isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
    }
    updateGamePlayers = (users) => {
        const { gameDetails } = this.state;
        console.log('users.......',users)
        console.log(JSON.stringify(gameDetails))
        let user = users[0]
        
        var user_index = gameDetails.users.findIndex((value) => {
            return value.username === user.username;
        })

        if (user_index > -1) {
            ToastMessage('This contact already added in list')
        }else{
            let name = (user.name) ? user.name : '';
            let nickname = (user.nickname) ? user.nickname : '';
            let generate_temp_id = (user.generate_temp_id && user.generate_temp_id !== 'undefined') ? user.generate_temp_id : false;
            console.log('===============')
            let newUser = `{"id":"${user.id}","game_user_id":"","auto_assign_loss":0,"nickname":"${nickname}","username":"${user.username}","image":null,"is_owner":0,"is_banker":0,"total_amount":0,"buy_in":0,"receive_buy_in":"","amount_history":null,"selected_dates":[],"date_1_response":"","date_2_response":"","date_3_response":"","seat_status":"waiting","waiting_no":0,"current_status":"Pending","result":null,"won_amount":0,"lost_amount":0,"paid_amount":"","received_amount":"","settled_amount":null,"remaining_amount_tobe_rcvd":0,"remaining_amount_tobe_paid":0,"debtors":null,"creditors":null,"name":"${name}","assign_groups":"${JSON.stringify(user.assign_groups)}","is_new_user":true, "generate_temp_id": ${generate_temp_id}}`;
            console.log(newUser)

            newUser = JSON.parse(newUser);
            if (newUser.assign_groups) {
                newUser.assign_groups = JSON.parse(newUser.assign_groups)
            } else {
                newUser.assign_groups = [];
            }
            gameDetails.users.push(newUser)
            this.setState({ gameDetails: gameDetails, isAddPlayerModalVisible: false })
            this.forceUpdate()
        }
    }

    doneEditUser = () => {

        //return ;
        const { gameDetails } = this.state;
        this.props.that.setState({ showIndicator: true })
        let params = {
            data: gameDetails,
            date_array: {
                date_1_array: this.state.date_1_array.concat(this.state.date_1_array_decline),
                date_2_array: this.state.date_2_array.concat(this.state.date_2_array_decline),
                date_3_array: this.state.date_3_array.concat(this.state.date_3_array_decline),
            }
        };
        //return false;
        console.log('params:...',JSON.stringify(params))
        postData('schedule-game/updateInvitation', params).then(async (res) => {
            this.props.that.setState({ showIndicator: false })
            //return ;
            if (res.status) {
                ToastMessage(res.message)
                this.props.that.switchView('ViewTable', res.result)
            }
        })
    }
    thDate = (date_type) => {
        const { gameDetails } = this.state;

        return (
            gameDetails[date_type] ?
                <View style={[styles.td, styles.tdCenter]}>
                    {(gameDetails.confirm_date_type === date_type) ? <View style={{ width: normalize(30), height: normalize(30), position: 'absolute', right: 0, top: 0 }}>
                        <ImageBackground source={Images.triangle_Confirmed} style={[{ justifyContent: 'flex-start', alignContent: 'flex-end', alignItems: 'flex-end' }, { width: '100%', height: '100%', top: 0, right: 0 }]} >
                            <Text style={[styles.text3]}>C</Text>
                        </ImageBackground>
                    </View> : null}

                    <Text style={[styles.text1]}>{moment(gameDetails[date_type], 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
                    <Text style={[styles.text2]}>{moment(gameDetails[date_type], 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
                    <Text style={[styles.text2]}>{moment(gameDetails[date_type], 'YYYY-MM-DD HH:mm:ss').format('ddd')}</Text>
                    <View style={{ flexDirection: 'row' }}><PlainIcon name="check" color="#1BC773" type="FontAwesome5" fontSize={12} /><Text style={[styles.text2]}>{getTotalUserOnSignleDate(gameDetails.users, date_type)}</Text></View>
                </View>
                : null
        );
    }

    dateBox = (item, date_type, index, date_key) => {
        const { gameDetails } = this.state;
        let is_date_available = gameDetails[date_type];
        if (item.is_owner != 1) {
            return (
                is_date_available ?
                    <TouchableHighlight
                        style={{ display: 'flex', flex: 1 }}
                        onPress={() => {
                            if (item[date_key] == 'accepted') {
                                this.checkUncheckDate(item, date_type, index, 'decline')
                            } else if (item[date_key] == 'decline') {
                                this.checkUncheckDate(item, date_type, index, '')
                            } else {
                                this.checkUncheckDate(item, date_type, index, 'accepted')
                            }
                        }}
                    >
                        <View style={[styles.td, styles.tdCenter, (item[date_key] == 'accepted') ? styles.bgGreen : styles.bgRed]} >
                            {(item[date_key] == 'accepted') ? <PlainIcon name="check" color="#1BC773" type="AntDesign" fontSize={20} /> : (item[date_key] == 'decline') ? <PlainIcon name="close" color="#FF0000" type="AntDesign" fontSize={20} /> : null}
                        </View>
                    </TouchableHighlight> : null
            )
        } else {
            return (
                is_date_available ?
                    <View style={{ display: 'flex', flex: 1 }}>
                        <View style={[styles.td, styles.tdCenter, (item[date_key] == 'accepted') ? styles.bgGreen : styles.bgRed]} >
                            {(item[date_key] == 'accepted') ? <PlainIcon name="check" color="#1BC773" type="AntDesign" fontSize={20} /> : (item[date_key] == 'decline') ? <PlainIcon name="close" color="#FF0000" type="AntDesign" fontSize={20} /> : null}
                        </View>
                    </View> : null
            )
        }


    }

    footerRow() {
        const { gameDetails } = this.state;
        //if (getTotalValidUsers(gameDetails.users) < gameDetails.quorum_user_count) {
        return (<View key={'footer'} style={[styles.tr]}>
            <View style={[styles.td1, styles.inline, { justifyContent: 'center', alignItems: 'center', padding: 0 }]}>
                <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 40, width: '100%', padding: 5 }]}>
                    <UserCircleButton onPress={() => {
                        this.addNewPerson()
                    }} icon="plus" fontSize={12} btnStyle={{ backgroundColor: '#1BC773', marginRight: normalize(5) }} />
                    <TouchableOpacity onPress={() => {
                        this.addNewPerson()
                    }} ><Text style={[styles.textLignt]}>Add a preson</Text></TouchableOpacity>
                </View>
            </View>
            {gameDetails['date_1'] ? <View style={[styles.td, styles.tdCenter, styles.bgRed]}></View> : null}
            {gameDetails['date_2'] ? <View style={[styles.td, styles.tdCenter, styles.bgRed]}></View> : null}
            {gameDetails['date_3'] ? <View style={[styles.td, styles.tdCenter, styles.bgRed]}></View> : null}

        </View>);
        // } else {
        //     return null;
        // }

    }
    renderRow = (item, index) => {
        const { selectedGame } = this.props.that.state;
        return (<View key={index} style={[styles.tr]}>
            <View style={[styles.td1, styles.inline, { alignItems: 'center', padding: 0 }]}>
                {/* <View style={[{ flexDirection: 'row', width: '100%', height: 40 }]}>
                    <View style={[{ alignItems: 'center', width: '100%', flexDirection: 'row', padding: 5 }]}>
                        {item.is_owner ? <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.userImage} /> :
                            <UserCircleButton onPress={() => {
                                this.removeUser(item, index)
                            }} icon="minus" fontSize={12} btnStyle={{ backgroundColor: '#FF0000' }} />}
                        <Text style={[styles.text4]} numberOfLines={1}>{item.name}</Text>
                    </View>
                </View> */}
                <View style={[{ flexDirection: 'row', width: '100%', height: normalize(50) }]}>
                    <View style={[{ alignItems: 'center', width: '75%', flexDirection: 'row', padding: 5 }]}>
                        {item.is_owner ? <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.userImage} /> :
                            <UserCircleButton onPress={() => {
                                this.removeUser(item, index)
                            }} icon="minus" fontSize={12} btnStyle={{ backgroundColor: '#FF0000' }} />}<Text style={[styles.text4]} numberOfLines={1}>{(item.nickname && item.nickname !== '') ? item.nickname : item.name}</Text>
                    </View>
                    <View style={[Styles.tbCol, { width: '25%' }]}>

                        <View style={{ width: normalize(35), height: normalize(35), position: 'absolute', right: 0, top: 0 }}>
                            <ImageBackground source={Images['triangle_' + seatStatusLabel(item.seat_status_label)]} style={[{ justifyContent: 'flex-start', alignContent: 'flex-end', alignItems: 'flex-end' }, { width: '100%', height: '100%', top: 0, right: 0 }]} >
                                <Text style={[styles.text3]}>{seatStatus(item.seat_status_label)}</Text>
                            </ImageBackground>
                        </View>
                    </View>
                </View>
            </View>
            {this.dateBox(item, 'date_1', index, 'date_1_response')}
            {this.dateBox(item, 'date_2', index, 'date_2_response')}
            {this.dateBox(item, 'date_3', index, 'date_3_response')}
        </View>);
    }

    renderView = () => {
        const { listRecords, refreshing, gameDetails } = this.state;
        const { selectedGame } = this.props.that.state;
        return (
            (gameDetails) ?
                <View style={[styles.fixBox]}>
                    {/* {this.state.isPhoneBookModalVisible ? <PhoneBooks that={this} /> : null} */}
                    {this.state.isPhoneBookModalVisible ? <PockerBuddies isVisible={this.state.isPhoneBookModalVisible} that={this} /> : null}

                    <AddPlayerModal isVisible={this.state.isAddPlayerModalVisible} that={this} />

                    <View style={styles.content}>
                        <View style={{ flex: 1 }}>
                            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16, { padding: 15 }]}>Editing</Text>

                                <TextButton onPress={() =>
                                    this.doneEditUser()
                                    //this.props.that.switchView('ViewTable', this.props.that.state.selectedGame)
                                } style={{ padding: 15 }} label="Done" textStyle={{ color: '#FFF' }} />
                            </LinearGradient>
                            <View style={styles.innerSection}>
                                <View style={styles.content}>
                                    <View style={[styles.table]}>
                                        <View style={[styles.tr]}>
                                            <View style={[styles.td1]}>

                                            </View>
                                            {this.thDate('date_1')}
                                            {this.thDate('date_2')}
                                            {this.thDate('date_3')}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <ScrollView>
                                                {gameDetails.users.map((item, index) => {
                                                    return ((!item.is_deleted) ? this.renderRow(item, index) : null)
                                                })}
                                                {this.footerRow()}
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                : null
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
    td3: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: 'transparent',
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
    textLignt: {
        ...Styles.textGrayLight,
        ...Styles.fontMedium,
        ...Styles.font12,
        marginLeft: normalize(5)
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
    content: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', },
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