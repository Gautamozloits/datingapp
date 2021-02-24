/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput, RefreshControl,
    Image, StyleSheet, ScrollView
} from 'react-native';
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';
import { getData, postData, getTotalUserOnSignleDate } from '../../api/service';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import Global from '../../../constants/Global';
import { SmallButton, PlainIcon, TextButton, UserCircleButton } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';

import { AddNewPersonModal } from '../Comman/AddNewPersonModal';
import { PhoneBooks } from '../Comman/PhoneBooks';

import { TouchableOpacity } from 'react-native-gesture-handler';

export default class OpenInvitationEdit extends React.Component {

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
            groups: []
        };
    }

    componentDidMount() {
        const { selectedGame } = this.props.that.state;
        this.setState({ gameDetails: JSON.parse(JSON.stringify(selectedGame)) })
        this.getGroups();

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

    checkUncheckDate = (item, date_type, index) => {
        const { gameDetails } = this.state;
        if (gameDetails.date_selection === 'single') {
            let selectedDates = item.selected_dates;
            let index = selectedDates.indexOf(date_type)
            if (index >= 0) {
                selectedDates = [];
            } else {
                selectedDates = [];
                selectedDates.push(date_type)
            }
            item.selected_dates = selectedDates;
        } else if (gameDetails.date_selection === 'multiple') {
            let selectedDates = item.selected_dates;
            let index = selectedDates.indexOf(date_type)
            if (index >= 0) {
                selectedDates.splice(index, 1);
            } else {
                selectedDates.push(date_type)
            }
            item.selected_dates = selectedDates;
        }
        gameDetails.users[index] = item;
        // var { listRecords } = this.state;
        this.setState({ gameDetails: gameDetails })
        this.forceUpdate()

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
        let { SELECTED_GROUP_USERS } = this.state;
        SELECTED_GROUP_USERS[0].name = user.name
        SELECTED_GROUP_USERS[0].phone_number = user.phone_number

        this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS, isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
    }
    updateGamePlayers = (users) => {
        const { gameDetails } = this.state;
        let newUser = `{"id":"","auto_assign_loss":0,"nickname":"${users.nickname}","phone_number":"${users.phone_number}","image":null,"is_owner":0,"is_banker":0,"total_amount":0,"buy_in":0,"receive_buy_in":"","amount_history":null,"selected_dates":[],"seat_status":"waiting","waiting_no":0,"current_status":"Pending","result":null,"won_amount":0,"lost_amount":0,"paid_amount":"","received_amount":"","settled_amount":null,"remaining_amount_tobe_rcvd":0,"remaining_amount_tobe_paid":0,"debtors":null,"creditors":null,"name":"${users.name}","assign_groups":"${JSON.stringify(users.assign_groups)}","is_new_user":true}`;

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

    doneEditUser = () => {
        const { gameDetails } = this.state;
        this.props.that.setState({ showIndicator: true })
        let params = { data: gameDetails };

        postData('schedule-game/updateInvitation', params).then(async (res) => {
            this.props.that.setState({ showIndicator: false })
            if (res.status) {
                ToastMessage(res.message)
                this.props.that.switchView('openTable', res.result)
            }
        })
    }
    thDate = (date_type) => {
        const { gameDetails } = this.state;

        return (
            gameDetails[date_type] ?
                <View style={[styles.td, styles.tdCenter]}>
                    <Text style={[styles.text1]}>{moment(gameDetails[date_type], 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
                    <Text style={[styles.text2]}>{moment(gameDetails[date_type], 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
                    <Text style={[styles.text2]}>{moment(gameDetails[date_type], 'YYYY-MM-DD HH:mm:ss').format('ddd')}</Text>
                    <View style={{ flexDirection: 'row' }}><PlainIcon name="check" color="#1BC773" type="FontAwesome5" fontSize={12} /><Text style={[styles.text2]}>{getTotalUserOnSignleDate(gameDetails.users, date_type)}</Text></View>
                </View>
                : null
        );
    }

    dateBox = (item, date_type, index) => {
        const { gameDetails } = this.state;
        let is_date_available = gameDetails[date_type];
        return (
            is_date_available ?
                <View style={[styles.td, styles.tdCenter, (item.selected_dates.indexOf(date_type) >= 0) ? styles.bgGreen : styles.bgRed]} >
                    <View style={{ flexDirection: 'row' }}>
                        {(item.selected_dates.indexOf(date_type) >= 0) ? <PlainIcon name="check" color="#1BC773" type="AntDesign" fontSize={20} /> : <PlainIcon name="close" color="#1BC773" type="AntDesign" fontSize={20} />}
                    </View>
                </View>
                : null
        );
    }

    footerRow() {
        const { gameDetails } = this.state;
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
    }
    renderRow = (item, index) => {
        return (<View key={index} style={[styles.tr]}>
            <View style={[styles.td1, styles.inline, { alignItems: 'center', padding: 0 }]}>
                <View style={[{ flexDirection: 'row', width: '100%', height: 40 }]}>
                    <View style={[{ alignItems: 'center', width: '100%', flexDirection: 'row', padding: 5 }]}>
                        <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.userImage} />
                        <Text style={[styles.text4]} numberOfLines={1}>{item.name}</Text>
                    </View>
                </View>
            </View>
            {this.dateBox(item, 'date_1', index)}
            {this.dateBox(item, 'date_2', index)}
            {this.dateBox(item, 'date_3', index)}
        </View>);
    }

    renderView = () => {
        const { listRecords, refreshing, gameDetails } = this.state;
        const { selectedGame } = this.props.that.state;
        return (
            (gameDetails) ?
            <View style={[styles.fixBox]}>
            {this.state.isPhoneBookModalVisible ? <PhoneBooks that={this} /> : null}
            <AddNewPersonModal isVisible={this.state.isAddPlayerModalVisible} that={this} />

            <View style={styles.content}>
                <View style={{ flex: 1 }}>
                    <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', paddingLeft: 20, paddingRight: 20, paddingTop: 15, paddingBottom: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16]}>Editing</Text>

                        <TextButton onPress={() =>
                            this.doneEditUser()
                            //this.props.that.switchView('ViewTable', this.props.that.state.selectedGame)
                        } label="Done" textStyle={{ color: '#FFF' }} />
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
                                    <View style={{flex: 1}}>
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
            <ContainerTabScreen children={this.renderView()} styles={{ padding: normalize(20), paddingBottom:normalize(90)}} />
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
        ...Styles.font9,
        position: 'absolute',
        top: normalize(3),
        right: normalize(5)
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