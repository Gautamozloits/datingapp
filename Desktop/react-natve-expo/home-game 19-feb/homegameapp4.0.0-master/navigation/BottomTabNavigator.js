import React from 'react';
import { Platform, Image, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { createBottomTabNavigator, BottomTabBar, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { LinearGradient } from 'expo-linear-gradient';

import SideMenu from '../src/sidebar/SideMenu';
import TabBarLabel from './TabBarLabel';
import TabBarIcon from './TabBarIcon';
import HomeScreen from '../src/screens/Home/HomeScreen';
import CreateGame from '../src/screens/Home/CreateGame';

import CreateScheduleGame from '../src/screens/ScheduleGame/CreateGame';
import GameSettings from '../src/screens/ScheduleGame/Settings';
import Invites from '../src/screens/Invites/Invites';

import EditGame from '../src/screens/Home/EditGame';
import AddUser from '../src/screens/Home/AddUser';

import Payment from '../src/screens/MyPayment/Payment';
import MyPerformance from '../src/screens/Performance/MyPerformance';
import MyGames from '../src/screens/MyGames/MyGames';
import GameDetails from '../src/screens/MyGames/GameDetails';
import GameResults from '../src/screens/GameResults/Results';
import DebtSettlement from '../src/screens/Settlement/DebtSettlement';
import Settlements from '../src/screens/Settlement/Settlements';
import CashSettlement from '../src/screens/Settlement/CashSettlement';
import BuyIN from '../src/screens/Banker/BuyIN';
import BuyINNonBanker from '../src/screens/Banker/BuyINNonBanker';
import PayoutDetails from '../src/screens/Banker/PayoutDetails';

import Settings from '../src/screens/Settings/Settings';
import Contactus from '../src/screens/Contactus/Contactus';
import Content from '../src/screens/Comman/Content';
import Sharescreen from '../src/screens/Contactus/Sharescreen';
import Notifications from '../src/screens/Notifications/Notifications';

import Profile from '../src/screens/Profile/Profile';
import EditProfile from '../src/screens/Profile/EditProfile';
import ChangePassword from '../src/screens/Profile/ChangePassword';
import MyAccount from '../src/screens/Profile/MyAccount';

import ActiveGame from '../src/screens/ActiveGame/ActiveGame';
import OddsCalc from '../src/screens/OddsCalculator/OddsCalc';

import Images from '../constants/Images';
import Global from '../constants/Global';
import { getUserDetail } from '../src/api/service';

import * as Analytics from 'expo-firebase-analytics';


const TabBarComponent = props => <BottomTabBar {...props} />;

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

class MyCustomHeaderBackImage extends React.Component {
  render() {
    return (
      <Image
        source={Images.lock}
        resizeMode="contain"
      />
    );
  }
}

class ActiveGameImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGameImage: Images.blackjack,
      user:{}
    }
  }
  componentDidMount = async () => {
    let user = await getUserDetail();
    this.setState({user: user})
    this.socket = Global.THIS_SOCKET;
    this.getActiveGame();
    //this.setEndGame();
  }
  getActiveGame = async () => {
    
    this.socket.emit("getActiveGame", { user_id: this.state.user.id }, (res) => {
      if (res.status) {
        if(res.data.length > 0){
          this.setState({activeGameImage: Images.activeGame})
          Global.ACTIVE_GAME_IMAGE = Images.activeGame;
        }
      }
    });
  }
  

  render() {
    return (
      <TabBarIcon
      centerMenu={true}
      //focused={focused}
      //inactive={this.state.activeGameImage}
      //active={this.state.activeGameImage}
      inactive={Global.ACTIVE_GAME_IMAGE}
      active={Global.ACTIVE_GAME_IMAGE}
    />
    );
  }
}


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    AddUser:AddUser,
    CreateGame:CreateGame,
    EditGame: EditGame,
    Payment: Payment,
    MyPerformance: MyPerformance,
    MyGames: MyGames,
    GameDetails: GameDetails,
    GameResults: GameResults,
    Settings: Settings,
    Contactus: Contactus,
    Content: Content,
    CreateScheduleGame: CreateScheduleGame,
    GameSettings: GameSettings,
    Invites: Invites,
    Notifications: Notifications,
    Sharescreen: Sharescreen,
    OddsCalc:OddsCalc,
  },
  { headerTitleAlign: 'center' },
  config
);

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  let routename = navigation.state.routes[navigation.state.routes.length-1].routeName;

  if ((routename === 'MyGames')|| (routename === 'OddsCalc') || (routename === 'GameResults') || (routename === 'Home') || (routename === 'MyPerformance') || (routename === 'Payment') || (routename === 'Invites') || (routename == 'Notifications' || (routename == 'Settings') || (routename == 'Content') || (routename == 'Contactus'))) {
    tabBarVisible = true;
  }else{
    tabBarVisible = false;
  }
  //Analytics.setDebugModeEnabled(true)
  Analytics.setCurrentScreen(routename,routename);
  return {
    tabBarLabel: ({ focused }) => <TabBarLabel title="Home" focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        inactive={Images.home}
        active={Images.home}
      />
    ),
    tabBarVisible,
  };
};


