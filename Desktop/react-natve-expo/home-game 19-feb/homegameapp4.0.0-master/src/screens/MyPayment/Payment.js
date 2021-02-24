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
  Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, isValidNumber, convertLocalToUTC } from '../../api/service';
import { getListContent } from '../../api/serviceHandler';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images from '../../../constants/Images';
import { SmallButton, SmallButton2, IconButton } from '../../components/Buttons/Button';
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
    if (item.amount_type === 'credit' || item.amount_type === 'received') {
      return (<View key={'child_' + key} style={[Styles.tbRow, { paddingLeft: 10, paddingRight: 10, marginBottom: 5 }]}>
        <View style={[styles.greenBox, { flexDirection: 'row', height: RFPercentage(7) }]}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <View style={[Styles.centerText, Styles.shadow5, styles.whiteCircle]}>
              <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{key + 1}</Text>
            </View>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%' }]}>
            <Text style={[Styles.font12, Styles.fontMedium, Styles.textPrimaryDark]}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%', flexDirection: 'row' }]}>
            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View>
            <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.green, { marginLeft: 2 }]}>{item.amount}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%', backgroundColor: '#E9F9F1' }]}>
            {!item.game_id ? <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.green]}>Cr</Text> : <Image source={Images.arrowGreen} style={{ height: 22, width: 15 }} />}
          </View>
        </View>
      </View>
      )
    } else if (item.amount_type === 'debit' || item.amount_type === 'paid') {
      return (<View key={'child_' + key} style={[Styles.tbRow, { paddingLeft: 10, paddingRight: 10, marginBottom: 5 }]}>
        <View style={[styles.redBox, { flexDirection: 'row', height: RFPercentage(7) }]}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <View style={[Styles.centerText, Styles.shadow5, styles.whiteCircle]}>
              <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{key + 1}</Text>
            </View>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%' }]}>
            <Text style={[Styles.font12, Styles.fontMedium, Styles.textPrimaryDark]}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%', flexDirection: 'row' }]}>
            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View>
            <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.red, { marginLeft: 2 }]}>{item.amount}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%', backgroundColor: '#FEECED' }]}>
            {!item.game_id ? <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.red]}>Dr</Text> : <Image source={Images.arrowRed} style={{ height: 22, width: 15 }} />}
          </View>
        </View>
      </View>)
    }



  }

  render() {
    const { item } = this.props;
    return (
      <View style={[{ flexDirection: 'column', backgroundColor: '#FFF', marginBottom: RFPercentage(2), borderRadius: 8 }, Styles.shadow2]}>
        {(item.is_pending_request) ? 
        <TouchableOpacity
        activeOpacity={0.7}
        onPress={(!item.is_pending_request) ? this.props.onClickFunction : null}
      >
        <View style={[styles.row, { marginBottom: 5 }]}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
            {/* <Text style={styles.dateContent}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text> */}
          </View>

          <View style={[Styles.tbCol, Styles.centerText, { width: '45%', padding: normalize(5) }]}>
            <Text numberOfLines={1} style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark, { textAlign: 'center' }]}>{item.name}</Text>
          </View>

          {/* <View style={[Styles.tbCol, Styles.centerText, { width: '30%', flexDirection: 'row' }]}>
            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View>
            <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, Styles.ml2]}>{item.pending_request.amount}</Text>
          </View> */}

          <View style={[Styles.tbCol, Styles.centerText, { width: '40%' }]}>
            <View style={[Styles.tbRow]}>
            {item.pending_request.amount_type === 'paid' ? <Text style={[Styles.font14, Styles.fontBold]}>Paid: </Text> : null}
            {item.pending_request.amount_type === 'amount_type' ? <Text style={[Styles.font14, Styles.fontBold]}>RCVD: </Text> : null}
            <Text style={[Styles.font14, Styles.fontMedium, Styles.textGray]}>{item.pending_request.amount}</Text>
            </View>
            <View style={[Styles.tbRow]}>
            <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
                <IconButton onPress={() => this.props.that.updatePendingRequest(item.pending_request.id,'Rejected')} name="times-circle" color="#EE5A55" type="FontAwesome5" fontSize={25} />
            </View>
            <View style={[Styles.tbCol, Styles.centerText, { width: '50%' }]}>
                <IconButton onPress={() => this.props.that.updatePendingRequest(item.pending_request.id, 'Approved')} name="check-circle" color="#1BC773" type="FontAwesome5" fontSize={25} />
            </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
        : 
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={(!item.is_pending_request) ? this.props.onClickFunction : null}
        >
          <View style={[styles.row, { marginBottom: 5 }]}>
            <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
              <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
              {/* <Text style={styles.dateContent}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text> */}
            </View>

            <View style={[Styles.tbCol, Styles.centerText, { width: '35%', padding: normalize(5) }]}>
              {item.amount_type === 'debit' ? <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>you owe</Text> : null}
              <Text numberOfLines={1} style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark, { textAlign: 'center' }]}>{item.name}</Text>
              {item.amount_type === 'credit' ? <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>owes you</Text> : null}
            </View>

            <View style={[Styles.tbCol, Styles.centerText, { width: '30%', flexDirection: 'row' }]}>
              <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
              </View>
              <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, Styles.ml2]}>{item.amount}</Text>
            </View>

            <View style={[Styles.tbCol, Styles.centerText, { width: '20%' }]}>
              <SmallButton
                onPress={() => this.props.that.clearPayment(item)}
                startColor="#2A395B" endColor="#080B12" label="Clear" fontSize={10} btnStyle={{ width: normalize(50) }} />
                
            </View>
          </View>
        </TouchableOpacity>
        }
        

        <View style={{
          height: (item.isExpanded) ? null : 0,
          overflow: 'hidden',
        }}>
          {item.children.map((child, key) => this.getChildren(child, key))}

        </View>

      </View>
    );
  }
}


