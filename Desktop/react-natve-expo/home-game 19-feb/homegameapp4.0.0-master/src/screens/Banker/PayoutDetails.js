/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput,
    Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { SwipeListView } from 'react-native-swipe-list-view';

import { isValidNumber,isValidNumberWithZero, getSumofNumber, getTotalUserByType, getTotalLooserPaid } from '../../api/service';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images from '../../../constants/Images';
import { SmallButton, SwipeBtn } from '../../components/Buttons/Button';
import ContainerListScreen from '../Views/ContainerListScreen';
import { HeaderBG, HeaderLeft, BankerFilter } from '../../components/HeaderOptions';
import { ByInModal } from './ByInModal';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import DoubleClicker from '../../components/react-native-double-click/main';
export default class PayoutDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listRecords: [],
            switch1Value: false,
            isModalVisible: false,
            refreshing: false,
            gameUsers: [],
            banker: {},
            chipsData: {
                total_wining: 0,
                total_losing: 0,
                total_difference: 0,
                total_users: 0,
                winners: 0,
                loosers: 0,
                quits: 0,
                total_cash_paid: 0
            }
        };
    }

    componentDidMount = async () => {
        this.updateHeader()
        this.setState({ gameUsers: this.props.gameDetails.users })
        console.log(JSON.stringify(this.props.gameDetails))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(this.props.gameDetails.users) !== JSON.stringify(prevState.gameUsers)) {
            this.setState({ gameUsers: this.props.gameDetails.users })
            this.updateHeader()
        } else {
        }


    }
    getBankers = async (users) => {
        var user_index = users.findIndex((value) => {
            return value.is_banker === 1;
        })
        var banker = users[user_index];
        this.setState({ banker: banker })
        //auto_assign_loss
        if (banker.auto_assign_loss === 1) {
            var isValid = true;
            await this.props.gameDetails.users.map((item, index) => {
                if (item.result == 'Loser') {
                    if (item.paid_amount) {
                        isValid = false;
                    } else {
                        if (item.lost_amount <= parseFloat(this.props.gameDetails.options.showdown)) {
                            item.paid_amount = item.lost_amount.toString();
                        } else {
                            item.paid_amount = this.props.gameDetails.options.showdown.toString();
                        }
                    }

                    this.payLostAmount(item, index, 'auto');
                }
            })
            if (isValid) {
                this.props.that.getActiveGame()
            }
        }
    }

    updateHeader = async () => {
        var gameDetails = this.props.gameDetails;
        var { chipsData } = this.state;
        var totalBuyIn = await getSumofNumber(gameDetails.users, 'buy_in')
        var totalRcvBuyIn = await getSumofNumber(gameDetails.users, 'receive_buy_in')
        var totalWin = await getSumofNumber(gameDetails.users, 'won_amount');
        var totalLost = await getSumofNumber(gameDetails.users, 'lost_amount');
        var totalPaidAmount = await getSumofNumber(gameDetails.users, 'paid_amount');


        if (gameDetails.options.game_value === 'half') {
            totalWin = totalWin * 2;
            totalLost = totalLost * 2;
        }
        /*if (totalBuyIn > totalRcvBuyIn) {
          chipsData.total_difference = totalBuyIn - totalRcvBuyIn;
        } else {
            chipsData.total_difference = totalRcvBuyIn - totalBuyIn;
        }*/
        if (totalWin > totalLost) {
            chipsData.total_difference = totalWin - totalLost;
        } else {
            chipsData.total_difference = totalLost - totalWin;
        }
        chipsData.total_wining = totalWin;
        chipsData.total_losing = totalLost;
        chipsData.total_users = gameDetails.user_count;

        var total_winners = await getTotalUserByType(gameDetails.users, 'Winner')
        var total_loosers = await getTotalUserByType(gameDetails.users, 'Loser')
        var total_quits = await getTotalUserByType(gameDetails.users, 'Quits');
        var total_paid_users = await getTotalLooserPaid(gameDetails.users)
        chipsData.winners = total_winners;
        chipsData.loosers = total_loosers;
        chipsData.quits = total_quits;
        chipsData.total_cash_paid = total_paid_users;
        this.setState({ chipsData: chipsData })

    }
    returnChips = (item, index) => {
        var gameDetails = this.props.gameDetails;
        //if (item.receive_buy_in != '' && item.receive_buy_in >= 0) {
        var gameDetails = this.props.gameDetails;
        this.setState({ showIndicator: true })
        let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, return_chips: item.receive_buy_in };
        this.props.socket.emit("returnChips", params, (res) => {
            if (res.status) {
                this.props.that.getActiveGame();
            } else {
                ToastMessage(res.message, "error")
            }
            this.setState({ showIndicator: false })
        });
        //}
    }

    checkPaybleAmount = async (item, value, index) => {
        const { gameUsers } = this.state;
        if (!value || value == '') {
            item.paid_amount = '';
            gameUsers[index] = item;
            this.setState({ gameUsers: gameUsers })
        } else {
            var amount = parseFloat(value);
            if (isValidNumber(amount)) {
                let max_payble_amount = item.lost_amount;
                if (max_payble_amount < amount) {
                    let rem_amount_len = amount.toString().length;

                    if (max_payble_amount.toString().length + 1 < amount.toString().length) {
                        rem_amount_len = max_payble_amount.toString().length;
                    } else {
                        //let rem_amount_t_b_p = amount.toString();

                    }

                    amount = amount.toString()
                    //amount = amount.slice(0, amount.length - 1);
                    amount = amount.substring(0, rem_amount_len - 1);

                    item.paid_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })
                    ToastMessage('Cash paid cannot be more than the remaining balance', 'error')

                } else {
                    item.paid_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })
                    this.forceUpdate()
                }
            } else {
                ToastMessage('Please enter valid number', 'error')
            }
        }
    }

    payLostAmount = (item, index, type = 'manual') => {

        var gameDetails = this.props.gameDetails;
        if (item.lost_amount < item.paid_amount) {
            ToastMessage('Cash paid cannot be more than the remaining balance', 'error')
            return false;
        } else {
            let flag = true;
            if(item.current_status == 'Leave' && (!isValidNumberWithZero(item.paid_amount))){
                flag = false;
            }
            if(flag) {
                var gameDetails = this.props.gameDetails;
                this.setState({ showIndicator: true })
                let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, paid_amount: item.paid_amount };
                this.props.socket.emit("payLostAmount", params, (res) => {
                    if (res.status) {
                        if (type === 'manual') {
                            this.props.that.getActiveGame()
                        }
                    } else {
                        ToastMessage(res.message, "error")
                    }
                    this.setState({ showIndicator: false })
                });
            }
            
        }
    }


    checkReceivableAmount = async (item, value, index) => {
        const { gameUsers } = this.state;
        if (!value || value == '') {
            item.received_amount = '';
            gameUsers[index] = item;
            this.setState({ gameUsers: gameUsers })
        } else {
            var amount = parseFloat(value);
            if (isValidNumber(amount)) {
                let max_payble_amount = item.won_amount;
                if (max_payble_amount < amount) {
                    let rem_amount_len = amount.toString().length;

                    if (max_payble_amount.toString().length + 1 < amount.toString().length) {
                        rem_amount_len = max_payble_amount.toString().length;
                    } else {
                        //let rem_amount_t_b_p = amount.toString();

                    }

                    amount = amount.toString()
                    //amount = amount.slice(0, amount.length - 1);
                    amount = amount.substring(0, rem_amount_len - 1);

                    item.received_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })
                    ToastMessage('Received amount cannot be more than the balance to be paid', 'error')

                } else {
                    item.received_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })
                    this.forceUpdate()
                }
            } else {
                ToastMessage('Please enter valid number', 'error')
            }
        }
    }

    payReceivedAmount = (item, index) => {

        var gameDetails = this.props.gameDetails;
        if (item.won_amount < item.received_amount) {
            ToastMessage('Received amount cannot be more than the balance to be paid', 'error')
            return false;
        } else {

            var gameDetails = this.props.gameDetails;
            this.setState({ showIndicator: true })
            let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, received_amount: item.received_amount };
            this.props.socket.emit("payReceivedAmount", params, (res) => {
                if (res.status) {

                    this.props.that.getActiveGame()

                } else {
                    ToastMessage(res.message, "error")
                }
                this.setState({ showIndicator: false })
            });
        }
    }

    getBalance = (item) => {
        let balance = null;
        if (item.result == 'Winner') {
            balance = item.won_amount - item.received_amount;

        } else if (item.result == 'Loser') {
            if (item.lost_amount >= item.paid_amount) {
                balance = item.lost_amount - item.paid_amount;
            } else {
                balance = 0;
            }

        } else if (item.result == 'Quist') {
            balance = 0;
        }
        return balance;
    }

    winnerCashView = (item, index) => {
        const { user, gameDetails } = this.props

        if (gameDetails.status == 'Started' && item.current_status == 'Leave' && user.id === item.id && item.leave_request != 'Accepted') {
            return (
                <View style={[Styles.tbCol, { width: '60%', padding: 5 }]}>
                    <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Rcvd</Text>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                            <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                        </View>
                        <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark]}> {item.received_amount}</Text>
                    </View>
                    {/* <View style={styles.editBox}>
                        <TextInput
                            defaultValue={`${item.received_amount}`}
                            editable={(gameDetails.status === 'Tallied') ? false : true}
                            placeholder={'Enter'}
                            //onSubmitEditing={() => this.payLostAmount(item, index)} 
                            onBlur={() => this.payReceivedAmount(item, index)}
                            value={`${item.received_amount}`}
                            //onChangeText={(value) => item.paid_amount = value} 
                            onChangeText={(value) => { this.checkReceivableAmount(item, value, index) }}
                            returnKeyType='done'
                            keyboardType={"numeric"}
                            style={styles.inputField} />

                    </View> */}
                </View>
            );
        } else {
            return (
                <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                    <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Rcvd</Text>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                            <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                        </View>
                        <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark]}> {item.received_amount}</Text>
                    </View>
                </View>
            );
        }


    }
    resultView = (item, index) => {
        const { user, gameDetails } = this.props
        var placeholder = 'Enter';
        if (item.result == 'Loser' && this.state.banker.auto_assign_loss === 1) {
            if (item.lost_amount <= parseFloat(gameDetails.options.showdown)) {
            } else {
                // placeholder = gameDetails.options.showdown.toString();
                // item.paid_amount = gameDetails.options.showdown.toString();
            }
            // this.payLostAmount(item, index);
        }

        if (item.result == 'Winner') {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.greenBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9F9F1', padding: 5, }]}>
                                <Image source={Images.arrowGreen} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Won</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}>{item.won_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, }]}>
                                <Image source={Images.receiptIcon} style={{ height: 22, width: 26 }} />
                            </View>


                            {this.winnerCashView(item, index)}


                        </View>
                    </View>
                </View>
            )
        } else if (item.result == 'Loser') {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.redBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#FEECED', padding: 5, }]}>
                                <Image source={Images.arrowRed} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Lost</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}>{item.lost_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.yellowBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#FFF8EA', padding: 5, }]}>
                                <Image source={Images.paymentIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 5 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Paid</Text>
                                <View style={styles.editBox}>
                                    {(gameDetails.is_banker === 1 || (user.id === item.id)) ?
                                        <TextInput
                                            defaultValue={`${item.paid_amount}`}
                                            editable={(gameDetails.status === 'Tallied') ? false : true}
                                            placeholder={placeholder} //onSubmitEditing={() => this.payLostAmount(item, index)} 
                                            onBlur={() => this.payLostAmount(item, index)}
                                            value={`${item.paid_amount}`}
                                            //onChangeText={(value) => item.paid_amount = value} 
                                            onChangeText={(value) => { this.checkPaybleAmount(item, value, index) }}
                                            returnKeyType='done'
                                            keyboardType={"numeric"}
                                            style={styles.inputField} />
                                        :
                                        <TextInput value={`${item.paid_amount}`} placeholder="Enter" editable={false} style={styles.inputField} />

                                    }


                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else if (item.result == 'Quits') {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, flexDirection: 'row' }]}>
                                <Image source={Images.arrowGreen} style={styles.arrows} />
                                <Image source={Images.arrowRed} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Quits</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}>{item.lost_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, }]}>
                                <Image source={Images.paymentIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 5 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Paid</Text>
                                <View style={styles.editBox}>
                                    {(item.paid_amount > 0 && gameDetails.is_banker !== 1) ?
                                        <TextInput value={item.paid_amount.toString()} editable={false} style={styles.inputField} />
                                        :
                                        <TextInput
                                            defaultValue={`${item.paid_amount}`}
                                            editable={(gameDetails.status === 'Tallied') ? false : true}
                                            placeholder={placeholder} //onSubmitEditing={() => this.payLostAmount(item, index)} 
                                            onBlur={() => this.payLostAmount(item, index)}
                                            value={`${item.paid_amount}`}
                                            //onChangeText={(value) => item.paid_amount = value} 
                                            onChangeText={(value) => { this.checkPaybleAmount(item, value, index) }}
                                            returnKeyType='done'
                                            keyboardType={"numeric"}
                                            style={styles.inputField} />


                                    }


                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, flexDirection: 'row' }]}>
                                <Image source={Images.arrowGreen} style={styles.arrows} />
                                <Image source={Images.arrowRed} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Won/Loss</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, }]}>
                                <Image source={Images.receiptIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Paid/Rcvd</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark]}></Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            )
        }

    }

    renderCard = (item, index) => {
        const { user, gameDetails } = this.props
        var balance = this.getBalance(item);
        return (
            <View key={index} style={[styles.gridBox, { marginBottom: (this.state.gameUsers.length === index + 1) ? RFPercentage(15) : RFPercentage(2), backgroundColor: (gameDetails.is_banker === 1 || (user.id === item.id)) ? '#FFF' : '#DCDCDC' }]}>
                <View style={[Styles.tbRow]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: 10 }]}>
                        <View style={styles.userImgContainer}>
                            <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                        </View>

                    </View>
                    <View style={[Styles.tbCol, { width: '45%', flexDirection: 'row', height: '100%' }]}>
                        <View style={[{ flexDirection: 'row' }]}>

                            <View style={[Styles.tbCol, { width: '90%', }]}>
                                <Text style={[Styles.font18, Styles.fontMedium, Styles.textPrimaryDark, { textTransform: 'capitalize' }]}>{item.name}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '35%', padding: 5 }]}>
                        <Text style={[Styles.font10, Styles.fontRegular, Styles.textPrimaryDark]}>Total Buy in</Text>
                        <Text style={[Styles.font16, Styles.fontRegular, Styles.textGray]}>{item.buy_in}</Text>
                    </View>
                </View>

                <View style={{ paddingTop: 0, paddingBottom: 5 }}>
                    <Image source={Images.line} style={{ width: '100%', height: 1, alignSelf: 'center' }} />
                </View>

                {(gameDetails.is_banker === 1 || (user.id === item.id)) ?
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[Styles.tbCol, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            <Text style={[Styles.font14, Styles.fontMedium, Styles.textPrimaryDark]}>Chip Count</Text>
                        </View>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            <TextInput
                                editable={(gameDetails.status === 'Tallied') ? false : (gameDetails.is_banker !== 1 && item.leave_request == 'Accepted') ? false : true}
                                placeholder={(gameDetails.is_banker === 1 || (user.id === item.id)) ? "Enter total chips" : ""}
                                //onSubmitEditing={() => this.returnChips(item, index)} 
                                onBlur={() => this.returnChips(item, index)}
                                onChangeText={(value) => item.receive_buy_in = value} defaultValue={`${item.receive_buy_in}`}
                                returnKeyType='done'
                                keyboardType={"numeric"}
                                style={[Styles.inputField, (gameDetails.status === 'Tallied' || (gameDetails.is_banker !== 1 && (user.id !== item.id))) ? Styles.disabled : null]} maxLength={8} />

                        </View>
                    </View>
                    : <View style={{ flexDirection: 'row' }}>
                        <View style={[Styles.tbCol, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            <Text style={[Styles.font14, Styles.fontMedium, Styles.textPrimaryDark]}>Chip Count</Text>
                        </View>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            {/* <TextInput value="6000" style={Styles.inputField} /> */}
                            <TextInput editable={false} placeholder=""
                                defaultValue={`${item.receive_buy_in}`}
                                returnKeyType='done'
                                keyboardType={"numeric"}
                                style={[Styles.inputField, Styles.disabled]} maxLength={8} />

                        </View>
                    </View>}


                {this.resultView(item, index)}

                {(gameDetails.is_banker !== 1 && (user.id !== item.id) && !item.result) ? null :
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Image source={Images.line} style={{ width: '100%', height: 1, alignSelf: 'center' }} />
                    </View>
                }

                <View style={[{ flexDirection: 'row', padding: 15, paddingTop: 5, justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={[Styles.tbCol, { width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }]}>
                        {/* <TouchableOpacity style={{ width: '100%', height:normalize(30), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center', backgroundColor:'yellow' }}
                        onPress={() => {
                            if((item.result == 'Loser') && balance > 0){
                                this.backCount++
                                if (this.backCount == 2) {
                                    item.paid_amount = balance;
                                    this.payLostAmount(item, index)
                                    
                                    clearTimeout(this.backTimer)
                                    console.log("Clicked twice..2")
                                } else {
                                    this.backTimer = setTimeout(() => {
                                    this.backCount = 0
                                    }, 3000)
                                }
                            }
                        }}
                        >
                        <Text style={[Styles.font18, Styles.fontBold, Styles.textPrimaryDark]}>{(item.result == 'Loser') ? 'Balance to be paid' : (item.result == 'Winner') ? 'Balance to be rcvd' : 'Balance'}: </Text>
                        <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                            </View>
                        </View>
                        <Text style={[Styles.font18, Styles.fontRegular, Styles.textPrimaryDark]}>{balance}</Text>
                        </TouchableOpacity> */}
                        <DoubleClicker onClick={() => {
                            if ((item.result == 'Loser') && balance > 0) {
                                item.paid_amount = balance;
                                this.payLostAmount(item, index)
                            }
                        }}
                            style={[Styles.tbCol, { width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }]}
                        >
                            <Text style={[Styles.font18, Styles.fontBold, Styles.textPrimaryDark]}>{(item.result == 'Loser') ? 'Balance to be paid' : (item.result == 'Winner') ? 'Balance to be rcvd' : 'Balance'}: </Text>
                            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                                <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                    <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                </View>
                            </View>
                            <Text style={[Styles.font18, Styles.fontRegular, Styles.textPrimaryDark]}>{balance}</Text>
                        </DoubleClicker>
                    </View>

                </View>

            </View>


        );

    }
    listHeader = () => {
        const { chipsData } = this.state;
        return (<View style={[styles.gridBox2]}>
            <View style={[Styles.tbRow, { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 5 }]}>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.coinup} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.total_wining}</Text>
                </View>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.coindown} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.total_losing}</Text>
                </View>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.coinstate} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.total_difference}</Text>
                </View>
            </View>
            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                <Image source={Images.line} style={{ width: '100%', height: 1, alignSelf: 'center' }} />
            </View>

            <View style={[Styles.tbRow, { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 5 }]}>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.all_player} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.total_users}</Text>
                </View>
                <View style={Styles.borderHr}></View>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.winplayer} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.winners}</Text>
                </View>
                <View style={Styles.borderHr}></View>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.loosplayer} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.loosers}</Text>
                </View>
                <View style={Styles.borderHr}></View>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.quits_player} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.quits}</Text>
                </View>
                <View style={Styles.borderHr}></View>
                <View style={[Styles.colCenter]}>
                    <Image source={Images.playercoin} resizeMode="contain" style={Styles.payoutCoins} /><Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{chipsData.total_cash_paid}</Text>
                </View>
            </View>
        </View>)
    }
    renderView = () => {
        const { gameDetails } = this.props;
        const { refreshing, gameUsers } = this.state;
        return (
            <>
                <View style={styles.grid}>
                    <View style={{ paddingBottom: normalize(100), }}>
                        {this.listHeader()}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ paddingBottom: normalize(20), paddingLeft: normalize(15), paddingRight: normalize(15) }}>
                            {gameUsers.map((item, index) => {
                                return (this.renderCard(item, index))
                            })}
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* <FlatList
                            contentContainerStyle={{ paddingBottom: 70, paddingLeft: 5, paddingRight: 5 }}
                            showsVerticalScrollIndicator={false}
                            data={gameUsers}
                            renderItem={({ item, index }) => this.renderCard(item, index)}
                            keyExtractor={item => item.id.toString() + Math.om()}
                            refreshing={refreshing}
                            onRefresh={() => {
                                this.props.that.getActiveGame(this.props.user)
                            }}
                        /> */}
                    </View>

                </View>
            </>
        );
    }
    render() {
        return this.renderView();
        return (
            <ContainerListScreen styles={{ paddingBottom: 35, backgroundColor: '#F8F9F9', paddingLeft: 0, paddingRight: 0, paddingTop: 0 }} children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    grid: {
        height: '100%',
    },
    gridBox2: {
        width: '100%',
        height: normalize(100),
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: normalize(15),
        padding: 15
    },
    gridBox: {
        width: '98%',
        marginLeft: RFPercentage(0.4),
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 15,
        marginTop: 5
    },

    row: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row',
        padding: 10
    },
    greenBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#E9F9F1', borderRadius: 8,
        overflow: 'hidden'
    },
    grayBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#E9EBEE', borderRadius: 8,
        overflow: 'hidden'
    },
    redBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#FEECED', borderRadius: 8,
        overflow: 'hidden'
    },
    yellowBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#FFF8EA', borderRadius: 8,
        overflow: 'hidden'
    },
    editBox: {
        flexDirection: 'row', alignItems: 'center',
    },
    inputField: {
        borderColor: '#FFF8EA', borderRadius: 4, borderWidth: 1, padding: normalize(5),
        height: normalize(25),
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: normalize(14),
        color: '#77869E',
        fontFamily: 'Medium'
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
    userImgContainer: {
        height: RFPercentage(6),
        width: RFPercentage(6),
        borderRadius: 50,
        overflow: 'hidden'
    },

    cardImage: {
        height: RFPercentage(6),
        width: RFPercentage(6),
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
    arrows: {
        height: 22,
        width: 15
    }
});