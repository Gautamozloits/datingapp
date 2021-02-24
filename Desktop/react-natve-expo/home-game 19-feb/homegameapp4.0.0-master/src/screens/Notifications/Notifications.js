/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {

  Text,
  View,
  StyleSheet, Image, Alert, Dimensions, Animated, TouchableHighlight, LayoutAnimation, Platform, UIManager, TextInput, TouchableOpacity
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, convertDateTime } from '../../api/service';
import { getListContent } from '../../api/serviceHandler';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images from '../../../constants/Images';
import { IconButton, PlainIcon } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeftBack, ClearButton } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { ToastMessage } from '../../components/ToastMessage';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader'
import moment from "moment";
import { SwipeListView } from 'react-native-swipe-list-view';




if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

var isApiCalled;
export default class Notifications extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>Notifications</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerBackImage: () => <HeaderLeftBack />,
      headerRight: () => <ClearButton onPress={navigation.getParam('clearNotification')} />,
      headerBackTitle: " ",
    };
  };

  constructor(props) {
    super(props);


    this.state = {
      listRecords: [],
      current_page: 1,
      total_pages: 1,

      //loading status
      is_api_calling: false,//show if api already called
      show_footer_loader: false,// show when next page called
      show_no_record: false, // show when no record in list
      showIndicator: false, // show loader for first time
      refreshing: false, //show loader on pull to refresh

      initialList: []
    };

    //   this.state = {
    //     listViewData: Array(20).fill('').map((_,i) => ({key: `${i}`, text: `item #${i}`})),
    // };


  }
  onSwipeValueChange_ = (swipeData) => {
    const { key, value } = swipeData;
    if (value < -375 && !isApiCalled) {
      isApiCalled = true;
      this.clearNotification(this.state.listRecords[key].id, key);
    }

  }
  componentDidMount() {
    this.props.navigation.setParams({ clearNotification: this.clearNotification });
    this.getListData('first');
  }

 
  getListData = async (type) => {
    let params = {};
    getListContent('notifications', params, this, type)
  }

  getListRecords = () => {

    let params = {};
    postData('notifications', params).then(async (res) => {
      if (res.status) {
        var lista = []
        res.data.map((value, key) => {
          //value.isExpanded = false;
          lista.push(value)
        });

        this.setState({ listRecords: lista })
      } else {
        ToastMessage(res.message, "error")
      }
    })

  }

  clearNotification = () => {
  
      Alert.alert('Home Game', 'Are you sure you want to clear all notifications?', [{
        text: 'Yes', onPress: async () => {

          this.setState({ showIndicator: true })
          let params = {};

          postData('clear-notification', params).then(async (res) => {
            if (res.status) {
              this.getListData('first')
              ToastMessage(res.message)
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

  clearSingleNotification = (id) => {
  
    let params = { id: id };
    postData('clear-notification', params).then(async (res) => {
      this.getListData('first')
      isApiCalled = false;
    })

  }

  searchText = (text) => {
    const { initialList } = this.state;
    //passing the inserted text in textinput
    const newData = initialList.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.message ? item.message.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      listRecords: newData,
      text: text,
    });
  }

  viewPage = (data) => {
    let active_game_arr = ['CHIPS_REQUEST', 'NEW_LEAVE_REQUEST', 'CHIPS_ADDED', 'CHIPS_REQUEST_APPROVED', 'CHIPS_REQUEST_REJECTED', 'LEAVE_REQUEST_APPROVED', 'LEAVE_REQUEST_REJECTED', 'NEW_LEAVE_REQUEST'];
    let schedule_game_arr = ['NEW_INVITATION', 'USER_RESPONDED_TO_INVITATION', 'SEAT_CONFIRMED', 'SCHEDULE_GAME_NO_RESPONSE'];
    let pending_payment_arr = ['CLEARED_OUTSTANDING_DUES']
    if(data.type){
      if(active_game_arr.includes(data.type)){
        this.props.navigation.navigate('ActiveGame');
      }else if(schedule_game_arr.includes(data.type)){
        let active_tab = 'sent';
        if(data.type === 'NEW_INVITATION' || data.type === 'SEAT_CONFIRMED'){
          active_tab = 'received';
        }
        this.props.navigation.navigate('Invites', {view: active_tab});
      }else if(pending_payment_arr.includes(data.type)){
        this.props.navigation.navigate('Payment');
      }
    }

  }

  renderCard = (item) => {
    return (
    <TouchableOpacity onPress={() => this.viewPage(item)}>
      <View style={[styles.row, { marginBottom: 10, paddingTop: 10, paddingBottom: 10 }]}>
        <View style={[Styles.tbCol, Styles.centerText, { width: '10%' }]}>
          <PlainIcon name="bell" color="#042C5C" type="FontAwesome" fontSize={20} />
        </View>

        <View style={[Styles.tbCol, Styles.leftText, { width: '70%' }]}>
          <Text style={[Styles.font14, Styles.fontRegular, Styles.textGray]}>{item.message}</Text>
        </View>

        <View style={[Styles.tbCol, Styles.centerText, { width: '20%', flexDirection: 'row' }]}>
          <Text style={styles.dateContent}>{convertDateTime(item.created_at, 'DD MMM YY, hh:mm A')}</Text>
        </View>
      </View>
      </TouchableOpacity>);
  }

  renderView = () => {
    const { listRecords, showIndicator, refreshing, show_footer_loader, show_no_record } = this.state;
    const onSwipeValueChange = swipeData => {
      const { key, value } = swipeData;
      if (!isApiCalled && ((value <= -(Dimensions.get('window').width / 2)))) {
        isApiCalled = true;
        
        this.clearSingleNotification(this.state.listRecords[key].id, key);
      }
    };
    return (
      <>
        {showIndicator ? <Loader /> : null}
        <View style={[styles.list]}>
          <View style={[Styles.tbRow, {marginTop: 10, marginBottom: 10, backgroundColor:'#FFF', paddingTop:10, paddingBottom:10, paddingLeft:5, paddingRight:5, borderRadius:10}]}>
              <View style={[Styles.tbCol, { width: '100%' }]}>
                  <View style={[Styles.tbRow, Styles.centerText, { borderColor: '#DFE7F5', height: RFPercentage(5), borderWidth: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 30 }]}>
                      <TextInput
                          placeholder="Search here..."
                          placeholderTextColor="#77869E"
                          style={{ height: 20, width: '93%', fontSize: 12, paddingLeft: 5, paddingRight: 5, color: '#77869E' }}
                          onChangeText={text => this.searchText(text)}
                          value={this.state.text}
                          //value={address}
                      />
                      {(this.state.text && this.state.text != '') ? <IconButton onPress={() => this.searchText('')} name="times" color="#042C5C" type="FontAwesome5" fontSize={20} /> : <PlainIcon name="search" color="#77869E" type="FontAwesome5" fontSize={20} />}
                      
                      {/* <Image source={Images.search} style={[styles.userImg, { width: '7%', marginTop: 0 }]} resizeMode="contain" /> */}
                  </View>

              </View>
              
          </View>
          
          <SwipeListView
          contentContainerStyle={{ paddingBottom: 120 }}
            data={listRecords}
            renderItem={({ item, index }) => this.renderCard(item, index)}
            renderHiddenItem={({ item, index }) => {
              return (
                <View style={[Styles.tbRow]}>
                  <View style={[Styles.tbCol, { width: '60%', flexDirection: 'row', justifyContent: 'space-between' }]}>
                    {/* <Text>Left</Text> */}

                  </View>
                  <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-end' }]}>
                    {/* <Text>Right</Text> */}
                  </View>
                </View>
              )
            }

            }

            keyExtractor={(item, index) => "" + index}
            disableRightSwipe
            rightOpenValue={-Dimensions.get('window').width}
            onSwipeValueChange={onSwipeValueChange}
            ListFooterComponent={() => (show_footer_loader) ? <LoaderFooter visible={show_footer_loader} /> : <View style={{ height: 100 }} />}
            ListEmptyComponent={() => <NoRecord style={{ marginTop: RFPercentage(2) }} visible={show_no_record} />}
            onRefresh={() => {
              this.getListData('refresh');
            }}
            refreshing={refreshing}
            onEndReached={() => {
              this.getListData('loadmore');
            }}

          // leftOpenValue={0}
          //rightOpenValue={-75}
          />



          {/* <FlatList
            contentContainerStyle={{ paddingBottom: 90, paddingLeft: 2, paddingRight: 2 }}
            data={listRecords}
            renderItem={({ item, index }) => this.rendarCard(item, index)}
            keyExtractor={item => item.id.toString() + Math.random()}
            ListFooterComponent={() => <LoaderFooter visible={show_footer_loader} />}
            ListEmptyComponent={() => <NoRecord style={{ marginTop: RFPercentage(2) }} visible={show_no_record} />}
            onRefresh={() => {
              this.getListData('refresh');
            }}
            refreshing={refreshing}
            onEndReached={() => {
              this.getListData('loadmore');
            }}
          /> */}

        </View>

      </>
    );
  }
  render() {
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
    // );
    // return (
    //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //     <Text>Make It Rain</Text>
    //     <MakeItRain
    //       numItems={100}
    //       itemDimensions={{width: 40, height: 20}}
    //       itemComponent={<PlainIcon name="rupee" color="#042C5C" type="FontAwesome" fontSize={20} />}
    //       itemTintStrength={0.8}
    //       flavor="arrive"
    //       continuous={false}
    //       itemColors={['#B2B4A7', '#9E6197', '#ECA876', '#9A94D8', '#A1F2EC']}
    //     />
    //   </View>
    // );

    return (
      <ContainerTabScreen children={this.renderView()} styles={{ paddingBottom: 0, backgroundColor: '#E9EBEE' }} />
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
    //marginTop: RFPercentage(2)
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
