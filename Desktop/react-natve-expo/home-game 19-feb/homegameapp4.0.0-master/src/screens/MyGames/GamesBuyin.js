/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';


import React, { Component } from 'react';
import {
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Text,
  View,
  Image, StyleSheet, FlatList, TouchableOpacity, TextInput, ImageBackground
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, kFormatter } from '../../api/service';
import { getListContent } from '../../api/serviceHandler';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images from '../../../constants/Images';
import { SmallButton, SmallButton2 } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, PeriodFilter } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader'
import moment from "moment";
import { SwipeListView } from 'react-native-swipe-list-view';
import { LinearGradient } from 'expo-linear-gradient';
import { DateFilter } from '../../components/DateFilter';


class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List

  getChildren = (item, key) => {
    return (<View key={'child_' + key} style={[Styles.tbRow, { paddingLeft: 10, paddingRight: 10, marginTop: 5, height: 50 }]}>
      <View style={[styles.greenBox, { flexDirection: 'row', height: RFPercentage(7) }]}>
        <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
          <View style={[Styles.centerText, Styles.shadow5, styles.whiteCircle]}>
            <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{key + 1}</Text>
          </View>
        </View>
        <View style={styles.verticalBorder} />
        <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
          <Text style={[Styles.font12, Styles.fontMedium, Styles.textPrimaryDark]}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('hh:mm:ss A')}</Text>
        </View>
        <View style={styles.verticalBorder} />
        <View style={[Styles.tbCol, Styles.centerText, { width: '25%', flexDirection: 'row' }]}>
          <View style={[Styles.shadow5, { borderRadius: 50 }]}>
            <Image source={Images.coinYellow} style={{ height: normalize(15), width: normalize(15) }} />
          </View>
          <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.green, { marginLeft: 2 }]}>{item.buyin}</Text>
        </View>

      </View>
    </View>
    )




  }
  totalBuyIn = (amount_history) => {
    let str = '';
    if (amount_history && amount_history != '') {
      amount_history = JSON.parse(amount_history)
      let arr = []
      amount_history.map((amount) => {
        arr.push(kFormatter(amount));
      })
      str = arr.join(' + ')
    }
    return str;
  }
  render() {
    const { item } = this.props;

    return (
      <View style={[{ flexDirection: 'column', backgroundColor: '#FFF', marginTop: normalize(16), borderRadius: 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.props.onClickFunction}
        >
          <View style={[styles.row, ]}>
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
                </View>
              </View>
            </View>
            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', height: '100%' }]}>
              <ImageBackground source={Images.RectangleBg} style={styles.gridBGImage} resizeMode="cover">
                <Text style={[Styles.font12, Styles.fontRegular, Styles.textGray, { paddingLeft: normalize(30), paddingRight: normalize(5), flexWrap: 'wrap' }]}>{this.totalBuyIn(item.amount_history)}</Text>

              </ImageBackground>
            </View>


          </View>
        </TouchableOpacity>

        <View style={{
          height: (item.isExpanded) ? null : 0,
          overflow: 'hidden',
        }}>
          {item.buyins.map((child, key) => this.getChildren(child, key))}

        </View>

      </View>
    );

  }
}

export default class GamesBuyin extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      scoreList: [],
      userInfo: {},
    };
  }

  componentDidMount = async () => {

  }

  updateLayout = index => {
    var array = [];
    array = [...this.props.game_users];


    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false)
    );
    this.setState(() => {
      return {
        game_users: array,
      };
    });


  };

  renderView = () => {
    const { game_users, gameDetails } = this.props;
    return (
      <>

        <View style={styles.list}>
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
            data={game_users}
            renderItem={({ item, index }) => <ExpandableItemComponent
              key={item.id.toString() + Math.random()}
              onClickFunction={this.updateLayout.bind(this, index)}
              that={this}
              item={item}
            />}
            keyExtractor={item => item.id.toString() + Math.random()}
          //ListFooterComponent={() => <LoaderFooter visible={show_footer_loader} />}
          //ListEmptyComponent={() => <NoRecord visible={show_no_record} />}

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
    flex: 1, backgroundColor: '#FFF',borderRadius: 10, flexDirection: 'row',overflow:'hidden'
  },

  cardImage: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: 8
  },



  list: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 5
  },
  whiteCircle: {
    height: RFPercentage(4),
    width: RFPercentage(4),
    backgroundColor: '#FFF',
    borderRadius: 50,
    alignContent: 'center',
    alignItems: 'center'
  },
  greenBox: {
    flexDirection: 'row',
    borderWidth: 1, borderColor: '#E9F9F1', borderRadius: 8,
    overflow: 'hidden',
    alignItems:'center'
  },

  redBox: {
    flexDirection: 'row',
    borderWidth: 1, borderColor: '#FEECED', borderRadius: 8,
    overflow: 'hidden'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#A8B0BC',
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15, borderRadius: 10,
    paddingRight: 15,
    marginBottom: 5,
    height: normalize(56)
  },
  userRow: { flexDirection: 'row', marginBottom: normalize(16), borderRadius: 10, flex: 1 },
  activeRow: { backgroundColor: '#FFF' },
  gridBGImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  verticalBorder:{width:'5%',height:'60%', borderLeftColor:'#DFE7F5', borderLeftWidth:1}
});