class PastExpandableItemComponent extends Component {
  //Custom Component for the Expandable List

  getChildren = (item, key) => {
    if (item.amount_type === 'credit' || item.amount_type === 'received') {
      return (<View key={'child_' + key} style={[Styles.tbRow, { paddingLeft: 10, paddingRight: 10, marginBottom: 5, height: 50 }]}>
        <View style={[styles.greenBox, { flexDirection: 'row', height: RFPercentage(7) }]}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <View style={[Styles.centerText, Styles.shadow5, styles.whiteCircle]}>
              <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{key + 1}</Text>
            </View>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%' }]}>
            <Text style={[Styles.font12, Styles.fontMedium, Styles.textPrimaryDark]}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%', flexDirection: 'row' }]}>
            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View>
            <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.green, { marginLeft: 2 }]}>{item.amount}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%', backgroundColor: '#E9F9F1' }]}>
            {!item.game_id ? <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.green]}>Cr</Text> : <Image source={Images.arrowGreen} style={{ height: 22, width: 15 }} />}
          </View>
        </View>
      </View>
      )
    } else if (item.amount_type === 'debit' || item.amount_type === 'paid') {
      return (<View key={'child_' + key} style={[Styles.tbRow, { paddingLeft: 10, paddingRight: 10, marginBottom: 5 }]}>
        <View style={[styles.redBox, { flexDirection: 'row', height: RFPercentage(7) }]}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <View style={[Styles.centerText, Styles.shadow5, styles.whiteCircle]}>
              <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark]}>{key + 1}</Text>
            </View>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%' }]}>
            <Text style={[Styles.font12, Styles.fontMedium, Styles.textPrimaryDark]}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '35%', flexDirection: 'row' }]}>
            <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View>
            <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.red, { marginLeft: 2 }]}>{item.amount}</Text>
          </View>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%', backgroundColor: '#FEECED' }]}>
            {!item.game_id ? <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, Styles.red]}>Dr</Text> : <Image source={Images.arrowRed} style={{ height: 22, width: 15 }} />}
          </View>
        </View>
      </View>)
    }



  }

  render() {
    const { item } = this.props;
    return (
      <View style={[{ flexDirection: 'column', backgroundColor: '#FFF', marginBottom: RFPercentage(2), borderRadius: 8 }, Styles.shadow2]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.props.onClickFunction}
        >
          <View style={[styles.row, { marginBottom: 5 }]}>
            <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
              <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
            </View>

            <View style={[Styles.tbCol, Styles.centerText, { width: '35%', padding: normalize(5) }]}>
              {item.amount_type === 'debit' ? <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>you paid</Text> : null}
              <Text numberOfLines={1} style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark, { textAlign: 'center' }]}>{item.name}</Text>
              {item.amount_type === 'credit' ? <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>paid you</Text> : null}
            </View>

            <View style={[Styles.tbCol, Styles.centerText, { width: '30%', flexDirection: 'row' }]}>
              <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
              </View>
              <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, Styles.ml2]}>{item.amount}</Text>
            </View>

            <View style={[Styles.tbCol, Styles.centerText, { width: '20%' }]}>
              <Text style={styles.dateContent}>{moment(item.cleared_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{
          height: (item.isExpanded) ? null : 0,
          overflow: 'hidden',
        }}>
          {item.children.map((child, key) => this.getChildren(child, key))}

        </View>

      </View>
    );
  }
}

