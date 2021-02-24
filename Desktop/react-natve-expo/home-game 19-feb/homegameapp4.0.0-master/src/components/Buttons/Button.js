import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity, Image, Switch, View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import normalize from 'react-native-normalize';
import { Ionicons, AntDesign, FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { exp } from 'react-native-reanimated';

export default function Button(props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}

    >
     
    </TouchableOpacity>
  );
}

export function RoundButton(props) {
  var fontSize = normalize(16);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  var textColor = "#FFFFFF"
  var btnStyle = {}
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  var width = '100%';
  
  if (props.btnStyle) {
    if (props.btnStyle.width) {
      width = props.btnStyle.width;
    }
    btnStyle = props.btnStyle;
  }
  

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[ {width: '100%', height: normalize(50),justifyContent:'center', alignItems: 'center', padding:normalize(5), borderRadius:normalize(10)}]}>
      <Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}


export function RoundButton2(props) {
  var fontSize = RFPercentage(3);
  if (props.fontSize) {
    fontSize = RFPercentage(props.fontSize);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  var textColor = "#FFFFFF"
  var btnStyle = {}
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  var width = '100%';
  
  if (props.btnStyle) {
    if (props.btnStyle.width) {
      width = props.btnStyle.width;
    }
    btnStyle = props.btnStyle;
  }
  

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[{width: '100%', alignItems: 'center', paddingLeft: 20, paddingRight:20, paddingTop:10, paddingBottom:10, borderRadius:15}]}>
      <Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}


export function HeaderButton(props) {
  var fontSize = normalize(3);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize+2);
  }
  var startColor = '#2A395B';
  var endColor = '#2A395B';
  var textColor = "#FFFFFF"

  var btnStyle = {width: '100%', alignItems: 'center', padding:normalize(8), borderRadius:15, flexDirection:'row'};
  
  if (props.btnStyle) {
    btnStyle = {...btnStyle, ...props.btnStyle};
  }

  
  
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  /* if (props.btnStyle) {
    if (props.btnStyle.width) {
      btnStyle.width = props.btnStyle.width;
    }
  } */
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={{zIndex:1}}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={btnStyle}>{props.image ? <Image source={props.image} resizeMode="contain" style={{height:RFPercentage(1.3)}} /> : null}<Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}

export function SmallButton(props) {
  var fontSize = normalize(10);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize+2);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  var textColor = "#FFFFFF"
  var btnStyle = {
    width: '100%', alignItems: 'center', padding:6, borderRadius: 15, flexDirection:'row',alignContent:'center', alignItems:'center', justifyContent:'center'
  }
  if(Platform.OS == 'ios'){
    btnStyle.borderRadius = 13
  }
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  var width = '100%';
  
  if (props.btnStyle) {
    if (props.btnStyle.padding) {
      btnStyle.padding = props.btnStyle.padding;
    }
    if (props.btnStyle.width) {
      btnStyle.width = props.btnStyle.width;
    }
    if (props.btnStyle.height) {
      btnStyle.height = props.btnStyle.height;
    }
    //btnStyle = props.btnStyle;
  }
  var disabled = false;
  if(props.disabled){
    disabled = props.disabled;
  }
  

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      disabled={disabled}
      style={[styles.shadowBtn, {alignItems:'center'}]}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.shadowBtn, btnStyle]}>{props.image ? <View style={{marginRight: normalize(5)}}><Image source={props.image} resizeMode="contain" style={{height:normalize(fontSize),width:normalize(fontSize)}} /></View> : null}<Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}

export function PrimaryButton(props) {
  var fontSize = normalize(10);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize+2);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  var textColor = "#FFFFFF"
  var btnStyle = {
    width: '100%', alignItems: 'center', padding:6, borderRadius: 15,alignContent:'center', alignItems:'center', justifyContent:'center'
  }
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  var width = '100%';
  
  if (props.btnStyle) {
    if (props.btnStyle.padding) {
      btnStyle.padding = props.btnStyle.padding;
    }
    if (props.btnStyle.width) {
      btnStyle.width = props.btnStyle.width;
    }
    if (props.btnStyle.height) {
      btnStyle.height = props.btnStyle.height;
    }
    //btnStyle = props.btnStyle;
  }
  var disabled = false;
  if(props.disabled){
    disabled = props.disabled;
  }
  

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      disabled={disabled}
      style={[styles.shadowBtn, {alignItems:'center'}]}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.shadowBtn, btnStyle]}>{props.image ? <View style={{marginRight: normalize(5)}}><Image source={props.image} resizeMode="contain" style={{height:normalize(fontSize),width:normalize(fontSize)}} /></View> : null}<Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}

export function BorderButton(props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={{borderWidth: 1, borderColor: '#DFE7F5', borderRadius: 19, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}}
    >
      <Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: normalize(12),
            color: '#77869E',
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      
        
    </TouchableOpacity>
  );
}

export function GroupButton(props) {
  var borderColor = '#DFE7F5';
  if(props.borderColor){
    borderColor = props.borderColor
  }
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={[{borderWidth: 1, borderColor: borderColor, borderRadius: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,position:'relative' }]}
    >
      <Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: normalize(12),
            color: '#77869E',
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
    </TouchableOpacity>
  );
}

