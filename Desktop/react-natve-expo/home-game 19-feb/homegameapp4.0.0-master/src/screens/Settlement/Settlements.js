/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View, TextInput,
  Image, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton, SwitchExample, RoundButton2 } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, PaymentFilter } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { isValidNumber, getSumofNumber } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';

import CashSettlement from './CashSettlement';
import DebtSettlement from './DebtSettlement';


export default class Settlements extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listRecords: [],
      activeTab: 'tab1',
      switch1Value: false,
      cashSettlementDetails: {},
      debtSettlementDetails: {},
      isCashSettlementCompleted: false,
      isDebtSettlementCompleted: false,
      game_id: '',
      losers: [],
      winners: []
    };
  }

  componentDidMount() {

  }


  toggleSwitch1 = (value) => {
    this.setState({ switch1Value: value })
  }

  canFinishSettlement() {
    let params = { game_id: this.props.gameId };
    this.props.socket.emit("finishSettlement", params, (res) => {
      if (res.status) {
        this.props.that.getActiveGame(this.props.user)
        ToastMessage(res.message)

      } else {
        ToastMessage(res.message, "error")
      }
      this.props.that.setState({ showIndicator: false })
    });

  }

  callbackCashSettlement = async () => {
    this.props.that.getActiveGame();
  }
  callbackDebtSettlement = async () => {
    this.props.that.getActiveGame();
  }


  canFinishButtonShow() {
    const { isCashSettlementCompleted, isDebtSettlementCompleted } = this.state;
    if (isCashSettlementCompleted && isDebtSettlementCompleted) {
      this.props.that.props.navigation.setParams({
        navBar: {
          isDoneSettlement: true,
          HeaderTitleText: 'Settlement',
        }
      });
    } else {
      this.props.that.props.navigation.setParams({
        navBar: {
          isDoneSettlement: false,
          HeaderTitleText: 'Settlement',
        }
      });
    }
  }

  getListRecords = (type) => {
    if (type === 'cash') {
      this.setState({ activeTab: 'tab1' })
    } else {
      this.setState({ activeTab: 'tab2' })
    }
  }


  renderView = () => {
    const { activeTab, debtSettlementDetails, cashSettlementDetails } = this.state;
    const { user, socket, gameId, that } = this.props
    return (
      <>
        <View style={[Styles.tbRow, styles.tab]}>
          <View style={[Styles.tbCol, styles.tab1, (activeTab === 'tab1') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.getListRecords('cash')}
            >
              <Text style={[(activeTab === 'tab1') ? styles.activeTabText : styles.inactiveTabText]}>Cash Settlement</Text>
            </TouchableOpacity>
          </View>
          <View style={[Styles.tbCol, styles.tab2, (activeTab === 'tab2') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.getListRecords('debt')}
            >
              <Text style={[(activeTab === 'tab2') ? styles.activeTabText : styles.inactiveTabText]}>Debt Settlement</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
          {activeTab == 'tab1' ? <CashSettlement that={that} user={user} gameId={gameId} socket={socket} cashCallback={this.callbackCashSettlement} /> : <DebtSettlement that={that} user={user} socket={socket} gameId={gameId} debtCallback={this.callbackDebtSettlement} />}
        </View>

      </>
    );
  }

  render() {

    return (
      <ContainerTabScreen children={this.renderView()} styles={{ paddingBottom: 0, backgroundColor: '#F8F9F9' }} />
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    height: normalize(48),
  },
  tab1: {
    borderBottomLeftRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 10,

  },
  tab2: {
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 10,
  },
  activeTabText: {
    color: '#FFFFFF',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Bold',
    fontSize: normalize(18)
  },
  inactiveTabText: {
    color: '#A8B0BC',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Regular',
    fontSize: normalize(16)
  },
  activeTab: {
    backgroundColor: '#2A395B',
    width: '50%',
    padding: 10
  },
  inactiveTab: {
    backgroundColor: '#E9EBEE',
    width: '50%',
    padding: 10
  },
  list: {
    flex: 1,
    marginTop: 5
  },


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
    flexDirection: 'row', backgroundColor: '#FFF', marginBottom: normalize(16), borderRadius: 10,
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingTop: normalize(15),
    paddingBottom: normalize(15),
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