const ProfileStack = createStackNavigator(
  {
    Profile: Profile,
    EditProfile: EditProfile,
    MyAccount: MyAccount,
    ChangePassword: ChangePassword,
    
  },
  //{headerLayoutPreset: 'center'},
  //config
);

ProfileStack.navigationOptions = ({ navigation }) => {
  let routename = navigation.state.routes[navigation.state.routes.length-1].routeName;
  Analytics.setCurrentScreen(routename,routename);

  return {
    
    tabBarLabel: ({ focused }) => <TabBarLabel title="Profile" focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        inactive={Images.profile}
        active={Images.profile}
      />
    ),
  };

  
};

const ActiveGameStack = createStackNavigator(
  {
    ActiveGame: ActiveGame,
    Settlements:Settlements,
    DebtSettlement: DebtSettlement,
    CashSettlement: CashSettlement,
    BuyIN: BuyIN,
    BuyINNonBanker: BuyINNonBanker,
    PayoutDetails: PayoutDetails,
  },
  //{headerLayoutPreset: 'center'},
  //config
);

ActiveGameStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  let routename = navigation.state.routes[navigation.state.routes.length-1].routeName;
  Analytics.setCurrentScreen(routename,routename);
  
  if ((routename === 'AddNewUser')) {
    tabBarVisible = false;
  }else{
    tabBarVisible = true;
  }

  return {
    tabBarLabel: ({ focused }) => <TabBarLabel title="Active Game" focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <ActiveGameImage
      focused={focused}
    />
    ),
    tabBarVisible,
  };
};



const TabNavigatorConfig = {
  /* tabBarOptions: {
    style: {
      backgroundColor: 'transparent', 
      height: 70,
      width: '100%', 
      padding:0, margin:0, 
      borderTopWidth:0,
      elevation: 4,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginBottom: 0
    },
  },
  tabBarComponent: props => (
    <TabBarComponent {...props} style={{
      borderTopColor: '#000000', 
      backgroundColor:'#FFF',
      borderTopWidth: 1,
      height: RFPercentage(8),
      padding: 0, margin: 0,
      borderTopWidth: 0,
      elevation: 5,
      //borderTopLeftRadius: 20,
      //borderTopRightRadius: 20,
      marginBottom: 0
    }} />
  ), */
  tabBarComponent: props => {
		return (
			<View style={{
				position: 'absolute',
				left: 0,
				right: 0,
        bottom: 0,
			}}>
				<TabBarComponent {...props} />
			</View>
		)
	},
	tabBarOptions: {
    keyboardHidesTabBar: true,
		style: {
			borderTopWidth: 0,
			backgroundColor: '#FFF',
			borderTopRightRadius: 20,
			borderTopLeftRadius: 20,
			height: 55,
      paddingBottom: 0,
      
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,

      elevation: 9,
		}
	},
};

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  ActiveGameStack,
  ProfileStack
}, TabNavigatorConfig
);

//tabNavigator.path = '';

//export default tabNavigator;


const DrawerNavigation = createDrawerNavigator({
  Home: {
    screen: tabNavigator,
  },
  
}, {
  contentComponent: SideMenu,
  //drawerWidth: 300,
  //drawerHeight:400
});
export default DrawerNavigation; 