/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput, RefreshControl,
    Image, StyleSheet, FlatList, ScrollView, Alert
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import moment from "moment";
import Styles from '../../styles/Styles';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader';
import Images from '../../../constants/Images';
import Global from '../../../constants/Global';
import { SmallButton, PlainIcon, UserCircleButton } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, PaymentFilter } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import { isValidNumber, getSumofNumber } from '../../api/service';
import ActionDropdown from '../../components/ActionDropdown';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UsersTableVIew from './UsersTableVIew';
import UsersEditTableVIew from './UsersEditTableVIew';
import { postData, getUserDetail, seatStatusLabel } from '../../api/service';
import { getListContent } from '../../api/serviceHandler';
//import { AddNewPersonModalGuest } from '../Comman/AddNewPersonModalGuest';
//import { PhoneBooks } from '../Comman/PhoneBooks';
import SettingModal from './SettingModal';

import { AddPlayerModal } from '../Home/AddPlayerModal';
import { PockerBuddies } from '../Comman/PockerBuddies';

export default class Received extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSubView: 'List',
            //listRecords: [{ id: 1 }, { id: 2 }, { id: 3 }],
            listRecords: [],
            current_page: 1,
            total_pages: 1,

            //loading status
            is_api_calling: false,//show if api already called
            show_footer_loader: false,// show when next page called
            show_no_record: false, // show when no record in list
            showIndicator: false, // show loader for first time
            refreshing: false, //show loader on pull to refresh
            selectedGame: {},
            user: {},
            isAddPlayerModalVisible: false,
            isPhoneBookModalVisible: false,
            SELECTED_GROUP_USERS: [],
            groups: [],
            gameDetails: '',
            tempList: false,
            isSettingModalVisible:false,
        };
    }

    componentDidUpdate = (prevProps) => {
        if(!this.state.tempList && this.state.listRecords.length > 0){
            this.setState({tempList: JSON.parse(JSON.stringify(this.state.listRecords))});
            //console.log(JSON.stringify(this.state.listRecords))
        }
        
    }
    componentDidMount = async () => {

        this.getListData('first')
        let user = await getUserDetail();
        this.setState({ user: user })
    }
    getListData = async (type) => {
        let params = { type: 'received' };
        getListContent('schedule-game/invitations', params, this, type)
    }
    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getListData('refresh')
    }

    switchView(type = 'List', item = {}) {
        if (type === 'ViewTable') {
            this.props.nav.setParams({
                navBar: {
                    currentView: 'Table'
                }
            });
        } else if (type === 'openTable') {
            this.props.nav.setParams({
                navBar: {
                    currentView: 'Table'
                }
            });
        } else if (type === 'List') {
            this.props.nav.setParams({
                navBar: {
                    currentView: 'List'
                }
            });
        }
        var games_list = this.state.listRecords;
        var game_index = games_list.findIndex((value) => {
            return value.game_id === item.game_id;
        })
        if (game_index >= 0) {
            games_list[game_index] = item;
        }
        this.setState({ currentSubView: type, selectedGame: item, listRecords: games_list });
    }

    selecteDate = (item, date_type, response) => {
        var new_response = null;
        if (response == 'accepted') {
            new_response = 'decline';
        } else if (response == 'decline') {
            new_response = null;
        } else if (!response || response == '') {
            new_response = 'accepted';
        }
        var date_key = 'date_1_response';
        if (date_type == 'date_2') {
            date_key = 'date_2_response';
        } else if (date_type == 'date_3') {
            date_key = 'date_3_response';
        }

        if (item.is_poll_open === 1) {
            if (item.date_selection === 'single') {
                // let selectedDates = [];
                // selectedDates.push(date_type)
                // item.selected_dates = selectedDates;
                item['date_1_response'] = null;
                item['date_2_response'] = null;
                item['date_3_response'] = null;
                item[date_key] = new_response;

                /*let selectedDates = item.selected_dates;
                let index = selectedDates.indexOf(date_type)
                if (index >= 0) {
                    selectedDates = [];
                } else {
                    selectedDates = [];
                    selectedDates.push(date_type)
                }
                
                item.selected_dates = selectedDates;*/

            } else if (item.date_selection === 'multiple') {
                /*let selectedDates = item.selected_dates;
                let index = selectedDates.indexOf(date_type)
                if (index >= 0) {
                    selectedDates.splice(index, 1);
                } else {
                    selectedDates.push(date_type)
                }
                item.selected_dates = selectedDates;*/
                item[date_key] = new_response;
            }

            var { listRecords } = this.state;
            this.setState({ listRecords: listRecords })
        }

        //this.forceUpdate()
    }
    done = (item, index) => {

        var { listRecords } = this.state;
        this.setState({ showIndicator: true })
        let params = {
            game_id: item.game_id, game_user_id: item.game_user_id,
            date_1_response: item.date_1_response,
            date_2_response: item.date_2_response,
            date_3_response: item.date_3_response,
            //selected_dates: item.selected_dates 
        };
        postData('schedule-game/updateSingleInvitation', params).then(async (res) => {
            if (res.status) {
                var game = res.result;
                var message = `Table full for [DATE]. You will be wait listed if game is confirmed for this day.`;
                if(game.created_game_id && game.created_game_id > 0){
                    message = `Table full for [DATE]. You are wait listed for this day.`;
                }
                
                var date_str = [];
                if (game.waiting_no_1 > 0) {
                    date_str.push(moment(game.date_1, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'));
                    // message = message.replace("[DATE]",moment(game.date_1, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'));
                    //this.alertMessage(message)
                }
                if (game.waiting_no_2 > 0) {
                    date_str.push(moment(game.date_2, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'));
                    //message = message.replace("[DATE]",moment(game.date_2, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'));
                    // this.alertMessage(message)
                }
                if (game.waiting_no_3 > 0) {
                    date_str.push(moment(game.date_3, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'));

                    //message = message.replace("[DATE]",moment(game.date_3, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'));
                    //this.alertMessage(message)
                }
                if (date_str != '') {
                    message = message.replace("[DATE]", date_str.join(', '));
                    //this.alertMessage(message)
                    ToastMessage(message)
                }else{
                    ToastMessage(res.message)
                }


                // item.selected_dates.map((key, index) => {

                //   let users = getTotalUserOnSignleDate(game.users, key)
                //   if(game.quorum_user_count <= users-1){
                //     Alert.alert('Home Game', 'Table full for this day ('+moment(game[key], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')+'). You will be wait listed if game is confirmed for this day.', [{
                //       text: 'OK', onPress: async () => {

                //       }
                //     }]);
                //   }
                // })

                listRecords[index] = res.result;

                this.setState({ listRecords: listRecords })
                this.setState({tempList: JSON.parse(JSON.stringify(listRecords))});
                
                // this.props.that.switchView('ViewTable', res.result)

            }
            this.setState({ showIndicator: false })
        })

    }
    alertMessage = (message) => {
        Alert.alert('Home Game', message, [{
            text: 'OK', onPress: async () => {

            }
        }]);
    }
    updatePollStatus = (item, index, type) => {
        var { listRecords } = this.state;
        this.setState({ showIndicator: true })
        let params = { game_id: item.game_id, game_user_id: item.game_user_id, is_poll_open: (type === 'Close Poll') ? 0 : 1 };

        postData('schedule-game/updatePollStatus', params).then(async (res) => {
            if (res.status) {
                listRecords[index] = res.result;

                this.setState({ listRecords: listRecords })

                ToastMessage(res.message)
                //this.props.that.switchView('ViewTable', res.result)

            }
            this.setState({ showIndicator: false })
        })

    }

    /**add new user start */
    addNewPerson = (item) => {
        //if(item.user_count < item.quorum_user_count){
            this.setState({ isAddPlayerModalVisible: true, SELECTED_GROUP_USERS: [{ id: '', name: '', nickname: '', phone_number: '', isVisible: false, assign_groups: [], groups: [] }], gameDetails: item })
        // }else{
        //     ToastMessage('Quorum is full, you can not add more player')
        // }
        
    }

    selectContact(user) {
        var user_index = this.state.gameDetails.users.findIndex((value) => {
            return value.id === user.id;
          })
          console.log('user_index: ',user_index)
          if(user_index > -1){
            ToastMessage('This contact already added in list')
            this.setState({ isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
          }else{
            this.setState({ isPhoneBookModalVisible: false, isAddPlayerModalVisible: true, SELECTED_GROUP_USERS: [user] })
          }

        // let { SELECTED_GROUP_USERS } = this.state;
        // SELECTED_GROUP_USERS[0].name = user.name
        // SELECTED_GROUP_USERS[0].phone_number = user.phone_number
        // this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS, isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
    }
    updateGamePlayers = (users) => {
       
       let user = users[0];
       let generate_temp_id = (user.generate_temp_id) ? user.generate_temp_id : false;
        const { gameDetails } = this.state;
        let newUser = `{"id":"${user.id}","game_user_id":"","auto_assign_loss":0,"nickname":"${user.nickname}","username":"${user.username}","image":null,"is_owner":0,"is_banker":0,"total_amount":0,"buy_in":0,"receive_buy_in":"","amount_history":null,"selected_dates":[],"date_1_response":"","date_2_response":"","date_3_response":"","seat_status":"waiting","waiting_no":0,"current_status":"Pending","result":null,"won_amount":0,"lost_amount":0,"paid_amount":"","received_amount":"","settled_amount":null,"remaining_amount_tobe_rcvd":0,"remaining_amount_tobe_paid":0,"debtors":null,"creditors":null,"name":"${user.name}","assign_groups":[],"is_new_user":true, "generate_temp_id": ${generate_temp_id}}`;
        console.log('newUser---.....',newUser)
        newUser = JSON.parse(newUser);

        newUser.assign_groups = [];
        //this.setState({ gameDetails: gameDetails, isAddPlayerModalVisible: false })
        //this.forceUpdate()

        this.props.that.setState({ showIndicator: true })
        let params = { game_id: gameDetails.game_id, new_users: [newUser] };
        postData('schedule-game/addNewUser', params).then(async (res) => {
            this.props.that.setState({ showIndicator: false })
            if (res.status) {
                var games_list = this.state.listRecords;
                var game_index = games_list.findIndex((value) => {
                    return value.game_id === gameDetails.game_id;
                })
                if (game_index >= 0) {
                    games_list[game_index] = res.result;
                }

                this.setState({ listRecords: games_list, isAddPlayerModalVisible: false })
                ToastMessage(res.message)
                //this.props.that.switchView('openTable', res.result)
            }
        })

    }


    /**add new user end */

    dateBoxCard = (item, date_type) => {
        var date_key = 'date_1_response';
        if (date_type == 'date_2') {
            date_key = 'date_2_response';
        } else if (date_type == 'date_3') {
            date_key = 'date_3_response';
        }


        return (
            item[date_type] ?
                <TouchableOpacity onPress={() => this.selecteDate(item, date_type, item[date_key])}>
                    <View style={[styles.dateBox, (item.confirm_date_type && (item.confirm_date_type === date_type)) ? styles.activeBox : styles.inactiveBox]}>
                        <View style={styles.checkbox}>
                            {(item[date_key] == 'accepted') ? <PlainIcon name="check-circle" color="#1BC773" type="FontAwesome5" fontSize={20} /> : (item[date_key] == 'decline') ? <PlainIcon name="closecircleo" color="#FF0000" type="AntDesign" fontSize={20} /> : <PlainIcon name="circle" color="#ededed" type="FontAwesome5" fontSize={20} />}
                        </View>
                        <Text style={[Styles.textPrimaryLight, Styles.fontBold, Styles.font16]}>{moment(item[date_type], 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
                        <Text style={[Styles.textPrimaryLight, Styles.fontRegular, Styles.font12]}>{moment(item[date_type], 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
                        <Text style={[Styles.textPrimaryLight, Styles.fontRegular, Styles.font10]}>{moment(item[date_type], 'YYYY-MM-DD HH:mm:ss').format('dddd')}</Text>
                        <Image source={Images.hrDate} style={[Styles.bottomBorderFullImage]} />
                        <Text style={[Styles.textPrimaryLight, Styles.fontRegular, Styles.font10]}>{moment(item[date_type], 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')}</Text>
                    </View>
                </TouchableOpacity>
                : <View style={[styles.blankDateBox]}></View>
        )
    }

    isValidButton = (item, index) => {
        var { tempList } = this.state;
        var tempItem = tempList[index];
        //console.log(JSON.stringify(tempItem))
        let flag = true;
        if(tempItem){
            
            if((tempItem.date_1_response === item.date_1_response) && (tempItem.date_2_response === item.date_2_response) && (tempItem.date_3_response === item.date_3_response)){
                flag = false;
            }
        }
        return flag;
        
        //console.log('tempItem.date_1_response: ',tempItem.date_1_response, '==', 'item.date_1_response: ',item.date_1_response)
        
        //console.log('....',JSON.stringify(tempList))
        //return false;
    }
    renderCard = (item, index) => {
        const { user } = this.state;
        var dropdownOptions = ['Close Pol'];
        return (
            <View key={index} style={[styles.grid]}>
                <View style={[Styles.tbRow]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '25%', justifyContent: 'center' }]}>
                        <View style={[styles.imgContainer]}>
                            <Image source={(item.image && item.image !== "") ? { uri: Global.ROOT_PATH + item.image } : Images.demo} style={styles.gameImage} />
                        </View>
                    </View>
                    <View style={[Styles.tbCol, { width: '65%', paddingRight: normalize(10) }]}>
                        <View>
                            <TouchableOpacity onPress={() => {
                                this.setState({gameDetails: item, isSettingModalVisible: true})
                            }}>
                                <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontBold]}>{item.title}</Text>
                            </TouchableOpacity>
                            <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontMedium]}>@{item.location}</Text>
                        </View>
                        <View style={[Styles.tbRow, { marginTop: normalize(10) }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[Styles.textPrimary, Styles.font12, Styles.fontMedium]}>Created by:</Text><Text style={[Styles.textGray, Styles.font12, Styles.fontRegular, Styles.title]}> {item.owner_name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, { width: '10%', justifyContent: 'flex-start', alignItems: 'center', }]}>
                        {/* <UserCircleButton icon='user-plus' /> */}

                        {(item.is_poll_open === 1) ? <UserCircleButton icon='user-plus' onPress={() => this.addNewPerson(item)} /> : null}
                        
                    </View>

                </View>
                <Image source={Images.bottomBorder} style={[Styles.bottomBorderFullImage, { marginTop: 10, marginBottom: 10 }]} />
                <View style={[Styles.tbRow, { padding: normalize(5) }]}>
                    <View style={[{ borderWidth: 1, borderColor: '#dfe7f5', borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: normalize(5) }]}>
                        <View style={[styles.tbRow]}>
                            <View style={[styles.tbCol, { width: '33.33%', borderRightColor: '#dfe7f5', borderRightWidth: 1, flexDirection: 'row' }]}>
                                <Text style={[Styles.fontRegular, Styles.font10, Styles.textPrimaryDark]}>Game : </Text><Text style={[Styles.fontBold, Styles.font10, Styles.textPrimaryDark]}>{item.status}</Text>
                            </View>
                            <View style={[styles.tbCol, { width: '33.33%', borderRightColor: '#dfe7f5', borderRightWidth: 1, flexDirection: 'row' }]}>
                                <Text style={[Styles.fontRegular, Styles.font10, Styles.textPrimaryDark]}>Seat : </Text><Text style={[Styles.fontBold, Styles.font10, Styles.textPrimaryDark]}>{item.seat_status_label}</Text>
                            </View>
                            <View style={[styles.tbCol, { width: '33.33%', flexDirection: 'row' }]}>
                                <Text style={[Styles.fontRegular, Styles.font10, Styles.textPrimaryDark]}>Table : </Text><Text style={[Styles.fontBold, Styles.font10, Styles.textPrimaryDark]}>{item.table_status_label}</Text>
                            </View>
                        </View>

                        {(item.owner_id == user.id || item.hidden_pols === 0) ? <>
                            <View style={[{ flexDirection: 'row', width: '95%', borderBottomWidth: 1, borderBottomColor: '#dfe7f5' }]}></View>
                            <TouchableOpacity
                                style={[styles.tbRow]}
                                onPress={() => this.switchView('ViewTable', item)}
                            >
                                <View style={[styles.tbCol, { width: '50%', borderRightColor: '#dfe7f5', borderRightWidth: 1, flexDirection: 'row' }]}>
                                    <Text style={[Styles.fontRegular, Styles.font10, Styles.textPrimaryDark]}>Total Invites : </Text><Text style={[Styles.fontBold, Styles.font10, Styles.textPrimaryDark]}>{item.user_count}</Text>
                                </View>
                                <View style={[styles.tbCol, { width: '50%', flexDirection: 'row' }]}>
                                    <Text style={[Styles.fontRegular, Styles.font10, Styles.textPrimaryDark]}>Responded : </Text><Text style={[Styles.fontBold, Styles.font10, Styles.textPrimaryDark]}>{item.responded_user_count}</Text>
                                </View>
                            </TouchableOpacity>
                        </> : null}

                    </View>
                </View>

                <View style={[Styles.tbRow, { marginTop: 10, justifyContent: 'space-between', padding: normalize(5) }]}>
                    {this.dateBoxCard(item, 'date_1')}
                    {this.dateBoxCard(item, 'date_2')}
                    {this.dateBoxCard(item, 'date_3')}


                </View>
                {(item.is_poll_open === 1) ? <View style={[Styles.tbRow, { marginTop: 10, justifyContent: 'center', alignItems: 'center' }]}>
                    <SmallButton 
                    onPress={() => {
                        (this.isValidButton(item, index)) ? this.done(item, index) : null
                    }} label="Done" fontSize={12} btnStyle={{ width: '30%' }} 
                    startColor={(this.isValidButton(item, index)) ? '#2A395B' : '#dfdfdf'} 
                    endColor={(this.isValidButton(item, index)) ? '#080B12' : '#dfdfdf'} />
                </View> : null}



            </View>
        );


    }
    renderView = () => {
        const { listRecords, refreshing, currentSubView, isSettingModalVisible } = this.state;
        if (currentSubView === 'ViewTable') {
            return (<UsersTableVIew that={this} />)
        } else {
            return (
                <>
                    {isSettingModalVisible ? <SettingModal settingModalVisible={isSettingModalVisible} that={this}/> : null}
                    {this.state.isPhoneBookModalVisible ? <PockerBuddies isVisible={this.state.isPhoneBookModalVisible} that={this} /> : null}

                    <AddPlayerModal hideGroupOption={true} isVisible={this.state.isAddPlayerModalVisible} that={this} />
                    
                    <View style={styles.list}>
                        <ScrollView
                            style={{ paddingLeft: normalize(5), paddingRight: normalize(5) }}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={() => this.getListData('refresh')} />
                            }
                        >
                            {listRecords.length > 0 ? listRecords.map((item, index) => {
                                return (this.renderCard(item, index))
                            }) : <NoRecord visible={true} />}
                            <View style={{height:100}}></View>
                        </ScrollView>
                    </View>

                </>
            );
        }
    }
    render() {
        const { showIndicator } = this.state;
        return (
            <>
                {showIndicator ? <Loader /> : null}
                <ContainerTabScreen children={this.renderView()} />
            </>
        );
    }
}
const styles = StyleSheet.create({
    grid: {
        backgroundColor: '#FFFFFF',
        marginTop: normalize(20),
        borderRadius: 10,
        flexDirection: 'column',
        padding: normalize(10),
        width: '98%',
        marginLeft: RFPercentage(0.4),
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    list: {
        flex: 1,
        paddingLeft: normalize(15),
        paddingRight: normalize(15),
        //paddingBottom: normalize(90)
    },
    imgContainer: {
        width: normalize(70),
        height: normalize(70),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        padding: normalize(5),
    },
    gameImage: {
        width: normalize(70),
        height: normalize(70),
        borderRadius: 10
    },
    tbRow: {
        flexDirection: 'row',
        //width:'100%',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 5
    },
    tbCol: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1
    },
    dateBox: {
        height: normalize(100),
        width: normalize(83),
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',
        padding: normalize(5),
    },
    blankDateBox: {
        height: normalize(90),
        width: normalize(83),
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: normalize(5),
    },
    activeBox: {
        borderColor: '#1BC773',
    },
    inactiveBox: {
        borderColor: '#ededed',
    },
    checkbox: {
        position: 'absolute',
        top: 2,
        right: 2
    }
});