import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from "react-native";
import moment from "moment";
import Styles from '../styles/Styles';
import normalize from 'react-native-normalize';
import Color from '../styles/Color';
import { IconButton, CircleButton } from './Buttons/Button';
import Images from '../../constants/Images';

export function DateFilter(props) {

    const [weekNumber, setWeekNumber] = useState(moment().isoWeek());
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM-DD'));
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY-MM-DD'));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterLabel, setFilterLabel] = useState('');
    const [nextDate, setNextDate] = useState(false);

    const { mode } = props;

    useEffect(() => {
        if (mode == 'week') {
            
            let dates = getWeekDate(weekNumber);
            //console.log('*******',dates)
            setStartDate(dates.start_date);
            setEndDate(dates.end_date);
            getFilterLabel(dates);
            if (props.onChangeFilter) {
                props.onChangeFilter(dates)
            }
        }else if (mode == 'month') {
            let dates = getMonthDate(selectedMonth);
            setStartDate(dates.start_date);
            setEndDate(dates.end_date);
            getFilterLabel(dates);
            if (props.onChangeFilter) {
                props.onChangeFilter(dates)
            }
        }else if (mode == 'year') {
            let dates = getYearDate(selectedYear);
            setStartDate(dates.start_date);
            setEndDate(dates.end_date);
            getFilterLabel(dates);
            if (props.onChangeFilter) {
                props.onChangeFilter(dates)
            }
        }
    },[mode])

    function getFilterLabel(dates) {
       // console.log('dates: ',dates)
        let string = moment(dates.start_date + ' 00:00:00').format('DD') + ' to ' + moment(dates.end_date + ' 00:00:00').format('DD MMM YYYY');
        setFilterLabel(string)
    }

    function getWeekDate(week_no) {
        
        let start_date = moment().startOf('isoWeek').isoWeek(week_no).format('YYYY-MM-DD');
        let end_date = moment().endOf('isoWeek').isoWeek(week_no).format('YYYY-MM-DD');
        console.log('start_date: ',start_date,' -end_date:.........',end_date)
        return { start_date: start_date, end_date: end_date };
    }

    function getMonthDate(selectedMonth) {
        let start_date = moment(selectedMonth).startOf('month').format('YYYY-MM-DD');
        let end_date = moment(selectedMonth).endOf("month").format('YYYY-MM-DD');
        
        return { start_date: start_date, end_date: end_date };
    }

    function getYearDate(selectedYear) {
        let start_date = moment(selectedYear).startOf('year').format('YYYY-MM-DD');
        let end_date = moment(selectedYear).endOf("year").format('YYYY-MM-DD');
        
        return { start_date: start_date, end_date: end_date };
    }

    function backwordFilter() {
        var dates = {start_date: '', end_date: ''};
        if(mode == 'week'){
            let newWeek = weekNumber - 1;
            setWeekNumber(newWeek);
            dates = getWeekDate(newWeek);
            setNextDate(true);
        }else if(mode == 'month'){
            let newMonth = moment(selectedMonth).subtract(1, 'months').format('YYYY-MM-DD');

            setSelectedMonth(newMonth);
            dates = getMonthDate(newMonth)
            setNextDate(true);
        }else if(mode == 'year'){
            let newYear = moment(selectedYear).subtract(1, 'years').format('YYYY-MM-DD');
            setSelectedYear(newYear);
            dates = getYearDate(newYear)
            setNextDate(true);
        }
        setStartDate(dates.start_date);
        setEndDate(dates.end_date);
        getFilterLabel(dates);
        if (props.onChangeFilter) {
            props.onChangeFilter(dates)
        }
    }

    function forwordFilter() {
        var dates = {start_date: '', end_date: ''};
        var isValidDate = true;
        if(mode == 'week'){
            let newWeek = weekNumber + 1;
            let currentWeekNo = moment().format('W');
            if(newWeek <= currentWeekNo){
                setWeekNumber(newWeek);
                dates = getWeekDate(newWeek);
                if(newWeek == currentWeekNo){
                    setNextDate(false);
                }else{
                    setNextDate(true);
                }                
            }else{
                isValidDate = false;
                setNextDate(false);
            }            

        }else if(mode == 'month'){
            
            let newMonth = moment(selectedMonth).add(1, 'months').format('YYYY-MM-DD');
            let currentMonthNo = moment().format('YYYY-MM');
            let NewMonthNo = moment(selectedMonth).add(1, 'months').format('YYYY-MM')
            if(NewMonthNo <= currentMonthNo){
                setSelectedMonth(newMonth);
                dates = getMonthDate(newMonth)
                if(NewMonthNo == currentMonthNo){
                    setNextDate(false);
                }else{
                    setNextDate(true);
                }
                
            }else{
                isValidDate = false;
                setNextDate(false);
            }
            
        }else if(mode == 'year'){

            let newYear = moment(selectedYear).add(1, 'years').format('YYYY-MM-DD');
            let NewYearNo = moment(selectedYear).add(1, 'years').format('YYYY');
            let currentYearNo = moment().format('YYYY');
            if(NewYearNo <= currentYearNo){
                setSelectedYear(newYear);
                dates = getYearDate(newYear)
                if(NewYearNo == currentYearNo){
                    setNextDate(false);
                }else{
                    setNextDate(true);
                }
                
            }else{
                isValidDate = false;
                setNextDate(false);
            }

        }

        if(isValidDate){
            setStartDate(dates.start_date);
            setEndDate(dates.end_date);
            getFilterLabel(dates);
            if (props.onChangeFilter) {
                props.onChangeFilter(dates)
            }
        }
        
    }

    return (

        <View style={[Styles.centerText, { flex: 1, flexDirection: 'row', display: 'flex' }]}>
            <CircleButton size={20} onPress={() => backwordFilter('test')} image={Images.left_arrow} />
            <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16, { paddingLeft: 10, paddingRight: 10 }]}>{filterLabel}</Text>
            <CircleButton size={20} onPress={() => (nextDate) ? forwordFilter() : null} disabled={(nextDate) ? false : true } image={Images.right_arrow} />
        </View>
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
