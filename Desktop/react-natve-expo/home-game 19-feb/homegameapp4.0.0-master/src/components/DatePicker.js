import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { ToastMessage } from './ToastMessage';
import Styles from '../styles/Styles';
import normalize from 'react-native-normalize';
import Color from '../styles/Color';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IconButton } from './Buttons/Button';

export function DatePicker(props) {

    const [isDateShow, setDateShow] = useState(false)
    const [textValue, setTextValue] = useState("")
    const { iconLeftName, iconColorLeft = "#2A395B", iconLeftSize = 24, iconLeftStyle, onLeftIconPress,
        iconRightName, iconColorRight = "#2A395B", iconRightSize = 24, iconRightStyle, onRightIconPress,
        dateStyle, maximumDate, minimumDate = new Date(Date.now() + (10 * 60 * 1000)), display, minuteInterval,
        onChange, textColor, locale, neutralButtonLabel, is24Hour = true, that, StyleText, styleView, isDarkModeEnabled = false, date_key = 'date', default_date } = props;

    useEffect(() => {
        if (default_date && default_date != '' && textValue == "") {
            setTextValue(default_date)
        }
    })

    async function onDateChangeIos(date) {
        if (date != undefined) {
            date = moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY hh:mm A')
            setDateShow(false)
            if (moment(date, 'DD-MM-YYYY hh:mm A').format('X') < moment().add(10, 'minutes').format('X')) {
                ToastMessage('Please select date time greater then 10 minutes from now.', 'error');
            } else {
                setTimeout(() => {
                    setTextValue(date)
                    that.setState({ [date_key]: moment(date, 'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A') });
                }, 50);
            }
        } else {
            await setDateShow(false)
            // setTextValue(moment().add(10, 'minutes').format('DD-MM-YYYY hh:mm A'))
        }
    }

    return (
        <>
            <TouchableOpacity activeOpacity={1} style={[s.input, styleView, { justifyContent: 'center', position: 'relative' }]} onPress={() => { setDateShow(true); }}>
                {iconLeftName &&
                    <Image source={iconLeftName} style={[s.icon]} resizeMode="contain" />}
                {props.required ? <Text style={{ color: '#FF0000', position: 'absolute', marginLeft: normalize(29) }}>*</Text> : null}<Text
                    style={[Styles.fontRegular, Styles.font14, StyleText, { marginLeft: normalize(35), color: '#77869E' }]}
                >{(default_date && default_date != '') ? default_date : (textValue && textValue != '') ? textValue : 'Select Date'}</Text>
                {iconRightName &&
                    <Image source={iconRightName} style={[s.icon]} resizeMode="contain" />}
            </TouchableOpacity>
            {(!props.required && textValue != '') ? <View style={{position:'absolute', right:0, top: '30%'}}>
                <IconButton style={{padding:5}} onPress={() => {that.setState({[date_key]: ''}); 
                setTextValue("")
                console.log('------',that.state[date_key])
                }} type="FontAwesome5" name="times" fontSize={18}/>
            </View> : null }
            <DateTimePickerModal
                isVisible={isDateShow}
                mode="datetime"
                date={new Date()}
                onConfirm={(date) => onDateChangeIos(date)}
                onCancel={() => setDateShow(false)}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                isDarkModeEnabled={false}
                headerTextIOS={"Pick date & time"}
            />
        </>
    );

}

const s = StyleSheet.create({
    icon: {
        height: normalize(18),
        width: normalize(18),
        position: 'absolute',
    },
    input: {
        width: "100%",
        height: normalize(50),
        borderColor: 'transparent',
        borderBottomColor: '#DFE7F5',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        borderWidth: 1,
        color: Color.PRIMARY_DARK,
        borderRadius: 0,
    },
});
