/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View, TextInput,
  Image, StyleSheet, FlatList, ScrollView
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import Global from '../../../constants/Global';
import { SmallButton, RoundButton, RoundButton2 } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, PaymentFilter } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import { isValidNumber, getSumofNumber } from '../../api/service';
import DoubleClicker from '../../components/react-native-double-click/main';

export default class DebtSettlement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      details: {},
      losers: [],
      winners: []
    };
  }

  componentDidMount() {

    const { gameId } = this.props
    this.getDebtCollections(gameId);

  }

  getDebtCollections = async (game_id) => {
    this.props.socket.emit("getDebtCollections", { game_id: game_id }, (res) => {
      console.log(JSON.stringify(res))
      if (res.status) {
        console.log(JSON.stringify(res))
        let losers = res.data.losers;
        let losersUser = [];
        losers.map((user, index) => {
          let USER = user;

          let balance = user.remaining_amount_tobe_paid
          if (user.creditors && user.creditors !== '') {
            let filteredPeople = JSON.parse(user.creditors);
            let settled_amount = getSumofNumber(filteredPeople, 'amount')
            balance = balance - settled_amount;
          }


          USER.remaining_amount_tobe_paid_show = balance;
          if (user.creditors && user.creditors !== '') {
            USER.creditors = JSON.parse(user.creditors);
          } else {
            USER.creditors = [];
          }
          losersUser.push(USER);
        })

        let winners = res.data.winners;
        let winnersUser = [];
        winners.map((user, index) => {
          //USER.remaining_amount_tobe_rcvd = user.won_amount - user.received_amount;
          if (user.debtors && user.debtors !== '') {
            user.debtors = JSON.parse(user.debtors);
          } else {
            user.debtors = [];
          }
          user.remaining_amount_tobe_rcvd_show = parseFloat(user.won_amount) - (parseFloat((user.received_amount && user.received_amount != '') ? user.received_amount : 0) + (parseFloat((user.settled_amount && user.settled_amount != '') ? user.settled_amount : 0)));
          winnersUser.push(user);
        })

        this.setState({ details: res.data, winners: winnersUser, losers: losersUser })
        //this.props.debtCallback(res.data.id, losersUser, winnersUser);
      }
    })
  }


  updateDebtCollection = () => {
    var winners = this.state.winners;
    var losers = this.state.losers;

    /*Alert.alert('Home Game', message, [{
        text: 'Yes', onPress: async () => {*/

    var gameDetails = this.state.details;
    this.setState({ showIndicator: true })
    let params = { game_id: gameDetails.id, winners: winners, losers: losers };
    this.props.socket.emit("updateDebtCollection", params, (res) => {
      if (res.status) {
        this.props.debtCallback();
        //this.props.that.getActiveGame(this.props.user)
        // ToastMessage(res.message)

      } else {
        ToastMessage(res.message, "error")
      }
      this.setState({ showIndicator: false })
    });
    /*    }
    },
    {
        text: 'Cancel',
        onPress: () => {
            gameDetails.users[index].paid_amount = '';
            //item.amount = '';
            this.setState({ gameDetails: gameDetails })
        },
        style: 'cancel',
    },
    ], { cancelable: false });*/


  }

  getPaidAmount(winner, Windex, looser, Lindex) {

    var amount = '';
    var user_index = looser.creditors.findIndex((value) => {
      return value.game_user_id === winner.game_user_id;
    })
    if (user_index >= 0) {

      if (looser.creditors[user_index].amount > 0) {
        amount = looser.creditors[user_index].amount.toString();
      } else {
        amount = '';
      }
    }
    return amount;
  }
  isWinnerEditable(winner, Windex, looser, Lindex) {
    if (winner.remaining_amount_tobe_rcvd_show > 0) {
      return true;
    } else {
      var user_index = looser.creditors.findIndex((value) => {
        return value.game_user_id === winner.game_user_id;
      })
      if (user_index >= 0) {
        return true
      } else {
        return false;
      }
    }

  }

  getTotalAmountGettingPaid(arr) {
    const total = arr.reduce((prev, next) => prev + parseFloat(next.amount), 0);
    return total;
  }

  setWinnerAmount = async (value, winner, Windex, looser, Lindex, mode = 'manual') => {
    var amount = parseFloat(value);
    if (value == '') {
      amount = 0;
    }
    //var amount = parseFloat(value.nativeEvent.text);
    if (isValidNumber(amount)) {
      //get total payable amount of loser
      let arr = JSON.parse(JSON.stringify(looser.creditors));
      var filteredPeople = arr.filter((item) => item.user_id !== winner.id);
      let balance = await getSumofNumber(filteredPeople, 'amount')
      let total_loser_paid_amount = balance + amount;

      //get total payble amount of winner
      let arrDebtors = JSON.parse(JSON.stringify(winner.debtors));
      var filteredPeople2 = arrDebtors.filter((item) => item.user_id !== looser.id);

      let remaining_amount_tobe_paid_user = await getSumofNumber(filteredPeople2, 'amount')


      //let remaining_amount_tobe_paid_user = await getSumofNumber(winner.debtors, 'amount')
      remaining_amount_tobe_paid_user = remaining_amount_tobe_paid_user;

      var winner_remaining_amount_tobe_rcvd = (parseFloat(winner.won_amount) - parseFloat((winner.received_amount && winner.received_amount != '') ? winner.received_amount : 0)) - parseFloat((remaining_amount_tobe_paid_user && remaining_amount_tobe_paid_user != '') ? remaining_amount_tobe_paid_user : 0)

      if (total_loser_paid_amount > (looser.remaining_amount_tobe_paid)) {
        amount = amount.toString()
        amount = amount.substring(0, amount.length - 1);
        let debtor = {
          user_id: looser.id,
          game_user_id: looser.game_user_id,
          amount: amount
        }
        if (winner.debtors.length > 0) {
          var user_index = winner.debtors.findIndex((value) => {
            return value.game_user_id === looser.game_user_id;
          })
          if (user_index >= 0) {
            if (amount > 0) {
              winner.debtors[user_index] = debtor;
            } else {
              winner.debtors.splice(user_index, 1);
            }

            //winner.debtors[user_index] = debtor;
          } else {
            if (amount > 0) {
              winner.debtors.push(debtor);
            }
          }
        } else {
          if (amount > 0) {
            winner.debtors.push(debtor);
          }
        }
        let winners = this.state.winners
        winners[Windex] = winner;
        /****end winners section */
        this.setState({ winners: winners })

        ToastMessage('loser cannot pay more than their remaining balance')
        return false;
      } else if (winner_remaining_amount_tobe_rcvd >= amount) {
        /****losers section */
        let creditor = {
          user_id: winner.id,
          game_user_id: winner.game_user_id,
          amount: amount
        }
        if (looser.creditors.length > 0) {
          var user_index = looser.creditors.findIndex((value) => {
            return value.game_user_id === winner.game_user_id;
          })
          if (user_index >= 0) {
            looser.creditors[user_index] = creditor;
          } else {
            looser.creditors.push(creditor);
          }
        } else {
          looser.creditors.push(creditor);
        }
        looser.remaining_amount_tobe_paid_show = parseFloat(looser.remaining_amount_tobe_paid) - (parseFloat(total_loser_paid_amount))

        let losers = this.state.losers
        losers[Lindex] = looser;
        /****losers section */

        /****winners section */
        winner.remaining_amount_tobe_rcvd_show = winner_remaining_amount_tobe_rcvd - amount
        let debtor = {
          user_id: looser.id,
          game_user_id: looser.game_user_id,
          amount: amount
        }

        if (winner.debtors.length > 0) {
          var user_index = winner.debtors.findIndex((value) => {
            return value.game_user_id === looser.game_user_id;
          })
          if (user_index >= 0) {
            if (amount > 0) {
              winner.debtors[user_index] = debtor;
            } else {
              winner.debtors.splice(user_index, 1);
            }
          } else {
            if (amount > 0) {
              winner.debtors.push(debtor);
            }
          }
        } else {
          if (amount > 0) {
            winner.debtors.push(debtor);
          }
        }
        let winners = this.state.winners
        winners[Windex] = winner;
        /****end winners section */
        this.setState({ losers: losers, winners: winners })
        if (mode == 'auto') {
          this.updateDebtCollection()
        }

      } else {
        amount = amount.toString()
        amount = amount.substring(0, amount.length - 1);
        let debtor = {
          user_id: looser.id,
          game_user_id: looser.game_user_id,
          amount: amount
        }
        if (winner.debtors.length > 0) {
          var user_index = winner.debtors.findIndex((value) => {
            return value.game_user_id === looser.game_user_id;
          })
          if (user_index >= 0) {
            winner.debtors[user_index] = debtor;
          } else {
            winner.debtors.push(debtor);
          }
        } else {
          winner.debtors.push(debtor);
        }
        let winners = this.state.winners
        winners[Windex] = winner;
        /****end winners section */
        this.setState({ winners: winners })
        ToastMessage('Winner amount can not be greater then winning amount', 'error')
      }

    } else {
      ToastMessage('Please enter valid number', 'error')
    }
  }

  winnerCard = (winner, Windex, looser, Lindex) => {
    return (<View key={Windex} style={Styles.tbCol, Styles.shadow5, { width: RFPercentage(13), marginRight: RFPercentage(3) }}>
      <View style={[styles.col, { padding: 5 }, (this.isWinnerEditable(winner, Windex, looser, Lindex)) ? Styles.bgWhite : Styles.bgGray]}>
        <View style={styles.gRow}>

          <TextInput editable={this.isWinnerEditable(winner, Windex, looser, Lindex)} placeholder="Amount"
            onChangeText={(value) => {
              this.setWinnerAmount(value, winner, Windex, looser, Lindex)
            }}
            onBlur={() => this.updateDebtCollection()}
            returnKeyType='done'
            keyboardType={"numeric"}
            defaultValue={this.getPaidAmount(winner, Windex, looser, Lindex)}
            value={this.getPaidAmount(winner, Windex, looser, Lindex)}
            style={Styles.inputField} maxLength={8} />

        </View>
        <View style={[Styles.centerText]}>
          <View style={styles.gRow}>
            <Image source={(winner.image && winner.image !== '') ? { uri: Global.ROOT_PATH + winner.image } : Images.userImage} style={styles.cardImage} />
          </View>
          <View style={styles.gRow}>
          <DoubleClicker onClick={() => {
              if (looser.remaining_amount_tobe_paid_show > 0 && looser.remaining_amount_tobe_paid_show >= winner.remaining_amount_tobe_rcvd_show) {
                this.setWinnerAmount(winner.remaining_amount_tobe_rcvd_show, winner, Windex, looser, Lindex, 'auto')
              } else if (looser.remaining_amount_tobe_paid_show > 0 && looser.remaining_amount_tobe_paid_show < winner.remaining_amount_tobe_rcvd_show) {
                this.setWinnerAmount(looser.remaining_amount_tobe_paid_show, winner, Windex, looser, Lindex, 'auto')
              }
            }}
              style={[Styles.centerText]}
            >
            <Text style={[Styles.font9, Styles.fontRegular, Styles.textGray,{maxWidth:100,textAlign:"center"}]} ellipsizeMode={"tail"} numberOfLines={1}>{winner.name}</Text>
            <Text style={[Styles.font9, Styles.fontBold, Styles.textPrimaryDark, { marginTop: 2,textAlign:"center" }]}>{winner.remaining_amount_tobe_rcvd_show}/{winner.won_amount}</Text>
          </DoubleClicker>
          </View>
        </View>
      </View>
    </View>);
  }

  renderCard = (looser, Lindex) => {
    const { winners } = this.state;
    return (
      <View key={Lindex} style={[styles.grid, { marginBottom: (this.state.losers.length === Lindex + 1) ? RFPercentage(15) : 0 }]}>
        <View style={styles.row}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <Image source={(looser.image && looser.image !== '') ? { uri: Global.ROOT_PATH + looser.image } : Images.userImage} style={styles.cardImage} />
          </View>

          <View style={[Styles.tbCol, Styles.leftText, { width: '45%', paddingLeft: 5 }]}>
            <Text style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark]}>{looser.name}</Text>
          </View>

          <View style={[Styles.tbCol, { width: '40%', justifyContent: 'center', alignItems: 'flex-end' }]}>
            <Text style={[Styles.font10, Styles.fontRegular, Styles.textPrimaryDark, { marginTop: 2 }]}>Balance Amount</Text>
            <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray]}>{looser.remaining_amount_tobe_paid_show}/{looser.lost_amount}</Text>
          </View>

        </View>

        <View style={[Styles.centerText]}>
          <View style={styles.seprator}>
            <Image source={Images.treeView} style={{ height: RFPercentage(5), width: '75%' }} resizeMode="cover" />
          </View>
        </View>

        <View style={[Styles.tbRow]}>
          <ScrollView horizontal={true} style={{ paddingBottom: 10, paddingLeft: 0, paddingRight: 0 }}>
            {winners.map((item, index) => {
              return (this.winnerCard(item, index, looser, Lindex))
            })}
          </ScrollView>
        </View>
      </View>
    );


  }
  renderView = () => {
    const { losers } = this.state;
    return (
      <>
        <View style={styles.list}>
          <ScrollView style={{ paddingBottom: normalize(20), paddingLeft: normalize(5), paddingRight: normalize(5) }}>
            {losers.map((item, index) => {
              return (this.renderCard(item, index))
            })}
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>

      </>
    );
  }
  render() {
    return (<View style={[Styles.container, { backgroundColor: '#F7F8F8' }]}>
      {this.renderView()}
    </View>)
    // return (
    //   <ContainerTabScreen children={this.renderView()} />
    // );
  }
}
const styles = StyleSheet.create({
  grid: {
    backgroundColor: '#F9F9F9',
    marginTop: normalize(20),
    borderRadius: 10,
    flexDirection: 'column',
    padding: normalize(10),
    width: '98%',
    marginLeft: RFPercentage(0.4),
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
  col: {
    borderRadius: 10,
    justifyContent: 'center',
  },
  col2: {
    height: RFPercentage(18),
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
  gRow: {
    justifyContent: 'center',
    marginBottom: normalize(5),
    marginTop: normalize(5),
    alignItems: 'center'
  },
  middleBorder: {
    borderWidth: 1,
    borderColor: '#E9F9F1',
    height: 1,
    width: '100%',
    position: 'absolute',
    zIndex: -1
  },
  seprator: {
    width: '100%',
    height: RFPercentage(5),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex'
  },
  centerBorder: {
    backgroundColor: '#FEECED',
    height: RFPercentage(5),
    width: 1,
    alignSelf: 'center',
    position: 'absolute'
  },

  cardImage: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: 8
  },
  list: {
    flex: 1,
    paddingLeft: normalize(5),
    paddingRight: normalize(5),
  }
});