/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
  Text,
  View,
  Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity, ScrollView, AsyncStorage
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { Header, useHeaderHeight } from 'react-navigation-stack';
import { CheckBox } from 'react-native-elements'

import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { SmallButton } from '../../components/Buttons/Button';
import ContainerFixScreen from '../Views/ContainerFixScreen';
import { HeaderBG, HeaderLeft } from '../../components/HeaderOptions';
import { postData, getUserDetail } from '../../api/service';
import { Loader } from '../../components/Loader'
import { ToastMessage } from '../../components/ToastMessage';
import Global from '../../../constants/Global';

const { width, height } = Dimensions.get('window');

export default class Settings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>Settings</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
    };
  };
  
  constructor(props) {
    super(props);
    this.state = {
      amount_format: '00',
      currency: 'doller',
      auto_assign_initial_buying: false,
      auto_assign_loss: false,
      saveBtn: 'Save',
      showIndicator: false,
    };
  }

  componentDidMount() {
    this.renderSettings()
  }

  renderSettings = async () => {
    var user = await getUserDetail();
    if (user) {
      this.setState({
        amount_format: user.amount_format,
        currency: user.currency,
        auto_assign_initial_buying: (user.auto_assign_initial_buying == 1) ? true : false,
        auto_assign_loss: (user.auto_assign_loss) ? true : false,
      })
    }
  }
  updateSetting = () => {
    let params = {
      amount_format: this.state.amount_format,
      currency: this.state.currency,
      auto_assign_initial_buying: (this.state.auto_assign_initial_buying) ? 1 : 0,
      auto_assign_loss: (this.state.auto_assign_loss) ? 1 : 0,
    };
    this.setState({ saveBtn: 'Saving...', showIndicator: true })
    postData('user/update-setting', params).then(async (res) => {
      this.setState({ saveBtn: 'Save', showIndicator: false })
      if (res.status) {
        await AsyncStorage.setItem('user' + Global.LOCALSTORAGE, JSON.stringify(res.data));
        ToastMessage(res.message)
      } else {
        ToastMessage(res.message, "error")
      }
    })
  }



  renderView = () => {
    const { amount_format, currency, auto_assign_initial_buying, auto_assign_loss, showIndicator } = this.state;
    return (
      <View style={styles.fixBox}>
        {showIndicator ? <Loader /> : null}
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', paddingLeft: 0, paddingRight: 0, paddingTop: 15, paddingBottom: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
              <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16, { paddingLeft: 20 }]}>Settings</Text>
            </LinearGradient>
            <View style={styles.innerSection}>
              <ScrollView style={[{ flex: 1 }]}>
                <View style={styles.content}>
                  {/* <View style={{ flex: 1 }}>
                    <View style={[styles.box]}>
                      <View style={styles.boxContent}>
                        <Text style={[Styles.font16, Styles.textPrimaryDark, Styles.fontMedium]}>Enter Amount In</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='00'
                            textStyle={Styles.checkBoxText}
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({amount_format: '00'})}
                            checked={(amount_format == '00') ? true : false}

                          />
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='000'
                            textStyle={Styles.checkBoxText}
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({amount_format: '000'})}
                            checked={(amount_format == '000') ? true : false}
                          />
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='0000'
                            textStyle={Styles.checkBoxText}
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({amount_format: '0000'})}
                            checked={(amount_format == '0000') ? true : false}
                          />

                        </View>
                      </View>
                    </View>
                    <Image source={Images.bottomBorder} resizeMode="cover" style={Styles.bottomBorderImage} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.box]}>
                      <View style={styles.boxContent}>
                        <Text style={[Styles.font16, Styles.textPrimaryDark, Styles.fontMedium]}>Use Currency in</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='Dollar'
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            textStyle={Styles.checkBoxText}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({currency: 'doller'})}
                            checked={(currency == 'doller') ? true : false}
                          />
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='Rupees'
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            textStyle={Styles.checkBoxText}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({currency: 'rupees'})}
                            checked={(currency == 'rupees') ? true : false}
                          />

                        </View>
                      </View>
                    </View>
                    <Image source={Images.bottomBorder} resizeMode="cover" style={Styles.bottomBorderImage} />
                  </View> */}

                  <View style={{ flex: 1 }}>
                    <View style={[styles.box]}>
                      <View style={styles.boxContent}>
                        <View style={{ flexDirection: 'row' }}>
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='Automatically assign Initial BuyIn to every player'
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            textStyle={Styles.checkBoxText}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({ auto_assign_initial_buying: !this.state.auto_assign_initial_buying })}
                            checked={auto_assign_initial_buying}
                          />

                        </View>
                      </View>
                    </View>
                    <Image source={Images.bottomBorder} resizeMode="cover" style={Styles.bottomBorderImage} />
                  </View>

                  {/* <View style={{ flex: 1 }}>
                    <View style={[styles.box]}>
                      <View style={styles.boxContent}>

                        <View style={{ flexDirection: 'row' }}>
                          <CheckBox
                            containerStyle={styles.checkBoxContainer}
                            title='Automatically assign the payment when the loss is less than the showdown'
                            checkedIcon={<Image source={Images.checkActive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            textStyle={Styles.checkBoxText}
                            uncheckedIcon={<Image source={Images.checkInactive} resizeMode="contain" style={Styles.checkBoxImage} />}
                            onPress={() => this.setState({ auto_assign_loss: !this.state.auto_assign_loss })}
                            checked={auto_assign_loss}
                          />

                        </View>
                      </View>
                    </View>
                  </View> */}

                  

                </View>
              </ScrollView>
            </View>
            <View style={{ flex: 1, paddingBottom: 20 }}>
              <View style={[styles.box, { justifyContent: 'center' }]}>
                <SmallButton onPress={() => {
                  this.updateSetting()
                }} label={this.state.saveBtn} fontSize={12} btnStyle={{ width: '30%' }} />
              </View>
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
    //flex: 1,
    height: '70%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

  },
})