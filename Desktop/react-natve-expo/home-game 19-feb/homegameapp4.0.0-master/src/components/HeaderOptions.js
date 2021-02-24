import React,{ useState }  from 'react';
import {
  StyleSheet,
  Text, Image,
  TouchableOpacity, View, Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Platform } from 'react-native';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import { HeaderButton } from '../components/Buttons/Button'; 
import normalize from 'react-native-normalize';
import FilterDropdown from './FilterDropdown';
import { Feather } from "@expo/vector-icons";
import Global from '../../constants/Global';

export function HeaderBG(props) {
    return (
      <LinearGradient
              colors={['#2A395B', '#080B12']}
              style={Styles.headerHeight}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
          />
    );
  }

  export function HeaderLeft(props) {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <Image source={Images.menuIcon} style={Styles.headerImage} resizeMode="contain"/>
      </TouchableOpacity>
    );
  }

  export function HeaderCstmLeftBack(props) {
    return (
      <TouchableOpacity onPress={props.onPress} style={{paddingLeft:10}}>
        <Image source={Images.backArrow} style={Styles.headerImage} resizeMode="contain"/>
        </TouchableOpacity>
    );
  }

  export function HeaderLeftBack(props) {
    if(props.onPress){
      return (
        <TouchableOpacity onPress={props.onPress}>
          <Image source={Images.backArrow} style={[Styles.headerImage, {marginLeft:5}]} resizeMode="contain"/>
          </TouchableOpacity>
      );
    }else{
      return (
          <Image source={Images.backArrow} style={[Styles.headerImage, {marginLeft:10}]} resizeMode="contain"/>
      );
    }
    
  }

  export function HeaderRightNotification(props) {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <Image source={(props.unreadCount > 0) ? Images.notificationO : Images.notification} style={Styles.headerImage} resizeMode="contain"/>
      </TouchableOpacity>
    );
  }

  export function PaymentFilter(props) {
    const [Visible, setVisible] = useState(false);
    var isDropdownVisible = true;
    return (
      <View style={{marginRight: normalize(10), position:'relative'}}>
      <HeaderButton onPress={() => {
        setVisible(!Visible);
      }} image={Images.FilterIcon} label="Current Week" fontSize={10}/>
        {(Visible) ? <View style={Styles.pickerStyles}>
          <Text style={Styles.pickerOptions}>Current Date</Text>
          <Text style={Styles.pickerOptions}>Current Week</Text>
          <Text style={Styles.pickerOptions}>Current Month</Text>
          <Text style={Styles.pickerOptions}>Current Year</Text>
        </View>: null}
        
      </View>
    );
  }

  export function PerformanceFilter(props) {
    const [Visible, setVisible] = useState(false);
    var isDropdownVisible = true;
    return (
      <View style={{marginRight: normalize(10), position:'relative'}}>
        <FilterDropdown
        options={props.options}
        dropdownStyle={Styles.dropdown_filter}
        defaultIndex={1}
        onSelect={props.changeFilter}
        >
          
        </FilterDropdown>
      </View>
    );
  }

  export function PeriodFilter(props) {
    const [Visible, setVisible] = useState(false);
    var isDropdownVisible = true;
    return (
      <View style={{marginRight: normalize(10), position:'relative'}}>
        <FilterDropdown
        options={props.options}
        dropdownStyle={Styles.dropdown_filter}
        defaultValue={(props.defaultValue) ? props.defaultValue : 'Weekly'}
        defaultIndex={1}
        onSelect={props.changeFilter}
        >
          
        </FilterDropdown>
      </View>
    );
  }

  export function BankerFilter(props) {
    return (
      <View style={{flexDirection:'row',borderRadius: 15, overflow: 'hidden'}}>
        <HeaderButton onPress={props.leaveGame} startColor="#2A395B" endColor="#080B12" label="Leave Game" fontSize={10} btnStyle={{borderRadius:0}}/>
        <HeaderButton onPress={props.endGame} startColor="#EE5A55" endColor="#FF342D" label="End Game" fontSize={10} btnStyle={{borderRadius:0}}/>
      </View>
    );
  }

  export function NonBankerFilter(props) {
    return (
      <View style={{marginRight: normalize(10)}}>
        <HeaderButton onPress={props.leaveGame} startColor="#2A395B" endColor="#080B12" label="Leave Game" fontSize={10} />
      </View>
    );
  }

  export function ShareScore(props) {
    return (
      <View style={{marginRight: normalize(10)}}>
        <HeaderButton image={Images.shareSocreIcon} onPress={props.shareScore} startColor="#2A395B" endColor="#080B12" label="Share" fontSize={10} />
      </View>
    );
  }

  export function ClearButton(props) {
    return (
      <View style={{marginRight: normalize(10)}}>
        <HeaderButton onPress={props.onPress} startColor="#2A395B" endColor="#080B12" label="Clear All" fontSize={10} btnStyle={{paddingLeft:normalize(20), paddingRight:normalize(20)}}/>
      </View>
    );
  }

  export function FinishSettlement(props) {
    var startColor = '#2A395B';
    var endColor = '#080B12';
    if(!props.enabled){
      var startColor = '#DCDCDC';
      var endColor = '#808080';
    }
    return (
      <View style={{marginRight: normalize(10)}}>
        <HeaderButton btnStyle={{paddingLeft:normalize(20), paddingRight:normalize(20)}} onPress={(props.enabled) ? props.finishSettlement : null} startColor={startColor} endColor={endColor} label="Finish" fontSize={12} />
      </View>
    );
  }


  export function FinishPayout(props) {
    var startColor = '#2A395B';
    var endColor = '#080B12';
    if(!props.enabled){
      var startColor = '#F7F8F8';
      var endColor = '#00000029';
    }

    return (
      <View style={{marginRight: normalize(10), opacity:(props.enabled) ? 1 : 0.3}}>
        <HeaderButton btnStyle={{paddingLeft:normalize(20), paddingRight:normalize(20)}} onPress={(props.enabled) ? props.donePayoutDetails : null} startColor={startColor} endColor={endColor} label="Done" fontSize={12} />
      </View>
    );
  }

  export function HeaderOddsCalculator(props) {
    const { onPress } = props;
    return (
      <Feather
        name="user-plus"
        size={RFPercentage(3.2)}
        color={"white"}
        onPress={props.addPlayers}
        style={[{marginRight:RFPercentage(3)}]}
      />
    );
  }
