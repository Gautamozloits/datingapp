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

export default class Results extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>Final Result</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerBackImage: () => <HeaderLeftBack />,
      headerRight: () => <ShareScore shareScore={navigation.getParam('shareScore')} />,
      headerBackTitle: " ",
    };
  };

  constructor(props) {
    super(props);
    this._container = React.createRef();
    this.state = {
      listRecords: [],
      scoreList: [],
      finalSettlementList: [],
      activeTab: 'tab1',
      gameDetails: {},
      cameraRollUri: null,
      isShareViewVisible: false,
      userInfo: {},
      isBiggestWinner: false
    };
  }

  componentDidMount = async () => {
    let user = await getLoggedInUser();
    this.setState({ userInfo: user })
    this.props.navigation.setParams({ shareScore: this.shareScore });

    this.getListRecords('final_score')

   // this.focusListener = this.props.navigation.addListener('didFocus', () => {
      const { params } = this.props.navigation.state;
      if (params) {
        if (params.gameDetails) {
          if (params.gameDetails.users) {
            let gamesDetails = params.gameDetails;
            this.setState({ scoreList: params.gameDetails.users, gameDetails: gamesDetails })
            this.getFinalSettlement(params.gameDetails.game_id);

            this.getBiggestWinner(params.gameDetails.users);
          }
        }
      }
    //})

  }

  /**
   * Share game score
   */
  shareScore = () => {
    const { activeTab } = this.state;
    if (activeTab === 'tab1') {
      this.setState({ isShareViewVisible: true })
      setTimeout(() => {
        this._saveToCameraRollAsync();
      }, 500)
    } else {
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

  /**
   * Get final settlement
   * @param {*} game_id 
   */
  getFinalSettlement(game_id) {
    let params = { game_id: game_id };
    postData('game/final-settlement', params).then(async (res) => {
      if (res.status) {
        this.setState({ finalSettlementList: res.data })
      } else {
        ToastMessage(res.message, "error")
      }
    })
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

  /**
   * Get record according type
   * @param {*} type 
   */
  getListRecords = (type) => {

    if (type === 'final_score') {
      this.setState({ activeTab: 'tab1' })
    } else {
      this.setState({ activeTab: 'tab2' })
    }

  }

  /**
   * Update row when click to expand
   * @param {*} item 
   * @param {*} index 
   */
  updateLayout = (item, index) => {
    if (item.isExpanded) {
      item.isExpanded = false;
    } else {
      item['isExpanded'] = true;
    }
    const { scoreList } = this.state;
    scoreList[index] = item;

    this.setState(() => {
      return {
        scoreList: scoreList,
      };
    });
    console.log(JSON.stringify(this.state.scoreList))
  };


  finalScoreCardExpanded = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.updateLayout(item, index)}>
        <View style={styles.row} key={index}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '20%' }]}>
            <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
            <Text numberOfLines={1} style={[Styles.font10, Styles.fontRegular, Styles.textGray, Styles.centerText, { marginTop: 4, width: '100%' }]}>{item.name}</Text>
            <Text style={[Styles.font10, Styles.fontBold, Styles.centerText, (item.result === 'Winner') ? Styles.green : (item.result === 'Loser') ? Styles.red : Styles.textGray]}>{(item.result === 'Winner') ? 'Won' : (item.result === 'Loser') ? 'Lost' : 'Quits'}</Text>
          </View>
          <View style={[Styles.tbCol, { width: '80%' }]}>
            <View style={[Styles.tbRow, { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 5 }]}>
              <View style={[Styles.colCenter]}>
                <Text style={[Styles.font10, Styles.fontBold, Styles.centerText, (item.result === 'Winner') ? Styles.green : (item.result === 'Loser') ? Styles.red : Styles.textGray]}>{(item.result === 'Winner') ? 'Won' : (item.result === 'Loser') ? 'Lost' : 'Quits'}</Text>
                <View style={[Styles.shadow5, styles.currancyMargin]}>
                  <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                </View>
                <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark, (item.result === 'Winner') ? Styles.green : (item.result === 'Loser') ? Styles.red : Styles.textGray]}>{(item.result === 'Winner' && item.won_amount) ? item.won_amount : (item.result === 'Loser' && item.lost_amount) ? item.lost_amount : 0}</Text>
              </View>
              <View style={Styles.borderHr}></View>
              <View style={[Styles.colCenter]}>
                <Text style={[Styles.font10, Styles.fontBold, Styles.centerText, Styles.textPrimaryDark]}>{(item.result === 'Winner') ? 'Received' : (item.result === 'Loser') ? 'Paid' : 'Quits'}</Text>
                <View style={[Styles.shadow5, styles.currancyMargin]}>
                  <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                </View>
                <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark, Styles.textPrimaryDark]}>{(item.result === 'Winner' && item.received_amount) ? item.received_amount : (item.result === 'Loser' && item.paid_amount) ? item.paid_amount : 0}</Text>
              </View>
            </View>
            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
              <Image source={Images.line} style={{ width: '100%', height: 1, alignSelf: 'center' }} />
            </View>

            <View style={[Styles.tbRow, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }]}>
              <View style={[Styles.tbRow,]}>
                <View style={[Styles.colCenter]}>
                  <Text style={[Styles.font10, Styles.fontBold, Styles.centerText, Styles.textPrimaryDark]}>Balance</Text>
                  <View style={[Styles.shadow5, styles.currancyMargin]}>
                    <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                  </View>
                  <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark, Styles.textPrimaryDark]}>{(item.result === 'Winner') ? item.settled_amount : (item.result === 'Loser') ? item.remaining_amount_tobe_paid : 0}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

  }

  finalScoreCard = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.updateLayout(item, index)}>
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



  shareFinalScore() {
    const { activeTab, scoreList, finalSettlementList, gameDetails } = this.state;

    return (<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: normalize(100) }} style={{ flex: 1 }}>
      <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }} style={{ flex: 1, backgroundColor: '#F8F9F9', padding: 20 }} >
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
      </ViewShot>
    </ScrollView>);

  }

  shareFinalSettlement() {
    const { activeTab, scoreList, finalSettlementList, gameDetails } = this.state;

    return (<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: normalize(100) }} style={{ flex: 1 }}>
      <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }} style={{ flex: 1, backgroundColor: '#F8F9F9', padding: 20 }} >
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
              {gameDetails.options.initial_buy_in && gameDetails.options.initial_buy_in !== '' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>BI: {kFormatter(gameDetails.options.initial_buy_in)}</Text> : null}

              {gameDetails.options.blinds && gameDetails.options.blinds !== '' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>BL: {gameDetails.options.blinds}</Text> : null}

              {gameDetails.options.showdown && gameDetails.options.showdown !== '' ? <Text style={[Styles.font12, Styles.fontMedium, Styles.textGray]}>SD: {kFormatter(gameDetails.options.showdown)}</Text> : null}
            </View>
          </View>
        </View>
        {finalSettlementList.map((item, index) => {
          return (this.finalSettlementCard(item, index))
        })}
      </ViewShot>
    </ScrollView>);

  }

  renderView = () => {
    const { activeTab, scoreList, finalSettlementList, gameDetails, isBiggestWinner } = this.state;
    return (
      <>
        {(isBiggestWinner) ? <MakeItRain
          numItems={120}
          itemDimensions={{ width: 40, height: 20 }}
          itemComponent={<PlainIcon name="rupee" color="#042C5C" type="FontAwesome" fontSize={20} />}
          itemTintStrength={0.8}
          flavor="arrive"
          continuous={false}
          itemColors={['#B2B4A7', '#9E6197', '#ECA876', '#9A94D8', '#A1F2EC']}
        /> : null}
        <View style={[Styles.tbRow, styles.tab]}>
          <View style={[Styles.tbCol, styles.tab1, (activeTab === 'tab1') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.getListRecords('final_score')}
            >
              <Text style={[(activeTab === 'tab1') ? styles.activeTabText : styles.inactiveTabText]}>Final Score</Text>
            </TouchableOpacity>
          </View>
          <View style={[Styles.tbCol, styles.tab2, (activeTab === 'tab2') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.getListRecords('past')}
            >
              <Text style={[(activeTab === 'tab2') ? styles.activeTabText : styles.inactiveTabText]}>Final Settlement</Text>
            </TouchableOpacity>
          </View>
        </View>

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


          {(activeTab === 'tab1') ?

            <FlatList
              collapsable={false}
              contentContainerStyle={{ paddingBottom: 90, paddingLeft: 2, paddingRight: 2 }}
              showsVerticalScrollIndicator={false}
              data={scoreList}
              renderItem={({ item, index }) => (item.isExpanded) ? this.finalScoreCardExpanded(item, index) : this.finalScoreCard(item, index)}
              keyExtractor={item => item.id.toString() + Math.random()}
              ListFooterComponent={() => <View style={{ height: 100 }} />}
            />
            :
            <FlatList
              contentContainerStyle={{ paddingBottom: 90, paddingLeft: 2, paddingRight: 2 }}
              showsVerticalScrollIndicator={false}
              data={finalSettlementList}
              renderItem={({ item, index }) => this.finalSettlementCard(item, index)}
              keyExtractor={item => item.id.toString() + Math.random()}
              ListFooterComponent={() => <View style={{ height: 100 }} />}
            />}


        </View>
      </>
    );
  }
  render() {
    const { gameDetails } = this.state;
    // return (
    //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //     <Confetti
    //       count={100} // custom number of confettis
    //       size={20}
    //       colors={['red', 'green', 'blue']} // require FastImage
    //      // imageComponent={FastImage} // custom image component
    //       confettiImages={[
    //         Images.arrow,
    //         Images.triangle_Confirmed,
    //         Images.triangle_Pending,
    //         Images.triangle_Waiting
    //       ]} // all confetti images to be chosen randomly
    //       yspeed={3} // fall speed
    //     />
    //     </View>
    // );<Loader />

    return (
      (gameDetails.game_id) ? <ContainerTabScreen styles={{ backgroundColor: '#F8F9F9' }} children={this.state.isShareViewVisible ? this.shareFinalScore() : this.state.isSettlementViewVisible ? this.shareFinalSettlement() : this.renderView()} /> : <Loader />
    );
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