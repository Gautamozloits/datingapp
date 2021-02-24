/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View, TextInput,
  Image, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton, SwitchExample, RoundButton2 } from '../../components/Buttons/Button';
import ContainerTabScreen from '../Views/ContainerTabScreen';
import { HeaderBG, HeaderLeft, HeaderCstmLeftBack } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { isValidNumber, getSumofNumber } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';
import Received from './Received';
import Sent from './Sent';

export default class Invites extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>Invite</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => (navigation.getParam('navBar', { currentView: 'List' }).currentView == 'List') ? <HeaderLeft onPress={() => navigation.openDrawer()} /> : <HeaderCstmLeftBack onPress={navigation.getParam('backListView')}/>,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      listRecords: [],
      activeTab: 'received',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      navBar: {
        currentView: 'List'
      }
    });
    this.props.navigation.setParams({ backListView: this.backListView });

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      const { params } = this.props.navigation.state;
      if (params) {
        console.log('params....',params)
          if (params.view && params.view =='sent') {
            this.setState({activeTab: 'send'})
          }
        }
      });
  }

  backListView = () => {
    this.refs.receivedRef.switchView('List');
  }
  

  switchTab = (type) => {
    if(type == 'received' && this.refs.receivedRef){
      this.refs.receivedRef.switchView('List');
    }
      this.setState({ activeTab: type })
  }


  renderView = () => {
    const { activeTab } = this.state;
    const { user, socket, gameId, that } = this.props
    return (
      <>
        <View style={[Styles.tbRow, styles.tab]}>
          <View style={[Styles.tbCol, styles.tab1, (activeTab === 'received') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.switchTab('received')}
            >
              <Text style={[(activeTab === 'received') ? styles.activeTabText : styles.inactiveTabText]}>Received</Text>
            </TouchableOpacity>
          </View>
          <View style={[Styles.tbCol, styles.tab2, (activeTab === 'send') ? styles.activeTab : styles.inactiveTab]}>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              onPress={() => this.switchTab('send')}
            >
              <Text style={[(activeTab === 'send') ? styles.activeTabText : styles.inactiveTabText]}>Sent</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
           {activeTab == 'received' ? <Received ref="receivedRef" nav={this.props.navigation} that={this} /> : <Sent ref="receivedRef" nav={this.props.navigation} that={this} />} 
        </View>

      </>
    );
  }

  render() {
    return (
      <ContainerTabScreen children={this.renderView()} styles={{ paddingBottom: 0 }} />
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
    //paddingLeft: 20,
    //paddingRight: 20,
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