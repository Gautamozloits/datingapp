import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity, Image, Switch, View, ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { LinearGradient } from 'expo-linear-gradient';
//import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import normalize from 'react-native-normalize';
import { Ionicons, AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import { TextInput } from 'react-native-paper';

var textPropTypes = Text.propTypes || ViewPropTypes
var textInputPropTypes = TextInput.propTypes || textPropTypes
var propTypes = {
  ...textInputPropTypes,
  inputStyle: textInputPropTypes.style,
  labelStyle: textPropTypes.style,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
}

var InputBox = createReactClass({
  propTypes: propTypes,

  getInitialState() {
    var state = {
      icon: this.props.icon,
      text: this.props.value,
      dirty: (this.props.value || this.props.placeholder),
    };

   

    return state
  },

  componentDidUpdate(props) {
    if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
      this.setState({ text: props.value})
     // this._animate(!!props.value)
    }
  },

  onChangeText(text) {
    this.setState({ text })
    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }
  },

  updateText(event) {
    var text = event.nativeEvent.text
    this.setState({ text })

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event)
    }
  },
  
  
  render() {
   
    var props = {
      ref: this.props.refer,
      maxLength: this.props.maxLength,
      name: this.props.name,
      autoCapitalize: this.props.autoCapitalize,
      autoCorrect: this.props.autoCorrect,
      autoFocus: this.props.autoFocus,
      bufferDelay: this.props.bufferDelay,
      clearButtonMode: this.props.clearButtonMode,
      clearTextOnFocus: this.props.clearTextOnFocus,
      controlled: this.props.controlled,
      editable: this.props.editable,
      enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
      keyboardType: this.props.keyboardType,
      defaultValue: this.props.defaultValue,
      multiline: this.props.multiline,
      numberOfLines: this.props.numberOfLines,
      onBlur: this._onBlur,
      onChange: this.props.onChange,
      onChangeText: this.onChangeText,
      onEndEditing: this.updateText,
      onFocus: this._onFocus,
      onSubmitEditing: this.props.onSubmitEditing,
      password: this.props.secureTextEntry || this.props.password, // Compatibility
      placeholder: this.props.placeholder,
      secureTextEntry: this.props.secureTextEntry || this.props.password, // Compatibility
      returnKeyType: this.props.returnKeyType,
      selectTextOnFocus: this.props.selectTextOnFocus,
      selectionState: this.props.selectionState,
      //style: [styles.input, styles.font18, this.props.style, { paddingLeft: this.props.icon ? normalize(30) : 10 }],
      testID: this.props.testID,
      value: this.state.text,
      underlineColorAndroid: this.props.underlineColorAndroid, // android TextInput will show the default bottom border
      onKeyPress: this.props.onKeyPress
    };
  return (
    <TextInput {...props}
     
      style={[{
          height:60,
          paddingLeft:-20,
          backgroundColor:'transparent', placeholderTextColor: 'red', color:'red'},Styles.font14, Styles.fontRegular]}
      label={this.props.label}
      //value={phone_number}
      theme={{ colors: { primary: "#042C5C", placeholder:'#77869E' }}}
      //onChangeText={text =>  this.setState({ phone_number: text })}
      left={<TextInput.Icon name="cellphone" style={{
          marginLeft:-15
      }} size={20} color={"#77869E"} onPress={() => {}} />}
      />
  );
}

});
var styles = StyleSheet.create({
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

module.exports = InputBox;