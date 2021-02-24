/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text, TextInput,
  View,
  Image, StyleSheet, FlatList, TouchableOpacity, Button, PixelRatio, ScrollView
} from 'react-native';
import ViewShot from "react-native-view-shot";
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, kFormatter, getLoggedInUser } from '../../api/service';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images from '../../../constants/Images';
import { PlainIcon } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, HeaderLeftBack, ShareScore } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import { Loader } from '../../components/Loader'
import MakeItRain from 'react-native-make-it-rain';


import * as Sharing from 'expo-sharing';

import moment from "moment";

export default class ShareFinalScore extends React.Component {


  finalScoreCard = (item, index) => {
    return (
      <TouchableOpacity key={item.id.toString() + Math.random()}>
        <View style={styles.row} key={index}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '20%' }]}>
            <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
            <Text numberOfLines={1} style={[Styles.font10, Styles.fontRegular, Styles.textGray, Styles.centerText, { marginTop: 4, width: '100%' }]}>{item.name}</Text>
            <Text style={[Styles.font10, Styles.fontBold, Styles.centerText, (item.result === 'Winner') ? Styles.green : (item.result === 'Loser') ? Styles.red : Styles.textGray]}>{(item.result === 'Winner') ? 'Won' : (item.result === 'Loser') ? 'Lost' : 'Quits'}</Text>
          </View>

          <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
            <Image source={(item.result === 'Winner') ? Images.championIcon : (item.result === 'Loser') ? Images.loserIcon : Images.quitsIcon} style={{ height: normalize(32), width: normalize(32) }} />
            <Image source={Images.hrIcon} resizeMode="cover" style={{ height: 5, width: '80%', position: 'absolute', zIndex: -1 }} />
          </View>

          <View style={[Styles.tbCol, Styles.centerText, { width: '30%', flexDirection: 'row' }]}>
            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View>

            <Text style={[Styles.font14, Styles.fontMedium, Styles.ml2, (item.result === 'Winner') ? Styles.green : (item.result === 'Loser') ? Styles.red : Styles.textGray]}>{(item.result === 'Winner') ? item.won_amount : (item.result === 'Loser') ? item.lost_amount : 0}</Text>
          </View>

        </View>
      </TouchableOpacity>
    );

  }

  shareFinalScore() {
    const { scoreList, gameDetails } = this.props;

    return (<>
        <View style={{ marginTop: 5 }}>
          <View style={[{ flexDirection: 'row', backgroundColor: '#FFF', marginBottom: normalize(5), borderRadius: 10 }]}>
            <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: 10 }]}>
              <Text style={[Styles.font18, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.start_time, 'YYYY-MM-DD HH:mm:ss').format('DD')}</Text>
              <Text style={[Styles.font14, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.start_time, 'YYYY-MM-DD HH:mm:ss').format('MMM')}</Text>
              <Text style={[Styles.font14, Styles.fontBold, Styles.textGray]}>{moment(gameDetails.start_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY')}</Text>
            </View>
            <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row', height: '100%' }]}>
              <View style={[{ flexDirection: 'row' }]}>
                <View style={[Styles.tbCol, { width: '5%' }]}>
                  <View style={styles.borderVertical}>
                    <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
                  </View>
                </View>
                <View style={[Styles.tbCol, Styles.centerText, { width: '90%', }]}>
                  <TextInput returnKeyType={"done"} style={[Styles.font16, Styles.fontMedium, Styles.green]} editable={false} defaultValue={'Duration: ' + gameDetails.duration} />
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
        {scoreList.map((item, index) => {
          return (this.finalScoreCard(item, index))
        })}
      </>);

  }

  render() {
   
    return this.shareFinalScore();
    
  }
}

const styles = StyleSheet.create({
  borderVertical: {
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'center'

  },
  row: {
    flex: 1, backgroundColor: '#FFF', marginTop: normalize(16), borderRadius: 10, flexDirection: 'row', padding: normalize(8),
    /* shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2 */
  },


  card: {
    backgroundColor: '#FFF',
    //height: RFPercentage(15),
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  cardImage: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: 8
  },
  tab: {
    height: normalize(48),
  },
  tab1: {
    borderBottomLeftRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,

  },
  tab2: {
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

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
    paddingLeft: 20,
    paddingRight: 20,
  },
  currancyMargin: {
    borderRadius: 50, marginLeft: 10, marginRight: 10
  }
});