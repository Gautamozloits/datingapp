/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View,
  Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
//import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, useHeaderHeight } from 'react-navigation-stack';

import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { RoundButton2 } from '../../components/Buttons/Button';
import ContainerFixScreen from '../Views/ContainerFixScreen';

const { width, height } = Dimensions.get('window');

export default class PastPayment extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      //Heading/title of the header
      title: 'Past Settlement',
      headerTitleAlign: 'center',
      headerTintColor: '#fff',
      headerBackground: () => (
        <LinearGradient
          colors={['#2A395B', '#080B12']}
          style={{ flex: 1, height: 80 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log('Right')}>
          <Image source={Images.notification} style={{ height: 20 }} resizeMode="contain" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={Images.menuIcon} style={{ height: 20 }} resizeMode="contain" />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
        listRecords: [{id: 1, name: 'lokesh', image_url: ''}, {id: 2, name: 'lokesh', image_url: ''}, {id: 3, name: 'lokesh', image_url: ''}, {id: 4, name: 'lokesh', image_url: ''}, {id: 5, name: 'lokesh', image_url: ''}],
        isModalOpen: false,
        modalText: '',
    };
}

  componentDidMount() {

  }

  renderCard = () => {
    return (<View style={{ flex: 1 }}>
      <View style={[Styles.tbRow, styles.card]}>
        <View style={[Styles.tbCol, Styles.centerText, { width: '20%' }]}>
          <Image source={Images.userImage} style={styles.cardImage} resizeMode="contain" />
          <Text style={[Styles.font6, Styles.fontBold, Styles.textGray, Styles.centerText]}>17 January 2020</Text>
        </View>
        <View style={[Styles.tbCol, Styles.centerText, { width: '30%' }]}>
          <Text style={[Styles.font16, Styles.fontMedium, Styles.textPrimaryDark]}>Jone Doe</Text>
          <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>owe you</Text>
        </View>
        <View style={[Styles.tbCol, { width: '25%' }]}>
          <Text style={[Styles.font16, Styles.fontMedium, Styles.textGray, Styles.centerText]}>10,000</Text>
        </View>
        <View style={[Styles.tbCol, { width: '25%' }]}>

          <RoundButton2 onPress={() => {
            //this.props.navigation.closeDrawer();
          }} startColor="#2A395B" endColor="#080B12" label="Clear" fontSize={1.8} btnStyle={{ padding: 10 }} />

        </View>
      </View>
    </View>);
  }
  renderView = () => {
    return (
      <>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={this.state.listRecords}
        renderItem={({ item }) => this.renderCard()}
        keyExtractor={item => item.id.toString() + Math.random()}
        />
      </>
    );
  }
  render() {
    return (
      <ContainerFixScreen children={this.renderView()} />
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    height: 100,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  cardImage: {
    width: RFPercentage(8),
    height: RFPercentage(8),
    borderRadius: 8
  }
});