export function GroupUserCount(props){
  return (
    <View style={[Styles.centerText ,{
      backgroundColor:'#FFF',
      borderColor:'#2A395B',
      borderRadius:50,
      borderWidth:1,
      width:normalize(16),
      height:normalize(16),
      position:'absolute',
      right:-5,
      top: -3
      }]}>
      <Text style={[Styles.fontMedium, Styles.textPrimaryDark,{
          backgroundColor: 'transparent',
          fontSize: normalize(12),
          textAlign: 'center',
          justifyContent:'center',
          alignContent:'center',
          alignItems:'center',
      }]}>
      {props.userCount}
      </Text>
  </View>
  )
}

export function GroupRemoveButton(props){
  return (
    <View style={[Styles.centerText ,{
      backgroundColor:'#FFF',
      position:'absolute',
      right:-5,
      top: -3
      }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.onPress}
      >
        
        <FontAwesome5
        name={'times-circle'}
        size={normalize(17)}
        color={'#2A395B'}
      />
      </TouchableOpacity>
  </View>
  )
}

export function SocialButton(props) {
  var fontSize = normalize(3);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  var textColor = "#FFFFFF"
  var btnStyle = {}
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  var width = '100%';
  
  if (props.btnStyle) {
    if (props.btnStyle.width) {
      width = props.btnStyle.width;
    }
    btnStyle = props.btnStyle;
  }
  

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[ {width: '100%',height:normalize(32),justifyContent:'center', alignItems: 'center', padding:normalize(5), borderRadius:normalize(6), flexDirection:'row'}]}>{props.image ? <Image source={props.image} resizeMode="contain" style={{height:fontSize}} /> : null}
      <Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}

export function SwitchExample(props) {
  var trueColor = '#DDE7F4';
  var falseColor = '#D8D8D8';
  var thumbColor = '#042C5C';
  if (props.trueColor) {
    trueColor = props.trueColor
  }
  if (props.falseColor) {
    falseColor = props.falseColor
  }
  if (props.thumbColor) {
    thumbColor = props.thumbColor
  }
  

  return (
        <Switch thumbColor={thumbColor}
        trackColor={{true: trueColor, false: falseColor}}
        // ios_backgroundColor={thumbColor}
        onValueChange = {props.toggleSwitch1}
        value = {props.switch1Value}/>
  )
}

export function SmallButton2(props) {
  var fontSize = normalize(10);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize+2);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  var textColor = "#FFFFFF"
  var btnStyle = {
    width: '100%', alignItems: 'center', padding:6, borderRadius: 15, flexDirection:'row',alignContent:'center', alignItems:'center', justifyContent:'center'
  }
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  var width = '100%';
  
  if (props.btnStyle) {
    if (props.btnStyle.padding) {
      btnStyle.padding = props.btnStyle.padding;
    }
    if (props.btnStyle.width) {
      btnStyle.width = props.btnStyle.width;
    }
    if (props.btnStyle.height) {
      btnStyle.height = props.btnStyle.height;
    }
    //btnStyle = props.btnStyle;
  }
  var disabled = false;
  if(props.disabled){
    disabled = props.disabled;
  }
  

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      disabled={disabled}
      style={[styles.shadowBtn, {}]}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.shadowBtn, btnStyle]}>{props.image ? <View style={{marginRight: normalize(5)}}><Image source={props.image} resizeMode="contain" style={{height:normalize(fontSize),width:normalize(fontSize)}} /></View> : null}<Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
            textAlign: 'center',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}

export function SwipeBtn(props) {
  var fontSize = RFPercentage(3);
  if (props.fontSize) {
    fontSize = RFPercentage(props.fontSize);
  }
  var startColor = '#2A395B';
  var endColor = '#080B12';
  if(props.disabled){
    var startColor = '#F7F8F8';
    var endColor = '#00000029';
  }
  var textColor = "#FFFFFF"

  var btnStyle = {width: '100%', alignItems: 'center', padding:8, borderRadius:15, alignItems:'center',flexDirection:'row', opacity:(props.disabled) ? 0.3 : 1};
  
  if (props.btnStyle) {
    btnStyle = {...btnStyle, ...props.btnStyle};
  }

  
  
  if (props.startColor) {
    startColor = props.startColor;
  }
  if (props.endColor) {
    endColor = props.endColor;
  }
  if (props.textColor) {
    textColor = props.textColor;
  }

  /* if (props.btnStyle) {
    if (props.btnStyle.width) {
      btnStyle.width = props.btnStyle.width;
    }
  } */

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.disabled ? null : props.onPress}
    >
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={btnStyle}>{props.image ? <Image source={props.image} resizeMode="contain" style={{height:RFPercentage(1.3), width:RFPercentage(1.3), marginRight:5}} /> : null}<Text
          style={[Styles.fontMedium, {
            backgroundColor: 'transparent',
            fontSize: fontSize,
            color: textColor,
          }]}>
          {props.label}
        </Text>
      </LinearGradient>
      
        
    </TouchableOpacity>
  );
}

