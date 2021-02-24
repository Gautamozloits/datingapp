/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput,
    Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, SafeAreaView, StatusBar, Dimensions, Keyboard, Platform
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

import { LinearGradient } from 'expo-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images, { back } from '../../../constants/Images';
import { SmallButton, SwitchExample, RoundButton2 } from '../../components/Buttons/Button';
import ContainerFixScreen from '../Views/ContainerFixScreen';
import { HeaderBG, HeaderLeft, PaymentFilter } from '../../components/HeaderOptions';
import { ToastMessage } from '../../components/ToastMessage';
import normalize from 'react-native-normalize';
import { isValidNumber, getSumofNumber } from '../../api/service';
import DoubleClicker from '../../components/react-native-double-click/main';
import SwipeItemRowRight from '../Comman/SwipeItemRowRight';
import SwipeRow from '../Comman/SwipeRow';

const screenHeight = Math.round(Dimensions.get('window').height);
var isApiCalled = false;
export default class CashSettlement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
            listRecords: [],
            switch1Value: false,
            details: {},
            winners: [],
            showingKeyboard: false,
            showList: true
        };
    }

    componentDidMount() {
        const { gameId } = this.props
        this.getCashCollections(gameId);
        if (Platform.OS == 'ios') {
            this.setState({paddingBottom: RFPercentage(13)});
        }else{
            this.setState({paddingBottom: RFPercentage(23)});
        }
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        if (Platform.OS == 'ios') {
            this.setState({ paddingBottom: RFPercentage(2), showingKeyboard: true })
        } else {
            this.setState({ paddingBottom: RFPercentage(5), showingKeyboard: true })
        }

    }

    _keyboardDidHide = () => {
        if (Platform.OS == 'ios') {
            this.setState({ paddingBottom: RFPercentage(13), showingKeyboard: false })
        } else {
            this.setState({ paddingBottom: RFPercentage(23), showingKeyboard: false })
        }
    }

    getCashCollections = async (game_id) => {
        this.props.socket.emit("getCashCollections", { game_id: game_id }, (res) => {
            console.log('=======',JSON.stringify(res))
            if (res.status) {
                let losers = res.data.losers;
                let losersUser = [];
                let total_remaining_amount = 0;
                losers.map((user, index) => {
                    let USER = user;

                    let balance = user.remaining_amount_tobe_paid
                    if (user.creditors && user.creditors !== '') {
                        let filteredPeople = JSON.parse(user.creditors);
                        let settled_amount = getSumofNumber(filteredPeople, 'amount')
                        balance = balance - settled_amount;
                    }
                    total_remaining_amount = total_remaining_amount + balance;

                    USER.remaining_amount_tobe_paid_show = balance;
                    if (user.creditors && user.creditors !== '') {
                        USER.creditors = JSON.parse(user.creditors);
                    } else {
                        USER.creditors = [];
                    }
                    losersUser.push(USER);
                })
                console.log('total_remaining_amount: ',total_remaining_amount)
                var winners = res.data.winners;
                var winnerUsers = [];
                if(total_remaining_amount == 0){
                    
                    winners.map((user, index) => {
                        let USER = user;
                        USER.received_amount = user.won_amount - user.settled_amount;
                        USER.remaining_amount_tobe_rcvd_show = 0;
                        //USER.remaining_amount_tobe_rcvd_show = parseFloat(user.won_amount) - (parseFloat((user.received_amount && user.received_amount != '') ? user.received_amount : 0) + (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0)));
                        winnerUsers.push(USER);
                    })
                    let data = res.data;
                    let received_amount = getSumofNumber(winners, 'received_amount')
                    data.total_received_cash_amount_show = data.total_received_cash_amount - received_amount;
                    if (data.is_win_ratio == 1) {
                        this.setState({ switch1Value: true })
                    } else {
                        this.setState({ switch1Value: false })
                    }
                    this.setState({ details: data, winners: winnerUsers })
                    this.updateCashCollection();
                }else{
                    
                    winners.map((user, index) => {
                        let USER = user;
                        USER.remaining_amount_tobe_rcvd_show = parseFloat(user.won_amount) - (parseFloat((user.received_amount && user.received_amount != '') ? user.received_amount : 0) + (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0)));
                        //USER.remaining_amount_tobe_rcvd_show = user.won_amount - user.received_amount;//user.remaining_amount_tobe_rcvd;
                        // USER.creditors = [];
                        winnerUsers.push(USER);
                    })
                    let data = res.data;
                    let received_amount = getSumofNumber(winners, 'received_amount')
                    data.total_received_cash_amount_show = data.total_received_cash_amount - received_amount;
                    if (data.is_win_ratio == 1) {
                        this.setState({ switch1Value: true })
                    } else {
                        this.setState({ switch1Value: false })
                    }
                    this.setState({ details: data, winners: winnerUsers })

                    this.props.cashCallback(data);
                }
                
                
            }
        })
    }

    toggleSwitch1 = (value) => {
        this.setState({ switch1Value: value })
        if (value) {
            var totalCashCollected = this.getCashBalance();//parseFloat(this.state.details.total_received_cash_amount);
            var totalWinningAmount = parseFloat(this.sumObject2(this.state.winners, 'remaining_amount_tobe_rcvd_show'));
            this.state.winners.map((user, index) => {
                //if(!user.received_amount){

                let p1 = parseFloat(user.remaining_amount_tobe_rcvd_show);

                var will_pay = ((parseFloat(p1) / parseFloat(totalWinningAmount)) * parseFloat(totalCashCollected)).toFixed();

                var cashWillSuggestion = 0;

                if (this.state.winners.length > 1 && (will_pay / 500) !== (will_pay % 500)) {

                    cashWillSuggestion = ((will_pay / 500).toFixed()) * 500;
                } else {
                    cashWillSuggestion = will_pay;
                }


                //cashWillSuggestion = will_pay;
                user.cash_suggestion = cashWillSuggestion;
                // }

            })
            // var totalCashSuggestion = parseFloat(this.sumObject(this.state.winners, 'cash_suggestion'));
            // if (totalCashSuggestion > totalCashCollected) {
            //     this.state.winners[0].cash_suggestion = this.state.winners[0].cash_suggestion - (totalCashSuggestion - totalCashCollected);
            // } else if (totalCashSuggestion < totalCashCollected) {
            //     this.state.winners[0].cash_suggestion = this.state.winners[0].cash_suggestion + (totalCashCollected - totalCashSuggestion);
            // }
        } else {
            this.state.winners.map((user, index) => {
                user.cash_suggestion = 'Enter Cash';
            })
        }
        this.forceUpdate()
    }
    sumObject = (items, prop) => {
        return items.reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };

    sumObject2 = (items, prop) => {
        return items.reduce(function (a, b) {
            if (!b['received_amount']) {
                return parseFloat(a) + parseFloat(b[prop]);
            } else {
                return parseFloat(a);
            }
        }, 0);
    };


    updateCashCollection = () => {
        var winners = this.state.winners;

        var gameDetails = this.state.details;
        this.setState({ showIndicator: true })
        let params = { game_id: gameDetails.id, winners: winners, is_win_ratio: this.state.switch1Value };
        this.props.socket.emit("updateCashCollections", params, (res) => {
            if (res.status) {
                this.props.cashCallback();
            } else {
                ToastMessage(res.message, "error")
            }
            this.setState({ showIndicator: false })
        });


    }
    updateCashCollectionOnSwipe = (winners, type) => {
        
        var gameDetails = this.state.details;
        this.setState({ showIndicator: true })
        if(type == 'swipe'){
            this.setState({ showList: false })
        }
        let params = { game_id: gameDetails.id, winners: winners, is_win_ratio: this.state.switch1Value };
        this.props.socket.emit("updateCashCollections", params, (res) => {
            if (res.status) {
                this.props.cashCallback();
            } else {
                ToastMessage(res.message, "error")
            }
            isApiCalled = false;
            this.setState({ showIndicator: false })
            if(type == 'swipe'){
                this.setState({ showList: true })
            }
        });
    }

    updateCashSettlement = async (value, user, index) => {
        const { winners, details } = this.state;

        if (!value || value == '') {
            let amount = 0;
            user.remaining_amount_tobe_rcvd_show = parseFloat(user.won_amount) - (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0));
            user.received_amount = '';
            winners[index] = user;

            let balance = getSumofNumber(winners, 'received_amount')
            details.total_received_cash_amount_show = details.total_received_cash_amount - balance;
            this.setState({ winners: winners, details: details })
        } else {
            var amount = parseFloat(value);
            if (isValidNumber(amount)) {
                let arr = JSON.parse(JSON.stringify(winners));

                var filteredPeople = arr.filter((item) => item.id !== user.id);

                let balance = await getSumofNumber(filteredPeople, 'received_amount')
                let new_total_received_cash_amount = balance + amount;
                let remaining_amount1 = parseFloat(user.won_amount) - (parseFloat((user.amount && user.amount != '') ? user.amount : 0) + (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0)));
                if (new_total_received_cash_amount > details.total_received_cash_amount) {
                    amount = amount.toString()
                    amount = amount.slice(0, amount.length - 1);
                    user.received_amount = amount;
                    winners[index] = user;

                    this.setState({ winners: winners })

                    ToastMessage('You cannot pay more than the cash collection', 'error')
                    return false;
                } else if (remaining_amount1 >= parseFloat(amount)) {

                    user.remaining_amount_tobe_rcvd_show = remaining_amount1 - parseFloat(amount);
                    user.received_amount = amount;
                    winners[index] = user;

                    let balance = getSumofNumber(winners, 'received_amount')
                    details.total_received_cash_amount_show = details.total_received_cash_amount - balance;
                    this.setState({ winners: winners, details: details })
                } else {
                    amount = amount.toString()
                    amount = amount.substring(0, amount.length - 1);
                    user.received_amount = amount;
                    winners[index] = user;

                    this.setState({ winners: winners })
                    ToastMessage('You cannot pay more than remaining amount.', 'error')
                    return false;
                }
            } else {
                ToastMessage('Please enter valid number', 'error')
            }
        }
        if (this.state.switch1Value) {
            this.toggleSwitch1(true)
        }

    }

    updateCashSettlementOnSwipe = async (value, user, index, type='swipe') => {
        const { winners, details } = this.state;
        if (!value || value == '') {
            let amount = 0;
            user.remaining_amount_tobe_rcvd_show = parseFloat(user.won_amount) - (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0));
            user.received_amount = '';
            winners[index] = user;

            let balance = getSumofNumber(winners, 'received_amount')
            details.total_received_cash_amount_show = details.total_received_cash_amount - balance;
            this.setState({ winners: winners, details: details })
            this.updateCashCollectionOnSwipe(winners, type);
        } else {
            var amount = parseFloat(value);
            if (isValidNumber(amount)) {
                let arr = JSON.parse(JSON.stringify(winners));

                var filteredPeople = arr.filter((item) => item.id !== user.id);

                let balance = await getSumofNumber(filteredPeople, 'received_amount')
                let new_total_received_cash_amount = balance + amount;
                let remaining_amount1 = parseFloat(user.won_amount) - (parseFloat((user.amount && user.amount != '') ? user.amount : 0) + (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0)));
                if (new_total_received_cash_amount > details.total_received_cash_amount) {
                    amount = amount.toString()
                    amount = amount.slice(0, amount.length - 1);
                    user.received_amount = amount;
                    winners[index] = user;

                    this.setState({ winners: winners })

                    ToastMessage('You cannot pay more than the cash collection', 'error')
                    return false;
                } else if (remaining_amount1 >= parseFloat(amount)) {

                    user.remaining_amount_tobe_rcvd_show = remaining_amount1 - parseFloat(amount);
                    user.received_amount = amount;
                    winners[index] = user;

                    let balance = getSumofNumber(winners, 'received_amount')
                    details.total_received_cash_amount_show = details.total_received_cash_amount - balance;
                    this.setState({ winners: winners, details: details })
                    this.updateCashCollectionOnSwipe(winners, type);
                } else {
                    amount = amount.toString()
                    amount = amount.substring(0, amount.length - 1);
                    user.received_amount = amount;
                    winners[index] = user;

                    this.setState({ winners: winners })
                    ToastMessage('You cannot pay more than remaining amount.', 'error')
                    return false;
                }
            } else {
                ToastMessage('Please enter valid number', 'error')
            }
        }
        if (this.state.switch1Value) {
            //this.toggleSwitch1(true)
        }

    }

    getCashBalance() {
        const { details } = this.state;
        if (details.winners) {
            var total_received_amount = 0;
            details.winners.map((value, key) => {
                let amount = (value.received_amount && value.received_amount !== '') ? value.received_amount : 0;
                total_received_amount = parseFloat(total_received_amount) + parseFloat(amount)
            })
            return (parseFloat(details.total_received_cash_amount) - parseFloat(total_received_amount));
        }


    }
    fillMaxValue = (cash_suggestion, item, index) => {
        let available_balance = this.getCashBalance();
        let amount = 0;
        if (available_balance >= item.remaining_amount_tobe_rcvd_show) {
            amount = item.received_amount = item.remaining_amount_tobe_rcvd_show;
        } else {
            amount = item.received_amount = ((item.remaining_amount_tobe_rcvd_show) - (item.remaining_amount_tobe_rcvd_show - available_balance));
        }
        this.updateCashSettlementOnSwipe(amount, item, index, 'double_tap')
    }
    renderCard = (item, index) => {
        return (
            <View style={[styles.tbRow, (item.remaining_amount_tobe_rcvd_show == 0 && (!item.received_amount || item.received_amount == '')) ? Styles.bgGray : Styles.bgWhite]} key={index}>
                <View style={[Styles.tbCol, { width: '45%' }]}>
                    <View style={[Styles.tbRow, { width: '100%' }]}>
                        <View style={[Styles.tbCol,{ width: '30%' }]}>
                            <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                        </View>

                        <View style={[Styles.tbCol, Styles.centerText, { width: '70%' }]}>
                        <DoubleClicker 
                        onClick={() => {
                            this.fillMaxValue(item.cash_suggestion, item, index);
                        }}
                        style={[Styles.centerText]}
                    >
                            <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>{item.name}</Text>
                            <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>{item.remaining_amount_tobe_rcvd_show}/{item.won_amount}</Text>
                            </DoubleClicker>
                        </View>
                    </View>
                </View>


                <View style={[Styles.tbCol, Styles.centerText, { width: '30%' }]}>
                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                        <Image source={Images.rsGreen} style={{ height: normalize(15), width: normalize(15) }} />
                    </View>
                    <View style={styles.hrGreen} />
                </View>

                <View style={[Styles.tbCol, Styles.centerText, { width: '25%' }]}>
                    <TextInput
                        editable={(item.remaining_amount_tobe_rcvd_show == 0 && (!item.received_amount || item.received_amount == '')) ? false : true}
                        placeholder={(item.cash_suggestion) ? item.cash_suggestion.toString() : 'Enter Cash'}
                        defaultValue={`${item.received_amount}`}
                        value={`${item.received_amount}`}
                        onBlur={() => this.updateCashCollection()}
                        onChangeText={(value) => {
                            this.updateCashSettlement(value, item, index)
                        }}
                        returnKeyType="done"
                        keyboardType={"numeric"} style={[Styles.inputField, { color: '#042C5C' }]} />
                </View>

            </View>
        );


    }


    renderItem = ({ item, index }) => (
        <SwipeRow
            key={item.key}
            item={item}
            swipeThreshold={-150}
            onSwipe={this.deleteItem}
        >
            <Text style={[styles.text, { backgroundColor: item.backgroundColor }]}>{item.text}</Text>
        </SwipeRow>
    )
    updateOnSwipe2 = (item) => {
        const { winners } = this.state
        var index = winners.findIndex((value) => {
            return value.id === item.id;
        })
        if (index > -1) {
            if (winners[index].cash_suggestion > 0 && winners[index].received_amount <= 0) {
                this.updateCashSettlementOnSwipe(winners[index].cash_suggestion, winners[index], index, 'swipe')
            }
        }
    }
    renderView = () => {
        const { details, winners, showList } = this.state

        // const onSwipeValueChange = swipeData => {
        //     const { key, value } = swipeData;
        //     if (!isApiCalled && ((value >= Dimensions.get('window').width / 3))) {
        //         if (winners[key].cash_suggestion > 0) {
        //             isApiCalled = true;
        //             winners[key].received_amount = winners[key].cash_suggestion;
        //             this.updateCashSettlementOnSwipe(winners[key].cash_suggestion, winners[key], key)
        //         }
        //     }
        // };
        const updateOnSwipe = (index) => {
            if (winners[index].cash_suggestion > 0) {
                this.updateCashSettlementOnSwipe(winners[index].cash_suggestion, winners[index], index)
            }
        }

        return (
            <>
                <View style={styles.grid}>
                    {!this.state.showingKeyboard ?
                        <View style={[{ paddingTop: normalize(10), paddingLeft: normalize(10), paddingRight: normalize(10), marginBottom: normalize(16) }]}>
                            <View style={[{ flexDirection: 'row', backgroundColor: '#FFF', marginBottom: 0, borderRadius: 10, padding: normalize(10) }]}>
                                <View style={[Styles.tbCol, { width: '75%' }]}>
                                    <Text style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark]}>Total cash Collection</Text>
                                    <Text style={[Styles.font10, Styles.fontRegular, Styles.textPrimaryDark]}>Suggest pay out based on win ratio</Text>
                                </View>
                                <View style={[Styles.tbCol, { width: '25%', alignItems: 'flex-end' }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                            <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                        </View>
                                        <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray]}>{details.total_received_cash_amount}</Text>
                                    </View>
                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end', marginRight: -10 }}>
                                        <SwitchExample
                                            toggleSwitch1={this.toggleSwitch1}
                                            switch1Value={this.state.switch1Value} />
                                    </View>

                                </View>
                            </View>
                        </View>
                        : null}
                    <View style={{ flex: 1 }}>
                        {showList ? <FlatList
                            contentContainerStyle={{ paddingBottom: 120, paddingLeft: normalize(10), paddingRight: normalize(10) }}
                            data={winners}
                            keyExtractor={(item, index) => "" + index}
                            //renderItem={({item, index}) => {return (<SwipeItemRowRight data={item} handleAction={() => updateOnSwipe(index)} >{this.renderCard(item, index)}</SwipeItemRowRight>)}}
                            renderItem={({ item, index }) =>
                                <SwipeRow
                                    key={item.id}
                                    item={item}
                                    swipeThreshold={150}
                                    onSwipe={this.updateOnSwipe2}
                                >
                                    {this.renderCard(item, index)}
                                </SwipeRow>
                            }
                        /> : null}
                        

                        {/* <SwipeListView
                            data={winners}
                            renderItem={({ item, index }) => this.renderCard(item, index)}
                            renderHiddenItem={({ item, index }) => {
                                return (
                                    <View style={[Styles.tbRow]}>
                                        <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row', justifyContent: 'space-between' }]}>

                                        </View>
                                        <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-end' }]}>
                                        </View>
                                    </View>
                                )
                            }

                            }

                            keyExtractor={(item, index) => "" + index}
                            disableRightSwipe={(!this.state.switch1Value) ? true : false}
                            disableLeftSwipe
                            leftOpenValue={Dimensions.get('window').width}
                            onSwipeValueChange={onSwipeValueChange}
                            leftOpenValue={0}
                        /> */}

                        {/* <ScrollView style={{ paddingBottom: normalize(20), paddingLeft: normalize(10), paddingRight: normalize(10) }}>
                            {winners.map((item, index) => {
                                return (this.renderCard(item, index))
                            })}
                        </ScrollView> */}
                    </View>
                    <View style={{ height: RFPercentage(8), backgroundColor: '#FFF', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <Image source={Images.line} resizeMode="cover" style={{ width: '100%', height: 1, alignSelf: 'center' }} />

                        <View style={[Styles.tbRow, { paddingLeft: normalize(20), paddingRight: normalize(20), height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
                            <View style={[Styles.tbCol, { width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }]}>
                                <Text style={[Styles.font18, Styles.fontBold, Styles.textPrimaryDark]}>Balance Cash: </Text>
                                <View>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                </View>
                                <Text style={[Styles.font18, Styles.fontRegular, Styles.textPrimaryDark]}> {this.getCashBalance()}</Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '26%', justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                            </View>


                        </View>

                    </View>
                </View>

            </>
        );
    }
    render() {
        const { paddingBottom } = this.state;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0} >
                <SafeAreaView style={[Styles.safearea,]}>
                    <LinearGradient colors={["#2A395B", "#080B12"]} start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <StatusBar translucent={true} backgroundColor={'transparent'} />
                    </LinearGradient >

                    <View style={[Styles.container, { padding: 10, paddingBottom: paddingBottom, backgroundColor: '#FFF' }]}>
                        {this.renderView()}
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    grid: {
        height: '100%',
        backgroundColor: '#F9F9F9',
        //paddingBottom: 10,
        //marginTop: 16,
        borderRadius: 10,
        flexDirection: 'column',
        //padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    row: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row', padding: 10,
    },
    tbRow: {
        flexDirection: 'row', backgroundColor: '#FFF', marginBottom: normalize(16), borderRadius: 10,
        paddingLeft: normalize(10),
        paddingRight: normalize(10),
        paddingTop: normalize(15),
        paddingBottom: normalize(15),
    },
    cardImage: {
        height: normalize(35),
        width: normalize(35),
        borderRadius: 8
    },
    inputField: {
        borderColor: '#DFE7F5',
        borderWidth: 1,
        borderRadius: 4,
        height: normalize(30),
        width: '100%',
        paddingLeft: 5,
        fontSize: RFPercentage(1.4),
        color: '#77869E',
        fontFamily: 'Regular'
    },
    hrGreen: {
        height: 1,
        width: '80%',
        backgroundColor: '#E9F9F1',
        position: 'absolute',
        zIndex: -1
    }
});