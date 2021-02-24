/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text, TextInput,
  View,
  Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, PixelRatio, ScrollView
} from 'react-native';
import ViewShot from "react-native-view-shot";
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, getCurrencyName, getLoggedInUser } from '../../api/service';
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
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import FinalScore from './FinalScore';
import FinalSettlement from './FinalSettlement';
import ShareFinalScore from './ShareFinalScore';
import ShareFinalSettlement from './ShareFinalSettlement';
import GamesBuyin from './GamesBuyin';

import * as Sharing from 'expo-sharing';

import moment from "moment";
const initialLayout = { width: Dimensions.get('window').width };

export default class GameDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>Final Result</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerBackImage: () => <HeaderLeftBack />,
      headerRight: () => (navigation.getParam('navBar', { currentStatus: 'Share' }).currentStatus === 'Share') ? <ShareScore shareScore={navigation.getParam('shareScore')} /> : null,
      headerBackTitle: " ",
    };
  };

  constructor(props) {
    super(props);
    this._container = React.createRef();
    this.state = {
      GAME_DETAIL: {},
      listRecords: [],
      scoreList: [],
      finalSettlementList: [],
      activeTab: 'tab1',
      gameDetails: {},
      cameraRollUri: null,
      isShareViewVisible: false,
      userInfo: {},
      isBiggestWinner: false,
      routes: [
        { key: 'first', title: 'Final Score' },
        { key: 'second', title: 'Final Settlement' },
        { key: 'third', title: 'Buy Ins' },
        //{ key: 'fourth', title: 'Best Moments' },
      ],
      index: 0,
      loadPage: false,
      currancyName: 'rupee-sign'
    };
  }

  componentDidMount = async () => {
    let user = await getLoggedInUser();
    let currancyName = await getCurrencyName(user.country_code)
    this.setState({currancyName: currancyName})
    this.setState({ userInfo: user })
    this.props.navigation.setParams({ shareScore: this.shareScore });
    this.props.navigation.setParams({
      navBar: {
        currentStatus: 'Share'
      }
    });
    //this.getListRecords('final_score')

    // this.focusListener = this.props.navigation.addListener('didFocus', () => {
    const { params } = this.props.navigation.state;
    if (params) {

      if (params.gameDetails) {
        if (params.gameDetails.users) {
          let gamesDetails = params.gameDetails;

          this.setState({ scoreList: params.gameDetails.users, gameDetails: gamesDetails })

          this.getFinalSettlement(params.game_id);
          this.getBiggestWinner(params.gameDetails.users);
        }
      }
    }
    //})

  }

  componentWillUnmount(){
    this.setState({isBiggestWinner: false})
  }

  getBiggestWinner(users) {
    const { userInfo } = this.state;

    let user = users.reduce(function (prev, current) {
      return (prev.won_amount >= current.won_amount) ? prev : current
    });
    users.map((value)=>{
      if((value.won_amount == user.won_amount) && value.id == userInfo.id){
        this.setState({ isBiggestWinner: true })
      }
    })
  }

  getFinalSettlement(game_id) {
    let params = { game_id: game_id };
    postData('game/final-settlement', params).then(async (res) => {
      if (res.status) {
        this.setState({ finalSettlementList: res.data, GAME_DETAIL: res.game_details, loadPage: true })
      } else {
        ToastMessage(res.message, "error")
      }
    })
  }

  /**
   * Share game score
   */
  shareScore = () => {
    const { index } = this.state;
    if (index === 0) {
      this.setState({ isShareViewVisible: true })
      setTimeout(() => {
        this._saveToCameraRollAsync();
      }, 500)
    } else if (index === 1) {
      this.setState({ isSettlementViewVisible: true })
      setTimeout(() => {
        this._saveToCameraRollAsync();
      }, 500)
    }
  }


  _saveToCameraRollAsync = async () => {
    this.refs.viewShot.capture().then(uri => {
      this.setState({ isShareViewVisible: false, cameraRollUri: uri, isSettlementViewVisible: false })
      this.openShareDialogAsync();
    });
  };

  openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync('file://' + this.state.cameraRollUri);
  };

  FirstRoute = () => {
    const { scoreList, gameDetails } = this.state;
    return (<View style={[styles.scene, {}]}>
      {(gameDetails && gameDetails.game_id) ? <FinalScore scoreList={scoreList} gameDetails={gameDetails} /> : null}
    </View>)
  }
  SecondRoute = () => {
    const { finalSettlementList, gameDetails } = this.state;
    return (<View style={[styles.scene, {}]}>
      {(gameDetails && gameDetails.game_id) ? <FinalSettlement finalSettlementList={finalSettlementList} gameDetails={gameDetails} /> : null}
    </View>)
  }
  ThirdRoute = () => {
    
    const { scoreList, gameDetails, GAME_DETAIL } = this.state;
    return (<View style={[styles.scene, { }]}> 
      {(GAME_DETAIL && GAME_DETAIL.game_id) ? <GamesBuyin game_users={GAME_DETAIL.users} gameDetails={gameDetails} /> : null}
    </View>)
   
  }

  // FourthRoute = () => {
  //   return (<View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
  //   </View>)
  // }






  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
    third: this.ThirdRoute,
    //fourth: this.FourthRoute
  });
  render() {
    const { index, routes, loadPage, gameDetails, scoreList, finalSettlementList, isShareViewVisible, isSettlementViewVisible, isBiggestWinner, currancyName } = this.state;
    const renderTabBar = props => (
      <TabBar
        {...props}
        scrollEnabled={true}
        indicatorStyle={{ backgroundColor: '#2A395B' }}
        style={{ backgroundColor: '#E9EBEE' }}
        activeColor={'#2A395B'}
        inactiveColor={'#A8B0BC'}
        tabStyle={{ width: 'auto' }}
      />
    );
    if (isShareViewVisible) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: normalize(100) }} style={{ flex: 1 }}>
          <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }} style={{ flex: 1, backgroundColor: '#F8F9F9', padding: 20 }} >
            <ShareFinalScore gameDetails={gameDetails} scoreList={scoreList} />
          </ViewShot>
        </ScrollView>
      )
    } else if (isSettlementViewVisible) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: normalize(100) }} style={{ flex: 1 }}>
          <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }} style={{ flex: 1, backgroundColor: '#F8F9F9', padding: 20 }} >
            <ShareFinalSettlement gameDetails={gameDetails} finalSettlementList={finalSettlementList} />
          </ViewShot>
        </ScrollView>
      )
    } else {
      return (
        (loadPage) ? <>
        
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={this.renderScene}
          onIndexChange={(index) => {
            this.setState({ index: index })
            if(index <= 1){
              this.props.navigation.setParams({
                navBar: {
                  currentStatus: 'Share'
                }
              });
            }else{
              this.props.navigation.setParams({
                navBar: {
                  currentStatus: ''
                }
              });
            }
          }}
          initialLayout={initialLayout}
        />{(isBiggestWinner) ? <MakeItRain
          numItems={100}
          itemDimensions={{ width: 40, height: 20 }}
          itemComponent={<PlainIcon name={currancyName} color="#042C5C" type="FontAwesome5" fontSize={20} />}
          itemTintStrength={0.8}
          flavor="arrive"
          continuous={false}
          itemColors={['#B2B4A7', '#9E6197', '#ECA876', '#9A94D8', '#A1F2EC']}
        /> : null}</> : null
      );
    }

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
  },
  scene: {
    flex: 1,
  },
});