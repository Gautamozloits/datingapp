/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text, Alert,
  View,
  Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity, AppState
} from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { postData, getUserDetail, getSumofNumber } from '../../api/service';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader'
import Images from '../../../constants/Images';
import InputScorllList from './../Views/InputScorllList';
import { ToastMessage } from '../../components/ToastMessage';
import { HeaderBG, HeaderLeft, BankerFilter, NonBankerFilter, FinishSettlement, FinishPayout } from '../../components/HeaderOptions';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import moment from "moment";
import BuyIN from '../Banker/BuyIN';
import BuyINNonBanker from '../Banker/BuyINNonBanker';
import PayoutDetails from '../Banker/PayoutDetails';
import Settlements from '../Settlement/Settlements';
import { SmallButton } from '../../components/Buttons/Button';
import { LeaveGameUsersModal } from '../Home/LeaveGameUsersModal';
import { LeavePlayerPayoutModal } from '../Banker/LeavePlayerPayoutModal';


// const socket = io(SocketEndpoint, {
//   transports: ['websocket'],
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
//   reconnectionAttempts: Infinity
// });


export default class ActiveGame extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>{navigation.getParam('navBar', { HeaderTitleText: 'Start' }).HeaderTitleText}</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,

      headerRight: () => (navigation.getParam('navBar', { currentStatus: 'Start' }).currentStatus === 'Start') ? (navigation.getParam('navBar', { isBanker: 0 }).isBanker === 0) ? <NonBankerFilter leaveGame={navigation.getParam('leaveGame')} /> : <BankerFilter leaveGame={navigation.getParam('leaveGame')} endGame={navigation.getParam('endGame')} /> : ((navigation.getParam('navBar', { currentStatus: 'End' }).currentStatus === 'End') && (navigation.getParam('navBar', { isBanker: 1 }).isBanker === 1)) ? <FinishPayout enabled={(navigation.getParam('navBar', { isDonePayout: false }).isDonePayout)} donePayoutDetails={navigation.getParam('donePayoutDetails')} /> : ((navigation.getParam('navBar', { currentStatus: 'Tallied' }).currentStatus === 'Tallied') && (navigation.getParam('navBar', { isBanker: 1 }).isBanker === 1)) ? <FinishSettlement enabled={(navigation.getParam('navBar', { isDoneSettlement: false }).isDoneSettlement)} finishSettlement={navigation.getParam('finishSettlement')} /> : null,
    };
  };
  //<FinishSettlement leaveGame={navigation.getParam('Finish')} />
  constructor(props) {
    super(props);
    this.state = {
      gameDetails: {},
      settlementDetails: {},
      user: {},
      showIndicator: false,
      isConnected: false,
      isApiCalled: false,
      intervalId: false,
      isCashMSGShown: false,
      refreshPayout: false,
      appState: AppState.currentState,
      isLeaveGameModalVisible: false,
      isLeavePlayerPayoutModalVisible: false,
      isAddPlayerModalVisible: false,
      selectedUsers: [],
      leaveUsers: [],
      isViewReady:false
    };

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      const { params } = this.props.navigation.state;
      if (params) {
        if (params.new_users && params.new_users.length > 0) {
          this.updateGamePlayers(params.new_users);
          params.new_users = [];
        }
      }
      this.getActiveGame();
      this.setGetActiveGame();
      this.setState({ isCashMSGShown: false, isViewReady: false });
    })
  }

  componentDidMount = async () => {

    this.socket = Global.THIS_SOCKET;


    AppState.addEventListener('change', this._handleAppStateChange);

    this.props.navigation.setParams({ leaveGame: this.leaveGame });
    this.props.navigation.setParams({ endGame: this.endGame });
    this.props.navigation.setParams({ finishSettlement: this.finishSettlement });
    this.props.navigation.setParams({ donePayoutDetails: this.donePayoutDetails });

    let user = await getUserDetail();
    this.setState({ user: user })
    this.setState({ isConnected: Global.IS_SOCKET_CONNECTED });

  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.focusListener.remove();
  }

  updateGamePlayers_ = (users) => {
    let params = { users: users, game_id: this.state.gameDetails.game_id }
    this.socket.emit("addNewPlayers", { users: users, game_id: this.state.gameDetails.game_id }, (res) => {
      //this.setState({ gameDetails: {} })
      if (res.status) {
        ToastMessage(res.message)
      }
    })
  }
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.getActiveGame();
      this.setGetActiveGame();
    } else if (nextAppState === 'background') {

    }
  };

  reconnect = () => {
    ToastMessage("socket connected successfully")
    this.setState({ isConnected: true });
    this.getActiveGame();
    this.setGetActiveGame();
  }

  finishSettlement = async () => {
    // this.settlement.canFinishSettlement()
    this.refs.settlement.canFinishSettlement();
  }


  joinGameGroup = (id) => {
    this.socket.emit("joinGameGroup", { game_id: id }, (res) => {

    });
  }

  setGetActiveGame = () => {
    //socket.on('autoGetActiveGame', function(res){
    this.socket.on("autoGetActiveGame", (res) => {
      if (res.status) {
        if (res.type && res.type === 'leaveGame') {
          if (res.user_id !== this.state.user.id) {
            ToastMessage(res.message);
          }

        }
        this.getActiveGame();
      } else {
        ToastMessage(res.message, "error")
      }
    });

  }


  getActiveGame = async (refresh = '') => {

    let user = await getUserDetail();
    //if(!this.state.isApiCalled){

    this.socket.emit("getActiveGame", { user_id: user.id }, (res) => {
      //this.setState({ gameDetails: {} })
      if (res.status) {
        //ToastMessage(res.message)
        if (res.data.length === 1) {
          let gameDetails = res.data[0];
          if (gameDetails.status === 'Settlement') {
            this.props.navigation.navigate('GameResults', { gameDetails: gameDetails })
          }else{
            this.joinGameGroup(gameDetails.game_id)
            this.setState({ gameDetails: gameDetails })
            this.forceUpdate()

            let headerTitle = 'Buy In';
            let isDoneSettlement = false;
            if (gameDetails.current_status === 'Start') {
              headerTitle = `Buy In`;
              //headerTitle = `Buy In(${gameDetails.users.length})`;
            }else if (gameDetails.current_status === 'End' || gameDetails.current_status === 'Leave') {
              headerTitle = 'Pay out Details';
              if (refresh === 'refresh_payout') {
                this.setState({ refreshPayout: true })
              }
              this.checkIsAllCalculationTally();
            }else if (gameDetails.current_status === 'Tallied' && gameDetails.is_banker === 1) {
              headerTitle = 'Settlement';
              this.checkPendingReceivedAmount()
              //isDoneSettlement= true,
            }else if (gameDetails.current_status === 'Tallied' && gameDetails.is_banker === 0) {
              headerTitle = 'Pay out Details'
            }
            this.props.navigation.setParams({
              navBar: {
                isDoneSettlement: isDoneSettlement,
                isBanker: gameDetails.is_banker,
                HeaderTitleText: headerTitle,
                currentStatus: gameDetails.current_status
              }
            });
            Global.ACTIVE_GAME_IMAGE = Images.activeGame;
          }
        } else {
          this.props.navigation.setParams({
            navBar: {
              isBanker: 0,
              HeaderTitleText: 'Active Game',
              currentStatus: ''
            }
          });
          this.setState({ gameDetails: {} })
          Global.ACTIVE_GAME_IMAGE = Images.blackjack;

        }
      } else {
        Global.ACTIVE_GAME_IMAGE = Images.blackjack;
        //ToastMessage(res.message, "error")
      }
      this.setState({isViewReady: true})
    });
    //}


  }

  getBankers = async () => {
    var users = JSON.parse(JSON.stringify(this.state.gameDetails.users))
    var user_index = users.findIndex((value) => {
      return value.is_banker === 1;
    })
    var banker = users[user_index];
    this.setState({ banker: banker })
    //auto_assign_loss
    if (banker.auto_assign_loss === 1) {
      var isValid = true;
      await users.map((item, index) => {
        if (item.result == 'Loser') {
          if (!item.paid_amount) {
            if (item.lost_amount <= parseFloat(this.state.gameDetails.options.showdown)) {
              //placeholder = item.lost_amount.toString();
              item.paid_amount = item.lost_amount.toString();
            } else {
              //placeholder = this.props.gameDetails.options.showdown.toString();
              item.paid_amount = this.state.gameDetails.options.showdown.toString();
            }
            this.payLostAmount(item, index, 'auto');

          } else {
            isValid = false;
          }


        }
        if (users.length === index + 1) {
          this.getActiveGame()
        }
      })
      if (isValid) {

      }

    }
  }

  payLostAmount = (item, index, type = 'manual') => {
    var gameDetails = this.state.gameDetails;
    if (item.remaining_amount_tobe_paid < item.paid_amount) {
      ToastMessage('Cash paid cannot be more than the remaining balance')
      return false;
    } else {
      let message = 'Are you sure want to pay this amount? After that you will not be able to update this amount.';
      if (gameDetails.is_banker === 1) {
        message = 'Are you sure want to pay this amount?';
      }

      var gameDetails = this.state.gameDetails;
      let params = { user_id: this.state.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, paid_amount: item.paid_amount };
      this.socket.emit("payLostAmount", params, (res) => {
        if (res.status) {

        } else {
          ToastMessage(res.message, "error")
        }
      });

    }
  }

  addNewPlayers = (users) => {
    this.setState({ isAddPlayerModalVisible: true })
  }
  checkPendingReceivedAmount = async () => {
    const { gameDetails } = this.state;
    var remaining_amount_tobe_rcvd = await getSumofNumber(gameDetails.users, 'remaining_amount_tobe_rcvd')
    console.log(gameDetails.game_id,' remaining_amount_tobe_rcvd: ',remaining_amount_tobe_rcvd)
    if (remaining_amount_tobe_rcvd === 0) {
      this.props.navigation.setParams({
        navBar: {
          isDoneSettlement: true,
          currentStatus: gameDetails.current_status,
          isBanker: gameDetails.is_banker,
          HeaderTitleText: 'Settlement',
        }
      });
    }
  }

  checkIsAllChipsReturn(arr) {
    var flag = true;
    if (arr && arr.length > 0) {
      arr.map((value, key) => {
        if (!value.receive_buy_in) {
          flag = false;
        }
      })
    } else {
      flag = false;
    }

    return flag;
  }
  checkIsAllPaidAmountEntered(arr) {
    var flag = true;
    if (arr.length > 0) {
      arr.map((value, key) => {
        if (value.result) {
          if (value.result === 'Loser' && !value.paid_amount) {
            flag = false;
          }
        }
      })
    }

    return flag;
  }

  checkIsAllLoserPaidEntireAmount(arr) {
    var flag = true;
    if (arr.length > 0) {
      arr.map((value, key) => {
        if (value.result) {
          if (value.result === 'Loser' && value.remaining_amount_tobe_paid > 0) {
            flag = false;
          }
        }
      })
    }

    return flag;
  }


  checkIsAllCalculationTally = async () => {
    const { gameDetails, user } = this.state;
    let isAllChipsEntered = await this.checkIsAllChipsReturn(gameDetails.users);
    let isAllPaidEntered = await this.checkIsAllPaidAmountEntered(gameDetails.users);
    if (isAllChipsEntered) {
      if (gameDetails.total_buy_in === gameDetails.total_received_buy_in) {
        //this.getBankers();
        if (isAllPaidEntered) {

          if (gameDetails.is_banker === 1) {
            //this.donePayoutDetails();

            this.props.navigation.setParams({
              navBar: {
                isDonePayout: true,
                isBanker: 1,
                HeaderTitleText: 'Pay out Details',
                currentStatus: gameDetails.current_status
              }
            });
          }
        } else {
          if (!this.state.isCashMSGShown) {
            this.setState({ isCashMSGShown: true })
            ToastMessage('Chip Count Tallied. Waiting for players to enter the cash amount')
          }

        }

      } else {
        var totalBuyIn = await getSumofNumber(gameDetails.users, 'buy_in')
        var totalRcvBuyIn = await getSumofNumber(gameDetails.users, 'receive_buy_in')
        var totalWin = await getSumofNumber(gameDetails.users, 'won_amount');
        var totalLost = await getSumofNumber(gameDetails.users, 'lost_amount');

        if (gameDetails.options.game_value === 'half') {
          totalWin = totalWin * 2;
          totalLost = totalLost * 2;
        }
        var message = 'Account did not tally. Please recount your chips and enter again.';
        ToastMessage(message)
        /*var message = 'Account did not tally.\nPlease recount your chips and enter again.\n\n';
        if (totalBuyIn > totalRcvBuyIn) {
          let diff_chips = totalBuyIn - totalRcvBuyIn;
          message += `Chips difference: ${diff_chips}`;
        } else {
          let diff_chips = totalRcvBuyIn - totalBuyIn;
          message += `Chips difference: ${diff_chips}`;
        }
        message += `\nTotal Winning chips: ${totalWin}`;
        message += `\nTotal losing Chips: ${totalLost}`;

        if (gameDetails.is_banker === 1) {
          Alert.alert('Home Game', message, [{
            text: 'OK', onPress: async () => {

            }
          }
          ])
        } else {
          ToastMessage(message, "error")
        }*/
      }
    }
    this.setState({ refreshPayout: false })
  }

  donePayoutDetails = async () => {
    const { gameDetails, user } = this.state;
    var message = 'All amount is tallied. You can proceed to the next step. After that you will not be able to make any changes.';
    if(this.checkIsAllLoserPaidEntireAmount(gameDetails.users)){
      message = 'All amount is tallied and all dues are paid up. Clicking YES will finish the game. After that you will not be able to make any changes.';
    }
    Alert.alert('Home Game', message, [{
      text: 'Yes', onPress: async () => {

        this.setState({ showIndicator: true })
        let params = { user_id: user.id, game_id: gameDetails.game_id };
        this.socket.emit("donePayoutDetails", params, (res) => {

          if (res.status) {
            ToastMessage(res.message)
            this.getActiveGame(user)
            //this.getListRecords(gameDetails.game_id)
            //this.setState({ gameDetails: res.data })
          } else {
            ToastMessage(res.message, "error")
          }
          this.setState({ showIndicator: false })
        })
      }
    },
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    ], { cancelable: false });
  }

  leaveMultipleUser = async () => {
    const { gameDetails, user } = this.state;
    if (this.state.selectedUsers.length > 0) {
      var users = []
      await gameDetails.users.map((user, index) => {

        if (this.state.selectedUsers.includes(user.game_user_id)) {
          users.push(user)
        }
      })
      this.setState({ isLeavePlayerPayoutModalVisible: true, isLeaveGameModalVisible: false, leaveUsers: users })
    }
  }

  leaveGame = () => {
    const { gameDetails, user } = this.state;
    if (gameDetails.is_banker === 0) {

      Alert.alert('Home Game', 'Are you sure want to leave this game?', [{
        text: 'Yes', onPress: async () => {

          this.setState({ showIndicator: true })
          let params = { user_id: user.id, game_id: gameDetails.game_id };
          this.socket.emit("leaveGame", params, (res) => {

            if (res.status) {
              //ToastMessage(res.message)
              this.getActiveGame(user)
              //this.getListRecords(gameDetails.game_id)
              //this.setState({ gameDetails: res.data })
            } else {
              ToastMessage(res.message, "error")
            }
            this.setState({ showIndicator: false })
          })
        }
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      ], { cancelable: false });

    } else {
      this.setState({ selectedUsers: [], isLeaveGameModalVisible: true })
    }
  }

  endGame = () => {
    const { gameDetails, user } = this.state;
    if (gameDetails.is_banker === 1) {

      Alert.alert('Home Game', 'Are you sure want to end this game?', [{
        text: 'Yes', onPress: async () => {

          this.setState({ showIndicator: true })
          let params = { user_id: user.id, game_id: gameDetails.game_id };
          this.socket.emit("endGame", params, (res) => {
            if (res.status) {
              ToastMessage(res.message)
              this.getActiveGame(user)
            } else {
              ToastMessage(res.message, "error")
            }
            this.setState({ showIndicator: false })
          })
        }
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      ], { cancelable: false });

    } else {
      Alert.alert('Home Game', 'You can not end this game, because you are not a banker.', [{
        text: 'OK', style: 'cancel', onPress: async () => {
        }
      },
      ], { cancelable: false });
    }
  }


  loadView = () => {
    const { gameDetails, user, isViewReady } = this.state;
    if(isViewReady){
      if (gameDetails.current_status === 'Start') {
        if (gameDetails.is_banker === 1) {
  
          return (<>
            {this.state.isLeaveGameModalVisible ? <LeaveGameUsersModal socket={this.socket} that={this} gameDetails={this.state.gameDetails} /> : null}
            {this.state.isLeavePlayerPayoutModalVisible ? <LeavePlayerPayoutModal socket={this.socket} user={user} that={this} gameDetails={this.state.gameDetails} leaveUsers={this.state.leaveUsers} /> : null}
  
            <BuyIN socket={this.socket} user={user} that={this} gameDetails={this.state.gameDetails} />
          </>);
        } else if (gameDetails.is_banker === 0) {
          return (<BuyINNonBanker user={user} socket={this.socket} that={this} gameDetails={this.state.gameDetails} />);
        }
      } else if (gameDetails.is_banker === 1 && gameDetails.status === 'Tallied') {
        return (<Settlements ref="settlement" user={user} socket={this.socket} that={this} gameId={this.state.gameDetails.game_id} gameDetails={this.state.gameDetails} />);
      } else if (gameDetails.status === 'Settlement') {
        this.props.navigation.navigate('GameResults', { gameDetails: this.state.gameDetails })
  
      }else if (gameDetails.current_status === 'Leave' || gameDetails.current_status === 'End' || gameDetails.current_status === 'Tallied') {
        if ((gameDetails.is_banker === 0) || (gameDetails.is_banker === 1 && gameDetails.current_status === 'End')) {
          if (this.state.refreshPayout) {
            return null;
          } else {
            return (<PayoutDetails user={user} socket={this.socket} that={this} gameDetails={this.state.gameDetails} />);
          }
        } else if (gameDetails.is_banker === 1) {
          return (<Settlements ref="settlement" user={user} socket={this.socket} that={this} gameId={this.state.gameDetails.game_id} gameDetails={this.state.gameDetails} />);
  
        } else if (gameDetails.status === 'Settlement') {
          this.props.navigation.navigate('GameResults', { gameDetails: this.state.gameDetails })
        }
  
      } else {
        return (
          <View style={[Styles.centerText, { flex: 1 }]}>
            <Text style={[Styles.font18, Styles.textPrimaryDark, Styles.fontSemiBold]}>Currently there is no active game</Text>
            <View style={[Styles.centerText, { marginTop: 20, width: '100%' }]}>
              {!this.state.isConnected ?
                <SmallButton onPress={() => this.reconnect()} fontSize={14} btnStyle={{ padding: 8, width: '30%' }} label="Reconnect" />
                : null}
            </View>
  
          </View>
        );
      }
    }else{
      return (
        <View style={[Styles.centerText, { flex: 1 }]}>
          <Text style={[Styles.font18, Styles.textPrimaryDark, Styles.fontSemiBold]}>Currently there is no active game</Text>
          <View style={[Styles.centerText, { marginTop: 20, width: '100%' }]}>
            {!this.state.isConnected ?
              <SmallButton onPress={() => this.reconnect()} fontSize={14} btnStyle={{ padding: 8, width: '30%' }} label="Reconnect" />
              : null}
          </View>

        </View>
      );
    }
    

  }

  render() {
    const { showIndicator } = this.state;
    return (
      <>
        {(showIndicator) ? <Loader /> : null}
        <InputScorllList offset={75} styles={{ padding: 0 }} children={this.loadView()} />

      </>
    );
  }
}
