'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { FontAwesome } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import normalize from 'react-native-normalize';
import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Images, { settingsIcon } from '../../constants/Images';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Animated,
  Easing,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ViewPropTypes
} from 'react-native';
import COLOR from '../styles/Color';

var textPropTypes = Text.propTypes || ViewPropTypes
var textInputPropTypes = TextInput.propTypes || textPropTypes
var propTypes = {
  ...textInputPropTypes,
  inputStyle: textInputPropTypes.style,
  labelStyle: textPropTypes.style,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
}

var FloatingLabel = createReactClass({
  propTypes: propTypes,

  getInitialState() {
    var state = {
      icon: this.props.icon,
      text: this.props.value,
      dirty: (this.props.value || this.props.placeholder),
    };

    var style = state.dirty ? dirtyStyle : cleanStyle
    state.labelStyle = {
      fontSize: new Animated.Value(style.fontSize),
      top: new Animated.Value(style.top)
    }

    return state
  },

  componentDidUpdate(props) {
    if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
      this.setState({ text: props.value, dirty: !!props.value })
      this._animate(!!props.value)
    }
  },

  _animate(dirty) {
    var nextStyle = dirty ? dirtyStyle : cleanStyle
    var labelStyle = this.state.labelStyle
    var anims = Object.keys(nextStyle).map(prop => {
      return Animated.timing(
        labelStyle[prop],
        {
          toValue: nextStyle[prop],
          duration: 200,
          //useNativeDriver: false
        },
        Easing.ease
      )
    })

    Animated.parallel(anims).start()
  },

  _onFocus() {
    this._animate(true)
    this.setState({ dirty: true })
    if (this.props.onFocus) {
      this.props.onFocus(arguments);
    }
  },

  _onBlur() {
    if (!this.state.text) {
      this._animate(false)
      this.setState({ dirty: false });
    }

    if (this.props.onBlur) {
      this.props.onBlur(arguments);
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

  _renderLabel() {
    var requiredLabel = this.props.required ? <Text style={{ color: '#FF0000' }}>*</Text> : null;
    return (
      <Animated.Text
        ref='label'
        style={[this.state.labelStyle, styles.label, { paddingLeft: this.props.icon ? normalize(25) : normalize(10), marginLeft: 5 }, this.props.labelStyle]}
      >{requiredLabel}{this.props.children}
      </Animated.Text>
    )
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
      style: [styles.input, styles.font18, this.props.style, { paddingLeft: this.props.icon ? normalize(30) : 10 }],
      testID: this.props.testID,
      value: this.state.text,
      underlineColorAndroid: this.props.underlineColorAndroid, // android TextInput will show the default bottom border
      onKeyPress: this.props.onKeyPress
    },
      elementStyles = [styles.element];

    if (this.props.inputStyle) {
      props.style.push(this.props.inputStyle);
    }

    if (this.props.style) {
      elementStyles.push(this.props.style);
    }

    return (
      <View style={[elementStyles, { justifyContent: 'center', alignContent: 'center' }]}>
        {this.props.icon ? <Image source={this.props.icon} style={styles.icon} resizeMode="contain" /> : null}

        {this._renderLabel()}
        {this.props.other ?
          this.props.isDate ?
            <TouchableOpacity {...props}>

              {/* <Text {...props}></Text> */}
              
              <DatePicker
                //androidMode='spinner'
                style={[styles.dateInput,]}
                date={this.props.date}
                mode={this.props.mode}
                placeholder={this.props.placeholder}
                format={this.props.format}
                minDate={this.props.minDate}
                confirmBtnText={this.props.confirmBtnText}
                cancelBtnText={this.props.cancelBtnText}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                    width: 0, height: 0
                  },
                  dateInput: {
                    borderWidth: 0,
                    marginLeft: 1,
                    paddingLeft: 0,
                    alignItems: 'flex-start'
                  }
                }}
                onDateChange={this.props.onChangeText}
              />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={this.props.onPress} style={[styles.textBox, this.props.textStyle]}><Text numberOfLines={1} style={[styles.textStyle]}>{this.props.value}</Text>
            </TouchableOpacity>
          : <TextInput
            {...props}
          >
          </TextInput>}
        {this.props.leftIcon ? <TouchableOpacity onPress={this.props.onLeftPress} activeOpacity={0.4} style={{ position: 'absolute', zIndex: 9, marginRight: 0, alignSelf: 'flex-end' }}>
          <FontAwesome name={this.props.leftIcon} size={24} color="#2A395B" />
        </TouchableOpacity> : null}

      </View>
    );
  },
});

var labelStyleObj = {
  color: Color.PRIMARY_LIGHT,
  position: 'absolute',
}

if (Platform.OS === 'web') {
  labelStyleObj.pointerEvents = 'none'
}

var styles = StyleSheet.create({
  dateInput: { width: "100%" },
  textBox: {
    paddingLeft: normalize(30),
    borderBottomColor: '#DFE7F5',
    height: normalize(50),
    borderColor: 'transparent',
    //backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    borderWidth: 1,

    borderRadius: 0,
  },
  textStyle: {
    color: Color.PRIMARY_DARK,
  },
  icon: {
    height: normalize(18),
    width: normalize(18),
    position: 'absolute',
    //top: RFPercentage(0.9)
  },
  font18: {
    fontSize: normalize(18),
  },
  element: {
    position: 'relative',
  },
  input: {
    height: normalize(50),
    borderColor: 'transparent',
    borderBottomColor: '#A2A2A2',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    borderWidth: 1,
    color: Color.PRIMARY_DARK,
    borderRadius: 0,
    //paddingLeft: 30,

    // marginTop: 20,
  },
  label: labelStyleObj
})

var cleanStyle = {
  fontSize: normalize(20),
  top: normalize(20)
}

var dirtyStyle = {
  fontSize: normalize(18),
  top: -normalize(2),

}

module.exports = FloatingLabel;
