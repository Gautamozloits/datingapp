import React from 'react';
import {
    Text, StyleSheet
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

import COLOR from '../src/styles/Color';

export default function TabBarLabel(props) {
  return (
    <Text style={[styles.tabBarLabel,  props.focused? styles.tabBarLabelActive : {}]} >{props.title}</Text>
  );
}

const styles = StyleSheet.create({
    tabBarLabel: {
      marginBottom:5,
      paddingBottom: 2,
      fontSize: RFPercentage(1.6),
      textAlign: 'center',
      color:COLOR.PRIMARY_LIGHT,
      fontFamily: 'Regular'
    },
    tabBarLabelActive: {
      marginBottom:5,
      paddingBottom: 2,
      fontSize: RFPercentage(1.6),
      textAlign: 'center',
      color: COLOR.PRIMARY_DARK,
      fontFamily: 'Bold',
    }
});
  