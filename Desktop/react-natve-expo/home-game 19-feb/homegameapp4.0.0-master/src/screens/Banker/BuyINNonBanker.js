/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput,
    Image, StyleSheet, FlatList, AppState, ImageBackground, KeyboardAvoidingView
} from 'react-native';
import Stopwatch  from '../../components/StopWatch';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, kFormatter, isValidNumber, getUserDetail } from '../../api/service';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader';
import { ToastMessage } from '../../components/ToastMessage';
import Global from '../../../constants/Global';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SwipeBtn, PlainIcon } from '../../components/Buttons/Button';
import BuyInLayout from '../Views/BuyInLayout';
import InputScorllList from '../Views/InputScorllList';
import normalize from 'react-native-normalize';
import moment from "moment";

export default class BuyINNonBanker extends React.Component {

   
    constructor(props) {
        super(props);
        this.state = {
            listRecords: [],
            switch1Value: false,
            gameDetails:{},
            showIndicator: false,
            refreshing:false,
            timerStart: false,
            startTime:0,
            user:{},
            appState: AppState.currentState,
        };
    }
    componentDidMount = async() => {
        AppState.addEventListener('change', this._handleAppStateChange);
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
    getStartTime() {
        var gameDetails = this.props.gameDetails;
        if (gameDetails && gameDetails.start_time) {
            
            var eventTime = moment(gameDetails.start_time, 'YYYY-MM-DD HH:mm:ss').format('X')
            let current_utc_time = moment.utc().format('YYYY-MM-DD HH:mm:ss');
            var currentTime = moment(current_utc_time).format('X');
            var diffTime = currentTime - eventTime;
            var duration = diffTime * 1000;
            this.setState({ startTime: duration, timerStart: true })

        //   var eventTime = moment(gameDetails.start_time, 'YYYY-MM-DD HH:mm:ss').format('X')
        //   var currentTime = moment().format('X');
        //   var diffTime = currentTime - eventTime;
        //   var duration = diffTime * 1000;
        //     this.setState({startTime: duration, timerStart: true})
        }
      }
    totalBuyIn = (amount_history) => {
        let str = '';
        if(amount_history && amount_history != ''){
            amount_history = JSON.parse(amount_history)
            let arr = []
            amount_history.map((amount) => {
                arr.push(kFormatter(amount));
            })
            str = arr.join(' + ')
        }
        return str;
    }

    requestBuyIn = (item, index) => {
        //console.log(item)
        if (item.request_buyin !== '' && item.request_buyin > 0 && isValidNumber(item.request_buyin)) {
            console.log('item.request_buyin: ',item.request_buyin)
            const { gameDetails } = this.props;
            var gameUers = gameDetails.users;
            let amount = item.request_buyin
            let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, request_buyin: amount };
            console.log(params);
            this.props.socket.emit("requestBuyIn", params, (res) => {
                console.log(res)
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
        } else {
            if (item.request_buyin && item.request_buyin !== '' && !isValidNumber(item.request_buyin)) {
                ToastMessage("Please enter only numbers", "error")
            }

        }

    }

    

    renderCard = (item, index) => {
        var win_lost_amount = '0';
        var icon = 'arrowup';
        var icon_color = '#9DA4AF';
        if(item.result == 'Winner' && item.won_amount > 0){
            win_lost_amount = item.won_amount;
            icon = 'arrowup';
            icon_color = '#53C874';
        }else if(item.result == 'Loser' && item.lost_amount > 0){
            win_lost_amount = item.lost_amount;
            icon = 'arrowdown';
            icon_color = '#F24750';
        }
        return (
            <View style={[styles.userRow, (item.current_status === 'Start') ? styles.activeRow : styles.inactiveRow]}>
                <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: normalize(10)}]}>
                    <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                    {(item.is_banker == 1) ? <View style={[Styles.shadow5, { borderRadius: 50,position: 'absolute', right: 0 }]}><Image source={Images.bankerIcon} style={{ height: normalize(20), width: normalize(20) }} /></View> : null}

                </View>
                <View style={[Styles.tbCol, { width: '40%', flexDirection: 'row' }]}>
                    <View style={[{ flexDirection: 'row' }]}>
                        <View style={[Styles.tbCol, { width: '5%' }]}>
                            <View style={styles.borderVertical}>
                                <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
                            </View>
                        </View>
                        <View style={[Styles.tbCol, { width: '90%',paddingLeft: normalize(10) }]}>
                            <Text style={[Styles.font14, Styles.fontMedium, Styles.textPrimaryDark, Styles.title]}>{item.name}</Text>
                            <View style={[Styles.tbCol, { width: '100%' }]}>
                                <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimaryDark]}>Total Buy In
                                </Text>
                                <View style={[{ flexDirection:'row', alignItems:'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.coinYellow} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, {marginLeft: 5}]}>{item.buy_in}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tbCol, Styles.centerText, { width: '40%', height: '100%' }]}>
                    <ImageBackground source={Images.RectangleBg} style={styles.gridBGImage} resizeMode="cover">
                    {(item.current_status === 'Leave') ? 
                    <View style={[Styles.tbRow, Styles.centerText, { marginTop: 5, width: '60%' }]}>
                    <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textGray, { marginLeft: 5 }]}>{win_lost_amount}</Text>
                    {(item.current_status === 'Leave' && item.leave_request == 'Accepted') ? <PlainIcon name={icon} type="AntDesign" color={icon_color} fontSize={16} />: null}

                </View>
                : <Text style={[Styles.font12, Styles.fontRegular, Styles.textGray, {paddingLeft: normalize(30), paddingRight: normalize(5),flexWrap: 'wrap'}]}>{this.totalBuyIn(item.amount_history)}</Text>}
                        
                    </ImageBackground>
                </View>
            </View>

        );

    }
    renderView = () => {
        const { gameDetails } = this.props;
        const { refreshing,user } = this.state;
        return (
            <>
                {gameDetails.game_user_id ? 
                <View style={styles.grid}>
                    <View style={{}}>
                        <View style={[{ flexDirection: 'row', backgroundColor: '#FFF', marginBottom: normalize(16), borderRadius: 10 }]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: normalize(10)}]}>
                                <Text style={[Styles.font18, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.date, 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
                                <Text style={[Styles.font14, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.date, 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
                                <Text style={[Styles.font14, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY')}</Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row',paddingLeft: normalize(5) }]}>
                                <View style={[{ flexDirection: 'row' }]}>
                                    <View style={[Styles.tbCol, { width: '5%' }]}>
                                        <View style={styles.borderVertical}>
                                            <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
                                        </View>
                                    </View>
                                    <View style={[Styles.tbCol, Styles.centerText, { width: '90%',paddingLeft: normalize(10) }]}>
                                        {this.state.timerStart ? <Stopwatch laps 
                                            options={{container: {
                                                backgroundColor: 'transparent',
                                            },
                                            text: {
                                                fontSize: normalize(18),
                                                color: '#1BC773',
                                                fontFamily: 'Medium',
                                            }}} 
                                            start={this.state.timerStart} startTime={this.state.startTime} gameStartTime={gameDetails.start_time}/> : null}
                                        {/* <TextInput style={[Styles.font16, Styles.fontMedium, Styles.green]} editable={false} ref={component=> this.props.that._TimerComponent=component}/>  */}
                                        <View style={[Styles.tbCol, { width: '100%', flexDirection: 'row', alignItems: 'center' }]}>
                                                <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimaryDark]}>Total Players: </Text><Text style={[Styles.font16, Styles.fontMedium, Styles.textGray]}> {gameDetails.users.length}</Text>
                                            </View>
                                            
                                        <View style={[Styles.tbCol, { width: '100%', flexDirection: 'row', alignItems: 'center' }]}>
                                            <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimaryDark]}>Table buy In - </Text>
                                            <View>
                                                <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                                    <Image source={Images.coinYellow} style={{ height: RFPercentage(2), width: RFPercentage(2) }} />
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
                    <KeyboardAvoidingView style={{height:'100%'}} keyboardVerticalOffset = {0} behavior="pedding" enabled>
                        <SwipeListView
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={{ paddingBottom: 120, paddingLeft: 2, paddingRight: 2 }}
                            showsVerticalScrollIndicator={false}
                            data={gameDetails.users}
                            renderItem={({ item, index }) => this.renderCard(item, index)}
                            renderHiddenItem={({ item, index }) => {
                                if (item.current_status === 'Start' &&  user.id == item.id) {
                                    return (
                                        <View style={styles.rowBack}>
                                            <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row', justifyContent: 'space-between' }]}>
                                                
                                            </View>
                                            <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-end', flexDirection:'row', paddingRight: 10 }]}>
                                            <TextInput
                                                defaultValue={(item.request_buyin > 0) ? item.request_buyin.toString() : null}
                                                placeholder="Enter Chips"
                                                onChangeText={(value) => item.request_buyin = value}
                                                maxLength={8}
                                                keyboardType={"numeric"}
                                                returnKeyType='done'
                                                style={[Styles.inputField, { width: '70%', marginRight: 10 }]}
                                            />
                                            
                                                <SwipeBtn onPress={() =>
                                                    this.requestBuyIn(item, index)
                                                    } 
                                                    //image={Images.deleteIcon} 
                                                    label={(item.request_status == 'Pending') ? "Update" : "Request"} fontSize={1.4} btnStyle={{ width: normalize(60), justifyContent: 'center' }} />
                                            </View>
                                        </View>
                                    )
                                }
                            }
                            }
                            disableRightSwipe
                            rightOpenValue={-180}
                            keyExtractor={item => item.game_user_id.toString() + Math.random()}
                            refreshing={refreshing}
                            onRefresh={() => {
                                this.props.that.getActiveGame(this.props.user)
                            }}
                            ListFooterComponent={() => <View style={{height:100}}/>}
                        />    
                        </KeyboardAvoidingView>                       
                        {/* <FlatList
                            contentContainerStyle={{ paddingBottom: 120 }}
                            showsVerticalScrollIndicator={false}
                            data={gameDetails.users}
                            renderItem={({ item, index }) => this.renderCard(item, index)}
                            keyExtractor={item => item.game_user_id.toString() + Math.random()}
                            refreshing={refreshing}
                            onRefresh={() => {
                                this.props.that.getActiveGame(this.props.user)
                            }}
                            ListFooterComponent={() => <View style={{marginBottom:50}}/>}
                        /> */}
                    </View>

                </View>
                : null}
            </>
        );
    }
    render() {
        const { user } = this.state;
        if(user.id){
            return (
             
                <BuyInLayout styles={{ paddingBottom: 35, backgroundColor: '#F8F9F9' }} children={this.renderView()} />
            );
        }else{
            return (<></>);
        }
        
    }
}

const styles = StyleSheet.create({
    userRow:{ flexDirection: 'row', marginBottom: normalize(16), borderRadius: 10, flex:1 },
    activeRow:{ backgroundColor: '#FFF'},
    inactiveRow:{backgroundColor: '#E9EBEE' },
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
    inputField: {
        borderColor: '#DFE7F5',
        borderWidth: 1,
        borderRadius: 4,
        height: RFPercentage(3),
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
    },
    borderVertical: {
        height: '100%',
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'center'

    },
    gridBGImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#A8B0BC',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15, marginBottom: 16, borderRadius: 10,
        paddingRight: 15
    },
});
