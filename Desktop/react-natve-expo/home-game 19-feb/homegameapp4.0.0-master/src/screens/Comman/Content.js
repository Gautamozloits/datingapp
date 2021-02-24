/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View, Button,
  Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity, ScrollView, AsyncStorage
} from 'react-native';



import Styles from '../../styles/Styles';
import ContainerFixScreen from '../Views/ContainerFixScreen';
import { HeaderBG, HeaderLeft, HeaderLeftBack } from '../../components/HeaderOptions';
import { postData, getUserDetail } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';
import { WebView } from 'react-native-webview';
import { Loader } from '../../components/Loader'

const { width, height } = Dimensions.get('window');

export default class Content extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>User Manual</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      content: {},
      showIndicator: false,
    };
  }

  componentDidMount() {
    this.getContent()
  }

  
  getContent = () => {
    let params = {
      type: 'manual',
    };
    this.setState({ showIndicator: true })
    postData('contents', params).then(async (res) => {
      this.setState({ showIndicator: false })
      if (res.status) {
        this.setState({content: res.data})
      } else {
        ToastMessage(res.message, "error")
      }
    })
  }



  renderView = () => {
    const { content, showIndicator } = this.state;
    return (
        <>
        {showIndicator ? <Loader /> : null}
        <WebView
        originWhitelist={['*']}
        source={{ html: (content.content) ? content.content : '' }}
        style={{ marginTop: 0 }}
      />
      </>
    );
  }
  render() {
    return (<ContainerFixScreen styles={{padding:0}} children={this.renderView()} />)
  }
}

const styles = StyleSheet.create({
  content: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', },
  box: { width: '100%', flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20 },
  boxContent: {
    paddingTop: 10,
    paddingRight: 30
  },
  checkBoxContainer: { backgroundColor: 'transparent', borderWidth: 0, paddingLeft: 0, marginLeft: 0 },
  flexContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  fixBox: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 75,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

  },
  innerSection: {
    backgroundColor: '#FFF',
    flex: 1,
    height: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

  },
})