/**
 * <IconButton onPress={() => function} name="pencil-alt" color="#FFFFFF" type="FontAwesome5" fontSize={20} />
 * @param {*} props 
 */
export function IconButton(props) {
  var fontSize = normalize(5);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize);
  }
  var style = {}
  if(props.style){
    style = props.style;
  }
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={[style]}
    >
     {getIcon(props)}
    </TouchableOpacity>
  );
}

export function TextButton(props) {
  var fontSize = normalize(5);
  if (props.fontSize) {
    fontSize = normalize(props.fontSize);
  }
  var style = {}
  if(props.style){
    style = props.style;
  }

  var textStyle = {...Styles.textWhite, ...Styles.fontMedium, ...Styles.font16}
  if (props.textStyle) {
    textStyle = {...textStyle, ...props.textStyle};
  }
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={[style]}
    >
     <Text style={textStyle}>{props.label}</Text>
    </TouchableOpacity>
  );
}

function getIcon(props){
  var fontSize = normalize(5);
  var color = '#2A395B';
  if (props.fontSize) {
    fontSize = normalize(props.fontSize);
  }
  if (props.color) {
    color = props.color;
  }

  if(props.type == 'AntDesign'){
    return (
      <AntDesign
      name={props.name}
      size={fontSize}
      color={color}
    />
  );
  }else if(props.type == 'FontAwesome5'){
    return (
      <FontAwesome5
      name={props.name}
      size={fontSize}
      color={color}
    />
  );
  }else if(props.type == 'Entypo'){
    return (
      <Entypo
      name={props.name}
      size={fontSize}
      color={color}
    />
  );
  }
  else{
    return (
        <FontAwesome
        name={props.name}
        size={fontSize}
        color={color}
      />
    );
  }
}
export function PlainIcon(props) {
  var fontSize = normalize(5);
  var color = '#2A395B';
  if (props.fontSize) {
    fontSize = normalize(props.fontSize);
  }
  if (props.color) {
    color = props.color;
  }
  
  if(props.type == 'AntDesign'){
    return (
      <AntDesign
      name={props.name}
      size={fontSize}
      color={color}
    />
  );
  }else if(props.type == 'FontAwesome5'){
    return (
      <FontAwesome5
      name={props.name}
      size={fontSize}
      color={color}
    />
  );
  }else if(props.type == 'Entypo'){
    return (
      <Entypo
      name={props.name}
      size={fontSize}
      color={color}
     
    />
  );
  }else if(props.type == 'Image'){
    return (
      <Image source={props.name} resizeMode="contain" style={{height:'100%', width:fontSize}} />  
  );
  }else{
    return (
        <FontAwesome
        name={props.name}
        size={fontSize}
        color={color}
      />
    );
  }
  
}

export function CircleButton(props) {
  var size = 80;
  if(props.size){
    size = props.size;
  }
  var styles = {height:normalize(size), width:normalize(size), tintColor: '#fff'}
  if(props.disabled){
    styles = {...styles, ...{tintColor: 'gray'}};
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <Image source={props.image} resizeMode="contain" style={styles} />  
    </TouchableOpacity>
  );
}

export function DragButton(props) {
  var size = 80;
  if(props.size){
    size = props.size;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <Image source={props.image} resizeMode="contain" style={{height:normalize(size), width:normalize(size)}} />  
    </TouchableOpacity>
  );
}

export function UserCircleButton(props) {
  var fontSize = normalize(12);
  var color = '#FFFFFF'
  if (props.size) {
    fontSize = normalize(props.size);
  }
  if (props.color) {
    color = props.color;
  }
  var btnStyle = {backgroundColor:'#042C5C', justifyContent:'center', borderRadius:50, width: normalize(30), height:normalize(30), alignItems:'center'};
  
  if (props.btnStyle) {
    btnStyle = {...btnStyle, ...props.btnStyle};
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={btnStyle}
    >
      
      <FontAwesome5
      name={props.icon}
      size={fontSize}
      color={color}
    />
    </TouchableOpacity>
  );
}


export function Checkbox(props) {
  var fontSize = normalize(20);
  var color = '#FFFFFF'
  if (props.size) {
    fontSize = normalize(props.size);
  }
  if (props.activeColor) {
    color = props.activeColor;
  }
  return (
    <TouchableOpacity
    activeOpacity={0.7}
    onPress={props.onPress}
    style={{justifyContent:'center', borderRadius:50, width: normalize(30), height:normalize(30), alignItems:'center'}}
  >
    
    <FontAwesome
    name={(props.checked) ? props.activeIcon : props.inactiveIcon}
    size={fontSize}
    color={(props.checked) ? props.activeColor : props.inactiveColor}
  />
  </TouchableOpacity>
  )
}

export function InputIcon(props) {
  return (
    <Image source={props.image} style={{width: normalize(18), height:normalize(18)}} resizeMode="contain"/>
  )
}


const styles = StyleSheet.create({
  shadowBtn:{
    width:'80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});