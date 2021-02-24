/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput, AppState,
    Image, StyleSheet, FlatList, TouchableOpacity, Alert, ImageBackground, Dimensions
} from 'react-native';
//import { Stopwatch } from 'react-native-stopwatch-timer';
import Stopwatch from '../../components/StopWatch';

import { RFPercentage } from "react-native-responsive-fontsize";
import { SwipeListView } from 'react-native-swipe-list-view';
import { isValidNumber, kFormatter, getData, getUserDetail } from '../../api/service';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader'
import { ToastMessage } from '../../components/ToastMessage';

import Global from '../../../constants/Global';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton, SwipeBtn, DragButton, IconButton, PlainIcon } from '../../components/Buttons/Button';
import BuyInLayout from '../Views/BuyInLayout';
import { HeaderBG, HeaderLeft, BankerFilter } from '../../components/HeaderOptions';
import { ByInModal } from './ByInModal';
import { AddPlayerModal } from '../Home/AddPlayerModal';
import { PockerBuddies } from '../Comman/PockerBuddies';
//import { PhoneBook } from '../../components/PhoneBook';

import normalize from 'react-native-normalize';
import moment from "moment";
import Draggable from 'react-native-draggable';
const { width, height } = Dimensions.get('window');

export default class BuyIN extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Buy In</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
            headerRight: () => <BankerFilter />,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            gameId: '',
            gameDetails: {},
            listRecords: [],
            amountDetails: {},
            switch1Value: false,
            isModalVisible: false,
            showIndicator: false,
            refreshing: false,
            amount: '',
            gameTotalTime: '',
            gameUers: [],
            isAddPlayerModalVisible: false,
            isPhoneBookModalVisible: false,
            SELECTED_GROUP_USERS: [],
            groups: [],
            appState: AppState.currentState,

            timerStart: false,
            startTime: 0
        };

    }


    getStartTime() {
        var gameDetails = this.props.gameDetails;
        if (gameDetails && gameDetails.start_time) {

            var eventTime = moment(gameDetails.start_time, 'YYYY-MM-DD HH:mm:ss').format('X')
            let current_utc_time = moment.utc().format('YYYY-MM-DD HH:mm:ss');
            var currentTime = moment(current_utc_time).format('X');
            var diffTime = currentTime - eventTime;
            var duration = diffTime * 1000;
            this.setState({ startTime: duration, timerStart: true })
        }
    }
    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
        var gameDetails = this.props.gameDetails;
        this.setState({ gameUers: gameDetails.users })
        this.getGroups();
        this.getStartTime()
        let user = await getUserDetail();
        this.setState({ user: user })

    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            //this.setState({timerStart: true})
            this.getStartTime()
        } else if (nextAppState === 'background') {
            //this.setState({timerStart: false})
        }
    };
    openModal = (item) => {
        this.setState({ isModalVisible: true, amountDetails: item });
    }
    skipModal() {

        this.setState({ isModalVisible: false });
    }
    selectContact(user) {
        console.log(JSON.stringify(this.props.gameDetails.users))
        var user_index = this.props.gameDetails.users.findIndex((value) => {
            return value.username === user.username;
        })

        if (user_index > -1) {
            ToastMessage('This contact already added in list')
            this.setState({ isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
        } else {
            this.updateGamePlayers([user])
            this.setState({ isPhoneBookModalVisible: false })
        }


        // let { SELECTED_GROUP_USERS } = this.state;
        // SELECTED_GROUP_USERS[0].id = user.id;
        // SELECTED_GROUP_USERS[0].temp_id = user.temp_id;
        // SELECTED_GROUP_USERS[0].name = user.name;
        // SELECTED_GROUP_USERS[0].nickname = user.nickname;
        // SELECTED_GROUP_USERS[0].username = user.username;

        // this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS, isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
        // this.forceUpdate()
    }
    assignBanker = (item) => {
        let params = { user_id: this.props.user.id, game_id: this.props.gameDetails.game_id, game_user_id: item.game_user_id }
        this.props.socket.emit("gameAssignBanker", params, (res) => {
            if (res.status) {
                this.props.that.getActiveGame()
                ToastMessage(res.message)

            } else {
                ToastMessage(res.message, "error")
            }
        });
    }

    removePlayer = (item) => {
        Alert.alert('Home Game', 'Are you sure you want to remove the player?', [{
            text: 'Yes', onPress: async () => {

                let params = { user_id: this.props.user.id, game_id: this.props.gameDetails.game_id, game_user_id: item.game_user_id }

                this.props.socket.emit("removePlayer", params, (res) => {
                    if (res.status) {
                        this.props.that.getActiveGame()
                        ToastMessage(res.message)

                    } else {
                        ToastMessage(res.message, "error")
                    }
                });
            }
        },
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        ], { cancelable: false });
    }


    updateAmount = (item, index) => {
        if (item.amount !== '' && item.amount > 0 && isValidNumber(item.amount)) {
            const { gameDetails } = this.props;
            var gameUers = gameDetails.users;
            let amount = item.amount.replace(/[^0-9]/g, '')
            let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, amount: amount };
            this.props.socket.emit("giveAmountToUser", params, (res) => {
                if (res.status) {
                    gameDetails.total_buy_in = parseFloat(gameDetails.total_buy_in) + parseFloat(amount)
                    gameUers[index] = res.data;
                    gameDetails.users = gameUers;
                    this.props.that.getActiveGame(this.props.user)

                } else {
                    ToastMessage(res.message, "error")
                }
                this.setState({ showIndicator: false })
            });
        } else {
            if (item.amount && item.amount !== '' && !isValidNumber(item.amount)) {
                ToastMessage("Please enter only numbers", "error")
            }

        }

    }

    buyInRequestResponse = (item, index, status) => {
        if (item) {
            const { gameDetails } = this.props;
            var gameUers = gameDetails.users;
            let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, status: status };
            this.props.socket.emit("buyInRequestResponse", params, (res) => {
                if (res.status) {

                    // gameDetails.total_buy_in = parseFloat(gameDetails.total_buy_in) + parseFloat(amount)
                    // gameUers[index] = res.data;
                    // gameDetails.users = gameUers;
                    this.props.that.getActiveGame(this.props.user)
                    ToastMessage(res.message, "success")

                } else {
                    ToastMessage(res.message, "error")
                }
                this.setState({ showIndicator: false })
            });
        }

    }

    leaveRequestResponse = (item, index, status) => {
        // console.log(item);
        if (item) {
            if (this.checkReceivableAmount(item)) {

                const { gameDetails } = this.props;
                var gameUers = gameDetails.users;
                let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, status: status, received_amount: item.received_amount };
                this.props.socket.emit("leaveRequestResponse", params, (res) => {
                    if (res.status) {

                        // gameDetails.total_buy_in = parseFloat(gameDetails.total_buy_in) + parseFloat(amount)
                        // gameUers[index] = res.data;
                        // gameDetails.users = gameUers;
                        this.props.that.getActiveGame(this.props.user)
                        ToastMessage(res.message, "success")

                    } else {
                        ToastMessage(res.message, "error")
                    }
                    this.setState({ showIndicator: false })
                });
            }

        }
    }

    addNewPlayers = () => {
        this.setState({ isAddPlayerModalVisible: true, SELECTED_GROUP_USERS: [{ id: '', name: '', nickname: '', phone_number: '', isVisible: false, assign_groups: [], groups: [] }] })
    }
    updateGamePlayers = (users) => {
        if (users.length > 0) {
            let user = users[0];
            var user_index = this.props.gameDetails.users.findIndex((value) => {
                return value.username === user.username;
            })

            if (user_index > -1) {
                ToastMessage('This contact already added in list')
                this.setState({ isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
            } else {
                console.log('here...', users)
                let params = { user_id: this.state.user.id, users: users, game_id: this.props.gameDetails.game_id }
                this.props.socket.emit("addNewPlayers", params, (res) => {
                    console.log('res: ', res)
                    if (res.status) {
                        this.setState({ isAddPlayerModalVisible: false })
                        ToastMessage(res.message)
                        this.props.that.getActiveGame()
                    } else {
                        ToastMessage(res.message, 'error')
                    }
                })
            }
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
    // UNSAFE_componentWillReceiveProps(nextProps, nextState){
    //     const { gameDetails } = nextProps;
    //     this.props.gameDetails = gameDetails;
    // }

    checkReceivableAmount = (item) => {
        // console.log(item);
        var value = item.received_amount;
        if (!value || value == '') {
            //ToastMessage('Please enter valid amount', 'error')
            return true;
        } else {
            var amount = parseFloat(value);
            console.log('amount: ', amount)
            if (isValidNumber(amount)) {
                let max_payble_amount = item.won_amount;
                if (max_payble_amount < amount) {
                    ToastMessage('Received amount cannot be more than the balance to be paid', 'error')
                    return false;
                } else {
                    return true;
                }
            } else {
                ToastMessage('Please enter valid number', 'error')
                return false;
            }
        }
    }

    rightBlock = (item, index) => {

        var win_lost_amount = '0';
        var adj_symbole = '';
        var player_label = 'Quits';
        var icon = 'arrowup';
        var icon_color = '#9DA4AF';
        if (item.result == 'Winner' && item.won_amount > 0) {
            player_label = 'Won';
            //adj_symbole = '+';
            win_lost_amount = item.won_amount;
            icon = 'arrowup';
            icon_color = '#53C874';

        } else if (item.result == 'Loser' && item.lost_amount > 0) {
            player_label = 'Lost';
            //adj_symbole = '-';
            win_lost_amount = item.lost_amount;
            icon = 'arrowdown';
            icon_color = '#F24750';
        }
        if (item.current_status === 'Start') {
            return (
                <ImageBackground source={Images.RectangleBg} style={((item.current_status === 'Start' && item.request_status == 'Pending')) ? styles.gridBGImage2 : styles.gridBGImage} resizeMode="cover">
                    {(item.current_status === 'Start' && item.request_status == 'Pending') ?
                        <View style={[Styles.centerText, { width: '100%' }]}>
                            <View style={[Styles.tbRow, Styles.centerText, { marginTop: 2, width: '100%' }]}>
                                <Image source={Images.coinYellow} style={{ height: normalize(15), width: normalize(15) }} />
                                <Text style={[Styles.font14, Styles.fontRegular, Styles.textGray, { marginLeft: 5 }]}>{item.request_buyin}</Text>
                            </View>

                            <View style={[Styles.tbRow, { marginTop: 5, width: '100%' }]}>
                                <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
                                    <IconButton onPress={() => this.buyInRequestResponse(item, index, 'reject')} name="times-circle" color="#EE5A55" type="FontAwesome5" fontSize={25} />
                                </View>
                                <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
                                    <IconButton onPress={() => this.buyInRequestResponse(item, index, 'accept')} name="check-circle" color="#1BC773" type="FontAwesome5" fontSize={25} />
                                </View>
                            </View>
                        </View>
                        :
                        (item.current_status === 'Start') ?
                            <TextInput
                                onBlur={() => this.updateAmount(item, index)}
                                placeholder="Enter Chips"
                                //onSubmitEditing={() => this.updateAmount(item, index)} 
                                onChangeText={(value) => item.amount = value}
                                maxLength={8}
                                keyboardType={"numeric"}
                                returnKeyType='done'
                                style={[Styles.inputField, { width: '65%', marginRight: 10 }]}
                            /> : null}


                </ImageBackground>
            );
        } else if (item.current_status === 'Leave' && item.leave_request !== 'Accepted') {
            return (
                <View style={[Styles.centerText, { height: '100%', width: '100%', backgroundColor: '#EAF5FF', paddingTop: 2, paddingBottom: 2 }]}>

                    <View style={[Styles.centerText, { width: '95%' }]}>
                        <View style={[Styles.tbRow, Styles.centerText, { marginTop: 2, width: '100%' }]}>
                            <View style={[Styles.tbCol, { width: '50%', alignItems: 'flex-end' }]}>
                                <Text style={[Styles.font13, Styles.fontRegular, Styles.textGray]}>Return: </Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                                <Image source={Images.coinYellow} style={{ height: normalize(15), width: normalize(15) }} />
                                <Text style={[Styles.font13, Styles.fontRegular, Styles.textGray, { marginLeft: 2 }]} ellipsizeMode={"tail"} numberOfLines={1}>{item.receive_buy_in}</Text>
                            </View>
                            {/* <Text style={[Styles.font14, Styles.fontRegular, Styles.textGray, { marginLeft: 5 }]}>{player_label}: </Text>
                            <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                            <Text style={[Styles.font14, Styles.fontRegular, Styles.textGray, { marginLeft: 5 }]}>{win_lost_amount}</Text> */}




                        </View>
                        <View style={[Styles.tbRow, Styles.centerText, { width: '100%' }]}>
                            <View style={[Styles.tbCol, { width: '50%', alignItems: 'flex-end' }]}>
                                {(item.result == 'Winner')
                                    ?
                                    <Text style={[Styles.font13, Styles.fontRegular, Styles.textGray]}>Rcvd: </Text>
                                    :
                                    (item.result == 'Loser') ?
                                        <Text style={[Styles.font13, Styles.fontRegular, Styles.textGray]}>Paid: </Text>
                                        : null
                                }
                            </View>
                            <View style={[Styles.tbCol, { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                                {(item.result == 'Winner')
                                    ?
                                    <TextInput
                                        defaultValue={`${item.received_amount}`}
                                        //onBlur={() => this.checkReceivableAmount(item, index)}
                                        placeholder="Enter Amount"
                                        //onSubmitEditing={() => this.updateAmount(item, index)} 
                                        onChangeText={(value) => item.received_amount = value}
                                        //onChangeText={(value) => { this.checkReceivableAmount(item, value, index) }}
                                        maxLength={8}
                                        keyboardType={"numeric"}
                                        returnKeyType='done'
                                        style={[Styles.inputField, { width: '80%' }]}
                                    />
                                    :
                                    (item.result == 'Loser') ?
                                        <>
                                            <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                            <Text style={[Styles.font13, Styles.fontRegular, Styles.textGray, { marginLeft: 2, }]} ellipsizeMode={"tail"} numberOfLines={1}>{item.paid_amount}</Text>
                                        </>
                                        : null
                                }
                            </View>



                        </View>

                        <View style={[Styles.tbRow, { marginTop: 3, width: '100%' }]}>
                            {(item.leave_request === 'Pending') ?
                                <>
                                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
                                        <IconButton onPress={() => this.leaveRequestResponse(item, index, 'reject')} name="times-circle" color="#EE5A55" type="FontAwesome5" fontSize={25} />
                                    </View>
                                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
                                        <IconButton onPress={() => this.leaveRequestResponse(item, index, 'accept')} name="check-circle" color="#1BC773" type="FontAwesome5" fontSize={25} />
                                    </View>
                                </>
                                : null}
                        </View>



                    </View>

                </View>
            );
        } else if (item.current_status === 'Leave' && item.leave_request == 'Accepted') {
            return (
                <ImageBackground source={Images.RectangleBg} style={styles.gridBGImage} resizeMode="cover">

                    <View style={[Styles.centerText, { width: '100%' }]}>

                        <View style={[Styles.tbRow, Styles.centerText, { marginTop: 5, width: '60%' }]}>
                            <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                            <Text style={[Styles.font14, Styles.fontRegular, Styles.textGray, { marginLeft: 5 }]}>{adj_symbole + win_lost_amount}</Text>
                            {/* <Image source={arrowImage} style={{ height: '70%', width: normalize(10), marginLeft:normalize(5) }} /> */}
                            <PlainIcon name={icon} type="AntDesign" color={icon_color} fontSize={16} />
                        </View>
                    </View>

                </ImageBackground>
            );
        }



    }
    renderCard = (item, index) => {


        return (
            <View key={item.game_user_id} style={[styles.rowFront, (item.current_status === 'Start') ? styles.activeRow : styles.inactiveRow, ((item.current_status === 'Start' && item.request_status == 'Pending') || (item.current_status === 'Leave' && item.leave_request == 'Pending')) ? styles.redBorder : null]}>
                <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: normalize(10) }]}>
                    <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                    {(item.is_banker == 1) ? <View style={[Styles.shadow5, { borderRadius: 50, position: 'absolute', right: 0 }]}><Image source={Images.bankerIcon} style={{ height: normalize(20), width: normalize(20) }} /></View> : null}

                </View>
                <View style={[Styles.tbCol, { width: '40%', flexDirection: 'row' }]}>
                    <View style={[{ flexDirection: 'row' }]}>
                        <View style={[Styles.tbCol, { width: '5%' }]}>
                            <View style={styles.borderVertical}>
                                <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
                            </View>
                        </View>
                        <View style={[Styles.tbCol, { width: '90%', paddingLeft: normalize(10) }]}>
                            <TouchableOpacity activeOpacity={Styles.touchOpacity}
                                onPress={() => {
                                    if (item.current_status === 'Start') {
                                        this.openModal(item)
                                    }
                                }}>
                                <Text style={[Styles.font14, Styles.fontMedium, Styles.textPrimaryDark, Styles.title]}>{item.name}</Text>
                                <View style={[Styles.tbCol, { width: '100%' }]}>
                                    <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimaryDark]}>Total Buy In
                                    </Text>
                                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                        <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                            <Image source={Images.coinYellow} style={{ height: normalize(15), width: normalize(15) }} />
                                        </View>
                                        <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, { marginLeft: 5 }]}>{item.buy_in}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tbCol, Styles.centerText, { width: '40%', height: '100%' }]}>

                    {this.rightBlock(item, index)}

                </View>



            </View>

        );

    }
    renderView = () => {
        const { gameDetails } = this.props;
        const { refreshing } = this.state;
        return (
            <>
                {/* {this.state.isPhoneBookModalVisible ? <PhoneBook that={this} isVisible={this.state.isPhoneBookModalVisible} /> : null} */}

                {this.state.isPhoneBookModalVisible ? <PockerBuddies isVisible={this.state.isPhoneBookModalVisible} that={this} thatA={this.props.that} /> : null}
                <AddPlayerModal isVisible={this.state.isAddPlayerModalVisible} socket={this.props.socket} thatA={this.props.that} that={this} gameDetails={gameDetails} />
                {(gameDetails && gameDetails.game_user_id) ?
                    <View style={styles.grid}>
                        <View style={{}}>
                            <View style={[{ flexDirection: 'row', backgroundColor: '#FFF', marginBottom: normalize(16), borderRadius: 10 }]}>
                                <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: 10 }]}>
                                    <Text style={[Styles.font18, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.date, 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
                                    <Text style={[Styles.font14, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.date, 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
                                    <Text style={[Styles.font14, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY')}</Text>
                                </View>
                                <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row', height: '100%' }]}>
                                    <View style={[{ flexDirection: 'row' }]}>
                                        <View style={[Styles.tbCol, { width: '5%' }]}>
                                            <View style={styles.borderVertical}>
                                                <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
                                            </View>
                                        </View>
                                        <View style={[Styles.tbCol, Styles.centerText, { width: '90%', }]}>
                                            {this.state.timerStart ? <Stopwatch laps
                                                options={{
                                                    container: {
                                                        backgroundColor: 'transparent',
                                                    },
                                                    text: {
                                                        fontSize: normalize(18),
                                                        color: '#1BC773',
                                                        fontFamily: 'Medium',
                                                    }
                                                }}
                                                start={this.state.timerStart} startTime={this.state.startTime} gameStartTime={gameDetails.start_time} /> : null}

                                            <View style={[Styles.tbCol, { width: '100%', flexDirection: 'row', alignItems: 'center' }]}>
                                                <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimaryDark]}>Total Players: </Text><Text style={[Styles.font16, Styles.fontMedium, Styles.textGray]}> {gameDetails.users.length}</Text>
                                            </View>

                                            <View style={[Styles.tbCol, { width: '100%', flexDirection: 'row', alignItems: 'center' }]}>
                                                <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimaryDark]}>Table buy In: </Text>
                                                <View>
                                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                                        <Image source={Images.coinYellow} style={{ height: normalize(15), width: normalize(15) }} />
                                                    </View>
                                                </View>

                                                <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray]}> {gameDetails.total_buy_in}</Text>
                                            </View>
                                        </View>
                                        <View style={[Styles.tbCol, { width: '5%' }]}>
                                            <View style={styles.borderVertical}>
                                                <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tbCol, Styles.centerText, { width: '20%', paddingTop: normalize(10), paddingBottom: normalize(10) }]}>

                                    {gameDetails.options.game_value && gameDetails.options.game_value !== 'full' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>HV</Text> : <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>FV</Text>}

                                    {gameDetails.options.initial_buy_in && gameDetails.options.initial_buy_in !== '' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>BI: {kFormatter(gameDetails.options.initial_buy_in)}</Text> : null}

                                    {gameDetails.options.blinds && gameDetails.options.blinds !== '' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>SB: {gameDetails.options.blinds}</Text> : null}

                                    {gameDetails.options.showdown && gameDetails.options.showdown !== '' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>SD: {kFormatter(gameDetails.options.showdown)}</Text> : null}
                                </View>
                            </View>
                        </View>
                        <View style={{}}>

                            <SwipeListView
                                keyboardShouldPersistTaps='always'
                                contentContainerStyle={{ paddingBottom: 120, paddingLeft: 2, paddingRight: 2 }}
                                showsVerticalScrollIndicator={false}
                                data={gameDetails.users}
                                renderItem={({ item, index }) => this.renderCard(item, index)}
                                renderHiddenItem={({ item, index }) => {
                                    if (item.current_status === 'Start') {
                                        return (
                                            <View style={styles.rowBack}>
                                                <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row', justifyContent: 'space-between' }]}>
                                                    {(item.is_banker == 0) ? <SwipeBtn onPress={() => this.assignBanker(item)} image={Images.assignIcon} label="Assign Banker" fontSize={1.4} btnStyle={{ width: normalize(100), justifyContent: 'center' }} /> : null}

                                                </View>
                                                <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-end' }]}>
                                                    <SwipeBtn onPress={() => this.removePlayer(item)} image={Images.deleteIcon} label="Remove" fontSize={1.4} btnStyle={{ width: normalize(80), justifyContent: 'center' }} disabled={(gameDetails.users.length <= 2 || item.is_banker === 1) ? true : false} />
                                                    {/* <SwipeBtn onPress={() => { this.openModal(item) }} image={Images.editIcon} label="Edit" fontSize={1.4} btnStyle={{ width: normalize(60), justifyContent: 'center' }} /> */}
                                                </View>
                                            </View>
                                        )
                                    }
                                }
                                }
                                leftOpenValue={120}
                                rightOpenValue={-100}
                                keyExtractor={item => item.game_user_id.toString() + Math.random()}
                                refreshing={refreshing}
                                onRefresh={() => {
                                    this.props.that.getActiveGame(this.props.user)
                                }}
                                ListFooterComponent={() => <View style={{ height: 150 }} />}
                            />
                        </View>

                    </View>
                    : null}
                {this.state.isModalVisible ? <ByInModal socket={this.props.socket} that={this} amountDetails={this.state.amountDetails} isVisible={this.state.isModalVisible} /> : null}
                <Draggable x={width - 80} y={height - 190} z={1} minX={0} minY={0} maxX={width} maxY={height - 120} shouldReverse={false}>
                    <DragButton
                        size={80}
                        image={Images.addPlayer}
                        onPress={() => {
                            this.addNewPlayers(this.props.gameDetails.users)
                        }}
                    />
                </Draggable>
            </>
        );
    }
    render() {
        return (
            <BuyInLayout styles={{ paddingBottom: 35, backgroundColor: '#F8F9F9' }} children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    activeRow: { backgroundColor: '#FFF' },
    inactiveRow: { backgroundColor: '#E9EBEE' },
    grid: {
        height: '100%',
    },
    row: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row', padding: 10,
        /* shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        elevation: 5,*/

    },
    tbRow: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row', padding: 10,
        marginBottom: 10,
        /* shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        elevation: 5,*/

    },
    cardImage: {
        height: normalize(48),
        width: normalize(48),
        borderRadius: 8
    },

    hrGreen: {
        height: 1,
        width: '80%',
        backgroundColor: '#E9F9F1',
        position: 'absolute',
        zIndex: -1
    },
    borderVertical: {
        height: '100%',
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'center'

    },
    rowFront: { flexDirection: 'row', marginBottom: normalize(16), borderRadius: 10, flex: 1 },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#A8B0BC',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginBottom: 16,
        borderRadius: 10,
        paddingRight: 15
    },

    gridBGImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    gridBGImage2: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redBorder: {
        borderWidth: 1,
        borderColor: '#EE5A55',
        overflow: 'hidden'
    }
});
