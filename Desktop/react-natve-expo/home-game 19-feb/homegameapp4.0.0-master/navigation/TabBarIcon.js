import React,{ useEffect, useState } from 'react';
import {
  Image,View, StyleSheet, Keyboard
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

export default function TabBarIcon(props) {
  const [centerMenu, setCenterMenu] = useState(styles.centerTab);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setCenterMenu(styles.centerTabHide)
  };

  const _keyboardDidHide = () => {
    setCenterMenu(styles.centerTab)
  };
  return (
    <View style={[(props.centerMenu) ? centerMenu : null]}>
    <Image
       source={props.focused ? props.active : props.inactive}
       resizeMode="contain"
       style={[(props.centerMenu) ? styles.centerIconHeight : styles.iconHeight]}
       />
       </View>
  );
}

const styles = StyleSheet.create({
  iconHeight:{
    height: RFPercentage(3.0)
  },
  centerIconHeight:{
    height: RFPercentage(8.0)
  },
  centerTab:{
    marginBottom: 30,
    borderRadius:50,
    width:RFPercentage(3.0),
    height:RFPercentage(3.0),
    justifyContent:'center',
    alignItems:'center',
    display:'flex',
    backgroundColor:'#080B12',
    shadowColor: "#366BB4",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  centerTabHide:{
    marginBottom: -50
  },
  activeTab: {
    marginBottom: 20,
    borderRadius:50,
    padding:5,
    width:60,
    height:60,
    justifyContent:'center',
    alignItems:'center',
    display:'flex',
    backgroundColor:'#080B12',
    shadowColor: "#366BB4",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  }
});

    {/* <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    /> */}