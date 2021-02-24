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
import { Loader, NoRecord } from '../../components/Loader'
import MakeItRain from 'react-native-make-it-rain';


import * as Sharing from 'expo-sharing';

import moment from "moment";

export default class FinalSettlement extends React.Component {


  constructor(props) {
    super(props);
    this._container = React.createRef();
    this.state = {
      gameDetails: {},
      userInfo: {},
      finalSettlementList: [],
    };
  }

  componentDidMount = async () => {
   

  }

  

  finalSettlementCard = (item) => {
    return (<View style={styles.row}>
      <View style={{ flex: 3.8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <View style={[Styles.centerText, { flexDirection: 'column', flex: 1.5 }]}>
          <Image source={(item.debtor_image && item.debtor_image !== '') ? { uri: Global.ROOT_PATH + item.debtor_image } : Images.userImage} style={styles.cardImage} />
          <Text numberOfLines={1} style={[Styles.font10, Styles.fontRegular, Styles.textGray, Styles.centerText, { marginTop: 5 }]}>{item.debtor_name}</Text>
        </View>
        <View style={[Styles.centerText, { flexDirection: 'row', flex: 3 }]}>
        </View>
        <View style={[Styles.centerText, { flexDirection: 'column', flex: 1.5 }]}>
          <Image source={(item.creditor_image && item.creditor_image !== '') ? { uri: Global.ROOT_PATH + item.creditor_image } : Images.userImage} style={styles.cardImage} />
          <Text numberOfLines={1} style={[Styles.font10, Styles.fontRegular, Styles.textGray, Styles.centerText, { marginTop: 5 }]}>{item.creditor_name}</Text>
        </View>
        <View style={{ width: '100%', position: 'absolute', top: 20, zIndex: -1, height: 5, alignItems: 'center' }}>
          <Image source={Images.bottomBorder} resizeMode="cover" style={{ height: 5, width: '100%', position: 'absolute', zIndex: -10 }} />
          <Image source={Images.sendCoin} style={{ height: normalize(25), width: normalize(25), backgroundColor: '#FFF', position: 'absolute', zIndex: 1, top: -12 }} />
        </View>

      </View>

      <View style={{ flex: 2.2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <View style={[Styles.shadow5, { borderRadius: 50 }]}>
          <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
        </View>
        <Text style={[Styles.font14, Styles.fontMedium, Styles.ml2, Styles.green]}>{item.amount}</Text>

      </View>


    </View>);

  }


  renderView = () => {
    const { finalSettlementList, gameDetails } = this.props;
    return (
      <>
        <View style={[styles.list, { zIndex: -1 }]}>

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
                    <TextInput style={[Styles.font16, Styles.fontMedium, Styles.green]} editable={false} defaultValue={'Duration: ' + gameDetails.duration} />
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



          <FlatList
              contentContainerStyle={{ paddingBottom: 90, paddingLeft: 2, paddingRight: 2 }}
              showsVerticalScrollIndicator={false}
              data={finalSettlementList}
              renderItem={({ item, index }) => this.finalSettlementCard(item, index)}
              keyExtractor={item => item.id.toString() + Math.random()}
              ListFooterComponent={() => <View style={{ height: 100 }} />}
              ListEmptyComponent={() => <View style={{marginTop:10}}><NoRecord message="All dues were settled" visible={true} /></View>}
            />
            

        </View>
      </>
    );
  }
  render() {
   
    return this.renderView();
    
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
    paddingLeft: 15,
    paddingRight: 15,
  },
  currancyMargin: {
    borderRadius: 50, marginLeft: 10, marginRight: 10
  }
});