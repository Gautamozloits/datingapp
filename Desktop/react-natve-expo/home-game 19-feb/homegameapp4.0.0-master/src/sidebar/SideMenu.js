import PropTypes from 'prop-types';
import React, { Component } from 'react';
//import styles from './SideMenu.style';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { ScrollView, Text, View, Dimensions, StyleSheet, StatusBar, Platform, Image, TouchableOpacity, AsyncStorage, Alert, ImageBackground, Share } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

import { postData, getUserDetail } from '../api/service';
import Images from '../../constants/Images';
import { RoundButton2, SmallButton } from '../components/Buttons/Button';
import Styles from '../styles/Styles';
import Global from '../../constants/Global';
import normalize from 'react-native-normalize';

var top = 0;
if (Platform.OS == 'android') {
  top = StatusBar.currentHeight;
}

const { width, height } = Dimensions.get('window');
var screenHeight = height+top

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    setTimeout(() => {
      this.props.navigation.dispatch(navigateAction);
    }, 1)

  }
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: {},
      isViewReady: false,
      share_link:''
    };
  }
  componentDidMount = async () => {
    let user = await getUserDetail();
    
    this.setState({
      user: user,
      isViewReady: true,
    })
    this.getAppLinks();
  }

  getAppLinks = () => {
    let params = {};
    postData('getAppLinks', params).then(async (res) => {
        this.setState({share_link: res.share_link})
    })
  }

  shareLink = async () => {
    try {
      const result = await Share.share({
        message: this.state.share_link,
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

  logout = async () => {
    Alert.alert('Home Game', 'Are you sure want to logout?', [{
      text: 'Yes', onPress: async () => {
        await AsyncStorage.removeItem('user'+Global.LOCALSTORAGE);
        this.props.navigation.navigate('Login');
      }
    },
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    ], { cancelable: false });

  }

  render() {
    const { user } = this.state;
    if (!this.state.isViewReady) {
      return <View />;
    } else {
      return (
        <View style={styles.container}>
          <ImageBackground source={Images.splashBg} style={styles.sidebarBG} resizeMode="cover">
            <View style={{ flex: 1, width: '100%' }}>
              <View style={[styles.topSidebar]}>
                <View style={[Styles.tbRow]}>
                  <View style={[Styles.tbCol, { width: '20%' }]}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        this.props.navigation.navigate('Profile');
                      }}
                    >
                      <Image source={(user.image && user.image !== "") ? { uri: Global.ROOT_PATH + user.image } : Images.userImage} style={styles.photo} resizeMode="cover" />
                    </TouchableOpacity>
                  </View>
                  <View style={[Styles.tbCol, { width: '50%', paddingLeft: normalize(5) }]}>
                    <Text style={[Styles.textWhite, Styles.fontBold, Styles.font14, Styles.title]}>{user.name}</Text>
                    <Text style={[Styles.textWhite, Styles.fontRegular, Styles.font10]}>{user.email}</Text>
                    <Text style={[Styles.textWhite, Styles.fontRegular, Styles.font10]}>{user.username}</Text>
                  </View>
                  <View style={[Styles.tbCol, { width: '30%' }]}>
                    <SmallButton onPress={() => {
                      this.logout();
                    }} startColor="#2A395B" endColor="#080B12" label="Logout" fontSize={8} btnStyle={{ width: '100%' }} />
                  </View>
                </View>

              </View>
              <ScrollView style={[styles.middleSidebar]}>
                <View style={styles.menu}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('Invites')}
                  >
                    <Image source={Images.invite} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>My Invites</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('MyGames')}
                  >
                    <Image source={Images.gamesIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>My Games</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('MyPerformance')}
                  >
                    <Image source={Images.activityIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>My Performance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('Payment')}
                  >
                    <Image source={Images.cardIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>My Payments</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                  //onPress={this.navigateToScreen('GameResults')}
                  >
                    <Image source={Images.clockIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>Schedule Game</Text>
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('Settings')}
                  >
                    <Image source={Images.settingsIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>Settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={() => this.shareLink()}
                  >
                    <Image source={Images.shareIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('Contactus')}
                  >
                    <Image source={Images.contactIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>Contact us</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    activeOpacity={0.7}
                    onPress={this.navigateToScreen('Content', {type:'manual'})}
                  >
                    <Image source={Images.helpIcon} resizeMode="contain" style={styles.menuIcon} /><Text style={[styles.menuText, Styles.textWhite, Styles.font14, Styles.fontMedium]}>Help</Text>
                  </TouchableOpacity>

                </View>
              </ScrollView>



            </View>
          </ImageBackground>
        </View>
      );
    }

  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: screenHeight,
    backgroundColor: "#FFF",
    position: 'absolute',
    //top: top,
    left: 0,
    zIndex: 1
  },
  sidebarBG: {
    width: '100%',
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topSidebar: {
    height: RFPercentage(18),
    width: '100%',
    //flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    backgroundColor: '#1C2A48',
    alignItems: 'center'
  },
  middleSidebar: {
    width: '100%',
    height: 200
  },
  menu: {

  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 20,
    paddingTop: 20
  },
  menuIcon: {
    width: RFPercentage(3),
    height: RFPercentage(3)
  },
  menuText: {
    paddingLeft: 20
  },



  navItemStyle: {
    padding: 10
  },
  navSectionStyle: {
    backgroundColor: '#FFF'
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    padding: 20,
    backgroundColor: '#FFF'
  },

  menuBox: {
    height: 60
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 2,
    justifyContent: 'center',
    height: 50,
    width: 200,
  },
  container_left: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 5,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  iconContainer: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    height: normalize(45),
    width: normalize(45),
    borderRadius: 50,
  },
  icon: {
    height: 18
  },
})