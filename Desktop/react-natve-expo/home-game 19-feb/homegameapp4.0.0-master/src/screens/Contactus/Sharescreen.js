/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View, Button,
  Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity, ScrollView, Share
} from 'react-native';

import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { Header, useHeaderHeight } from 'react-navigation-stack';
import { CheckBox } from 'react-native-elements'
import * as Linking from 'expo-linking';
import normalize from 'react-native-normalize';
import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { PrimaryButton } from '../../components/Buttons/Button';
import ContainerFixScreen from '../Views/ContainerFixScreen';
import { HeaderBG, HeaderLeft, PaymentFilter } from '../../components/HeaderOptions';
import { postData, getUserDetail } from '../../api/service';
import { Loader } from '../../components/Loader'
import { ToastMessage } from '../../components/ToastMessage';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');

export default class Sharescreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>Share app</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,

    };
  };
  constructor(props) {
    super(props);
    this.state = {
      android_link: '',
      ios_link: '',
      showIndicator: false,
    };
  }

  componentDidMount() {
      this.getContent();
  }
  getContent = () => {
    let params = {};
    postData('getAppLinks', params).then(async (res) => {
        this.setState({android_link: res.android, ios_link: res.ios})
    })
  }
  shareLink = async (type) => {
      var link = '';
      console.log(type)
      if(type === 'android'){
          console.log('1.....')
        link=this.state.android_link;
      }else if(type === 'ios'){
        console.log('2.....')
        link=this.state.ios_link;
      }
      
      console.log('link; ',link)
      try {
        const result = await Share.share({
          message: link,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
              console.log('shared...1')
            // shared with activity type of result.activityType
          } else {
            // shared
            console.log('shared...2')
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
          console.log('shared...3')
        }
      } catch (error) {
        alert(error.message);
      }
  }
  



  renderView = () => {
    const { showIndicator } = this.state;
    return (
      <View style={styles.fixBox}>
        {showIndicator ? <Loader /> : null}
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', paddingLeft: 0, paddingRight: 0, paddingTop: 15, paddingBottom: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
              <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16, { paddingLeft: 20 }]}>Share Home Game app</Text>
            </LinearGradient>
            <View style={styles.innerSection}>
              <ScrollView style={[{ flex: 1 }]}>
                <View style={styles.content}>


                  <View style={{ padding: 10 }}>
                    {/* <View style={[Styles.tbRow]}>
                        <View style={[Styles.tbCol, {width:'50%'}]}>
                            <TouchableOpacity onPress={() => this.shareLink('android')}>
                                <Image source={Images.google_play} style={{width:'100%', height:normalize(50)}} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.tbCol, {width:'50%'}]}>
                            <TouchableOpacity onPress={() => this.shareLink('ios')}>
                                <Image source={Images.iphone} style={{width:'100%', height:normalize(50)}} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={[Styles.tbRow]}>
                        <View style={[Styles.tbCol,Styles.centerText,{width:'100%'}]}>
                            
                            <Image source={Images.android_logo} style={{width:'100%', height:normalize(100)}} resizeMode="contain" />
                            <View style={{marginTop:normalize(10)}}>
                                <PrimaryButton onPress={() => {
                                    this.shareLink('android')
                                }} label="Share Android App" fontSize={12} btnStyle={{ paddingLeft:50, paddingRight:50 }} />
                            </View>
                                    
                        </View>
                    </View>
                  </View>

                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <ContainerFixScreen children={this.renderView()} />
    );
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