export default class Payment extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>My Payments</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
      headerRight: () => (navigation.getParam('navBar', { active_tab: 'tab1' }).active_tab === 'tab2') ? <PeriodFilter options={['Weekly', 'Monthly', 'Yearly']} defaultValue={navigation.getParam('defaultValue')} changeFilter={navigation.getParam('changeFilter')} /> : null,

    };
  };

  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.state = {
      listRecords: [],
      page: 1,
      current_page: 1,
      total_pages: 1,

      //loading status
      is_api_calling: false,//show if api already called
      show_footer_loader: false,// show when next page called
      show_no_record: false, // show when no record in list
      showIndicator: false, // show loader for first time
      refreshing: false, //show loader on pull to refresh

      pendingPayments: [],
      pastPayments: [],
      activeTab: 'tab1',
      layoutHeight: 0,
      period: 'current_week',
      filterObj: { week: 'Weekly', month: 'Monthly', year: 'Yearly' },
      filter_mode: 'week',
      dates: { start_date: '', end_date: '' }
    };
  }

  componentDidMount() {

    this.props.navigation.setParams({ changeFilter: this.changeFilter });
    this.getListRecords('tab1')
  }


  changeFilter = (id, name) => {
    var filter = ['week', 'month', 'year'];
    var type = filter[id];
    this.setState({ filter_mode: type })

    // setTimeout(() => {
    //   this.getListRecords(this.state.activeTab)
    // }, 100)
  }

  getListRecords = (tab = 'tab1') => {
    if (tab === 'tab1') {
      this.setState({refreshing: true})
      let params = {  };
      postData('game/pending-payments', params).then(async (res) => {
        console.log(JSON.stringify(res))
        this.setState({refreshing: false})
        if (res.status) {
          var lista = []
          res.data.map((value, key) => {
            value.isExpanded = false;
            lista.push(value)
          });
          console.log(JSON.stringify(res))
          this.setState({ pendingPayments: lista })
        } else {
          ToastMessage(res.message, "error")
        }
        
      })
      this.setState({ activeTab: 'tab1' })
    } else {
      this.props.navigation.setParams({
        defaultValue: this.state.filterObj[this.state.filter_mode]
      });

      this.getListData('first', this.state.dates)
      // let params = { period: this.state.period };
      // postData('game/past-payments', params).then(async (res) => {
      //   if (res.status) {
      //     this.setState({ pastPayments: res.data })
      //   } else {
      //     ToastMessage(res.message, "error")
      //   }
      // })

      this.setState({ activeTab: 'tab2' })
    }

    this.props.navigation.setParams({
      navBar: {
        active_tab: tab,
      }
    });
  }



  getListData = async (type, dates) => {
    let start_date = convertLocalToUTC(dates.start_date+' 00:00:00');
    let end_date = convertLocalToUTC(dates.end_date+' 23:59:59');
   
    let params = { start_date: start_date, end_date: end_date };
    getListContent('game/past-payments', params, this, type)
  }

  clearPayment(item) {
    console.log(item.amount_type)
    let message = 'Are you sure you want to clear the entire balance?'; 
    Alert.alert('Home Game', message, [{
      text: 'Yes', onPress: async () => {

        let params = { user_id: item.other_user_id, amount: item.amount, amount_type: item.amount_type };
        this.setState({showIndicator: true})
        postData('clear-payment', params).then(async (res) => {
          if (res.status) {
            this.getListRecords()
            ToastMessage(res.message)
          } else {
            ToastMessage(res.message, "error")
          }
          this.setState({showIndicator: false})
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
  updatePendingRequest(id, status) {
   
    let params = { id: id, status: status };
    this.setState({showIndicator: true})
    postData('update-payment-request', params).then(async (res) => {
      if (res.status) {
        this.getListRecords()
        ToastMessage(res.message)
      } else {
        ToastMessage(res.message, "error")
      }
      this.setState({showIndicator: false})
    })
   
    
  }
  
  clearPartialPayment(item) {
    if(isValidNumber(item.partial_amount)){
      if (item.partial_amount > item.amount) {
        ToastMessage("You can't enter more than pending amount.")
      } else if (item.partial_amount == item.amount) {
        this.clearPayment(item)
      } else {
        this.setState({showIndicator: true})
        let params = { transaction: item };
        postData('clear-partial-payment', params).then(async (res) => {
          if (res.status) {
            this.getListRecords()
            ToastMessage(res.message)
          } else {
            ToastMessage(res.message, "error")
          }
          this.setState({showIndicator: false})
        })
      }
    }else{
      ToastMessage("Please enter valid amount.")
    }
    

  }

  updateLayout = index => {
    var array = [];
    if (this.state.activeTab === 'tab1') {
      array = [...this.state.pendingPayments];
    } else {
      array = [...this.state.listRecords];
    }

    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false)
    );
    if (this.state.activeTab === 'tab1') {
      this.setState(() => {
        return {
          pendingPayments: array,
        };
      });
    } else {
      this.setState(() => {
        return {
          listRecords: array,
        };
      });
    }

  };

  pastSettlementCard = (item) => {
    return (<View style={[styles.row, { marginBottom: 5 }]}>
      <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
        <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
        <Text style={styles.dateContent}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
      </View>

      <View style={[Styles.tbCol, Styles.centerText, { width: '35%' }]}>
        {item.amount_type === 'debit' ? <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>you paid</Text> : null}
        <Text style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark]}>{item.name}</Text>
        {item.amount_type === 'credit' ? <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>paid you</Text> : null}

      </View>

      <View style={[Styles.tbCol, Styles.centerText, { width: '35%', flexDirection: 'row' }]}>
        <View style={[Styles.shadow5, { borderRadius: 50 }]}>
          <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
        </View>
        <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, Styles.ml2]}>{item.amount}</Text>
      </View>

      <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
        <Text style={[Styles.font10, Styles.fontBold, Styles.textGray, Styles.centerText, { paddingLeft: normalize(5), paddingRight: normalize(5) }]}>{moment(item.cleared_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
      </View>

    </View>);
  }

  renderView = () => {
    const { activeTab, filter_mode, listRecords, refreshing, show_footer_loader, show_no_record } = this.state;
    return (
      <>
        <View style={[Styles.tbRow, styles.tab]}>
          <View style={[Styles.tbCol, styles.tab1, (activeTab === 'tab1') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.getListRecords('tab1')}
            >
              <Text style={[(activeTab === 'tab1') ? styles.activeTabText : styles.inactiveTabText]}>Pending Payment</Text>
            </TouchableOpacity>
          </View>
          <View style={[Styles.tbCol, styles.tab2, (activeTab === 'tab2') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.getListRecords('tab2')}
            >
              <Text style={[(activeTab === 'tab2') ? styles.activeTabText : styles.inactiveTabText]}>Past Settlement</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
          {(activeTab === 'tab1') ?
            <SwipeListView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 120, paddingLeft: 2, paddingRight: 2 }}
              showsVerticalScrollIndicator={false}
              data={this.state.pendingPayments}
              onRefresh={() => {
                this.getListRecords('tab1', this.state.dates);
              }}
              refreshing={refreshing}
              renderItem={({ item, index }) => <ExpandableItemComponent
                key={item.id.toString() + Math.random()}
                onClickFunction={this.updateLayout.bind(this, index)}
                that={this}
                item={item}
              />}

              renderHiddenItem={({ item, index }) => {
                if(!item.is_pending_request){
                  return (
                    <View style={styles.rowBack}>
                      <View style={[Styles.tbCol, { width: '50%', flexDirection: 'row', justifyContent: 'flex-start' }]}>
                        <TextInput
                          placeholder={item.amount.toString()}
                          onChangeText={(value) => item.partial_amount = value}
                          maxLength={8}
                          keyboardType={"numeric"}
                          style={[Styles.inputField, { width: normalize(70), backgroundColor: '#FFF', marginRight: 5 }]}
                        />

                        {(item.amount_type === 'debit') ?
                          <SmallButton2
                            onPress={() => this.clearPartialPayment(item)}
                            startColor="#2A395B" endColor="#080B12" label="Pay" fontSize={10} btnStyle={{ width: normalize(50), justifyContent: 'center' }} />
                          //<SwipeBtn onPress={() => this.clearPartialPayment(item)} label="Pay" fontSize={10} btnStyle={{ width: normalize(50), justifyContent: 'center', marginLeft: 5 }} />
                          :
                          <SmallButton2
                            onPress={() => this.clearPartialPayment(item)}
                            startColor="#2A395B" endColor="#080B12" label="RCV" fontSize={10} btnStyle={{ width: normalize(50), justifyContent: 'center' }} />
                          // <SwipeBtn onPress={() => this.clearPartialPayment(item)} label="Rcv" fontSize={10} btnStyle={{ width: normalize(50), justifyContent: 'center', marginLeft: 5 }} />
                        }

                      </View>

                    </View>
                  )
                      }
              }
              }
              leftOpenValue={160}
              keyExtractor={item => item.id.toString() + Math.random()}
              ListEmptyComponent={() => <NoRecord visible={true} />}
            />
            :
            <>
              <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', height: normalize(50), paddingLeft: 0, paddingRight: 0, borderRadius: 10, marginTop:0 }]}>
                <DateFilter onChangeFilter={value => {
                  this.setState({ dates: value });
                  this.getListData('first', value)
                }} mode={filter_mode} />
              </LinearGradient>

              <FlatList
                contentContainerStyle={{ paddingBottom: 90, paddingLeft: 2, paddingRight: 2, marginTop:15 }}
                showsVerticalScrollIndicator={false}
                data={listRecords}
                renderItem={({ item, index }) => <PastExpandableItemComponent
                  key={item.id.toString() + Math.random()}
                  onClickFunction={this.updateLayout.bind(this, index)}
                  that={this}
                  item={item}
                />}
                keyExtractor={item => item.id.toString() + Math.random()}
                ListFooterComponent={() => <LoaderFooter visible={show_footer_loader} />}
                ListEmptyComponent={() => <NoRecord visible={show_no_record} />}
                onRefresh={() => {
                  this.getListData('refresh', this.state.dates);
                }}
                refreshing={refreshing}
                onEndReached={() => {
                  this.getListData('loadmore', this.state.dates);
                }}

              //ListEmptyComponent={() => <NoRecord visible={true} />}
              />
            </>}

        </View>

      </>
    );
  }
  render() {
    const { showIndicator } = this.state;
    return (
      <>
      {showIndicator ? <Loader /> : null}
      <ContainerTabScreen children={this.renderView()} styles={{ paddingBottom: 0, backgroundColor: '#E9EBEE' }} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1, backgroundColor: '#FFF', marginTop: 5, borderRadius: 10, flexDirection: 'row', padding: normalize(5),
  },

  dateContent: {
    ...Styles.font10,
    ...Styles.fontBold,
    ...Styles.textGray,
    ...Styles.centerText,
    ...{ marginTop: 5, paddingLeft: normalize(5), paddingRight: normalize(5) }
  },
  card: {
    backgroundColor: '#FFF',
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
    width: normalize(40),
    height: normalize(40),
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
    overflow: 'hidden'
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
});