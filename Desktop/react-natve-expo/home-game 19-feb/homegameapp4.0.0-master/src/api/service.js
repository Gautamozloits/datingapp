import React from 'react';
import { AsyncStorage, Alert, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { ToastMessage } from '../components/ToastMessage';
import moment from "moment";

import axios from "react-native-axios";
import Global from '../../constants/Global';
import Images from '../../constants/Images';
import { allCountry } from '../../AllCountry';

export const checkConnectivity = () => {
    return NetInfo.fetch().then(state => {
        if (state.isConnected) {
            console.log('here....')
            return true;
        } else {
            ToastMessage('No Internet Connection.')
            return false;
        }
    })
}

export const postData = async (api, data) => {
    let check = await checkConnectivity();
    if (check) {
        var access_token = await token();
        
        return axios.post(Global.API_ENDPOINT + api, data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `${access_token}`
            }
            
        })
            .then(function (response) {
                return responseHandle(response.data)
            })
            .catch(function (error) {
                let msg = errorHandle(error)
                return { status: false, message: msg }
            })
    } else {
        return { status: false, message: 'No Internet Connection.' }
    }

}

export const isUsernameExist = async (data) => {
    let check = await checkConnectivity();
    if (check) {
        var access_token = await token();
        
        return axios.post(Global.API_ENDPOINT + 'check-username', data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `${access_token}`
            }
            
        })
            .then(function (response) {
                //console.log('response.data: ',JSON.stringify(response.data))
                if(response.data.status){
                    return response.data.data;
                }else{
                    return false;
                }
                
            })
            .catch(function (error) {
                let msg = errorHandle(error)
                return false
            })
    } else {
        return false;
    }

}


export const getData = async (api) => {
    let check = await checkConnectivity();
    if (check) {
        var access_token = await token();
        return axios.get(Global.API_ENDPOINT + api, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `${access_token}`
            }
        })
            .then(function (response) {
                return responseHandle(response.data)
            })
            .catch(function (error) {
                let msg = errorHandle(error)
                return { status: false, message: msg }
            })
    } else {
        return { status: false, message: 'No Internet Connection.' }
    }
}


const responseHandle = (response) => {
    return response
}

const errorHandle = (error) => {
    let message = error.message;
    if (error.response.status === 400) {
        if (error.response.data) {
            if (error.response.data.message) {
                return error.response.data.message;
            } else {
                var err_res = error.response.data;
                for (let [key, value] of Object.entries(err_res)) {
                    return value.msg;
                }
            }

        }
    } else if (error.response) {
        if (error.response.data) {
            if (error.response.data.message) {
                message = error.response.data.message;
            } else if (error.response.data.error_description) {
                message = error.response.data.error_description;
            }
        }
    }
    return message;
}
export const getDatadd = async (api) => {
    var access_token = await token();
    try {
        return response = fetch(
            Global.API_ENDPOINT + api,
            {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                return error;
            });
    } catch (errors) {
        return errors;
    }

}

export const isLoggedIn = async () => {
    var user = await AsyncStorage.getItem('user' + Global.LOCALSTORAGE);
    if (user && user != undefined && user != '') {
        return true;
    } else {
        return false;
    }
}

export const checkValidUser = async () => {
    let check = await checkConnectivity();
    if (check) {
        var access_token = await token();
        return axios.get(Global.API_ENDPOINT + 'check-valid-user', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `${access_token}`
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    return true;
                } else if (response.data.status) {
                    return false;
                }
            })
            .catch(function (error) {
                let msg = errorHandle(error)
                return false
            })
    } else {
        return { status: false, message: 'No Internet Connection.' }
    }
}


export const isValidNumber = (e) => {
    if ((e && e !== '') || e >= 0) {
        if (/^\d+$/.test(e.toString())) {
            return true;
        }
    }
    return false;
}

export const isValidNumberWithZero = (e) => {
    if ((e && e !== '') || e >= 0) {
        if (/^\d+$/.test(e.toString())) {
            return true;
        }
    }
    return false;
}

export const isValidPhoneNumber = (e) => {
    if ((e && e !== '') || e >= 0) {
        if (/^\d+$/.test(e.toString())) {
            if (e.length >= 10 && e.length <= 12) {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}

export const isInvalidUsername = (e) => {
    if ((e && e !== '') || e >= 0) {
        if (/^([a-zA-Z0-9-_]+)$/.test(e.toString())) {
            if (e.length >= 6 && e.length <= 20) {
                return false;
            } else {
                return 'The username field length must be greater than 5.';
            }
        }else{
            return 'The username can contain any letters from a to z, any numbers from 0 through 9, - (hyphen or dash) _ (underscore)';
        }
    }else{
        return 'The username field length must be greater than 5.';
    }
}


export const getSumofNumber = (arr, key) => {
    if (arr && arr.length > 0) {
        let total_amount = 0
        arr.map((value) => {
            let amount = (value[key] && value[key] !== '') ? value[key] : 0;
            total_amount = parseFloat(total_amount) + parseFloat(amount)

        })
        return total_amount;
    } else {
        return 0;
    }

}

export const getTotalUserOnSignleDate = (arr, date_type) => {
    var date_response_key = 'date_1_response';
    if (date_type == 'date_2') {
        date_response_key = 'date_2_response';
    } else if (date_type == 'date_3') {
        date_response_key = 'date_3_response';
    }
    var count = 0;
    arr.map((value) => {
        if (value[date_response_key] && value[date_response_key] != '' && value[date_response_key] == 'accepted') {
            count++;
        }
    })
    return count;
}

export const getTotalUserByType = (arr, type = '') => {
    var count = 0;
    arr.map((value) => {
        if (value.result === type) {
            count++;
        }
    })
    return count;
}

export const getTotalLooserPaid = (arr) => {
    var count = 0;
    arr.map((value) => {
        if (value.result === 'Loser' && value.paid_amount) {
            count++;
        }
    })
    return count;
}


export const getTotalValidUsers = (arr, type = '') => {
    var count = 0;
    arr.map((value) => {
        if (!value.is_deleted) {
            count++;
        }
    })
    return count;
}

export const searchAddress = (keyword) => {
    //let add = `[{"formatted_address":"154, Near bhawarkuwa Sq, Vishnupuri Nx Colony, Khatiwala Tank, Indore, Madhya Pradesh 452001, India","geometry":{"location":{"lat":22.6991959,"lng":75.864032},"viewport":{"northeast":{"lat":22.70055882989272,"lng":75.86541287989272},"southwest":{"lat":22.69785917010728,"lng":75.86271322010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png","id":"1e2183f579da8fdccf8e45150242f30ac95dc660","name":"SI Arts Studio","place_id":"ChIJVW0Flrz9YjkRv7owyqGWQxw","plus_code":{"compound_code":"MVX7+MJ Indore, Madhya Pradesh","global_code":"7JJQMVX7+MJ"},"rating":0,"reference":"ChIJVW0Flrz9YjkRv7owyqGWQxw","types":["point_of_interest","establishment"],"user_ratings_total":0},{"formatted_address":"154 Vishnupuri, NX, Indore, Madhya Pradesh 452001, India","geometry":{"location":{"lat":22.6949078,"lng":75.8664891},"viewport":{"northeast":{"lat":22.69625222989272,"lng":75.86782557989272},"southwest":{"lat":22.69355257010728,"lng":75.86512592010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png","id":"3de21be70f8ef251e6c582fa9fd804a643d8903e","name":"SI Arts","place_id":"ChIJnbN-n-T8YjkRNDeM-ANbGU4","plus_code":{"compound_code":"MVV8+XH Indore, Madhya Pradesh","global_code":"7JJQMVV8+XH"},"rating":0,"reference":"ChIJnbN-n-T8YjkRNDeM-ANbGU4","types":["point_of_interest","establishment"],"user_ratings_total":0}]`;
    //let arr = JSON.parse(add);
    return { status: true, results: [] }

    var controller = new AbortController();
    //AIzaSyCgIPYU9GtPM19k7q1RdlVA_eTGuKFLAGY
    let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + encodeURI(keyword) + '&location=22.67777%2C75.8777&radius=10000&key=AIzaSyD1GBjrvhUQNDeb2QLgAWE-_s_hqnllaxo';
    //let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+encodeURI(keyword)+'&key=AIzaSyD1GBjrvhUQNDeb2QLgAWE-_s_hqnllaxo';


    return fetch(url, {
        signal: controller.signal
    })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'OK') {
                return { status: true, results: response.results }
            } else {
                if (response.error_message) {
                    return { status: false, message: response.error_message }
                } else if (response.message) {
                    return { status: false, message: response.message }
                } else {
                    return { status: false, message: "Something went wrong" }
                }

            }
        })
        .catch(e => console.log(e.message));
    controller.abort()


    /*var api = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+encodeURI(keyword)+'&location=22.67777%2C75.8777&radius=10000&key=AIzaSyCgIPYU9GtPM19k7q1RdlVA_eTGuKFLAGY'

    return axios.get(api,{
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            //'Authorization': `${access_token}`
        }
    })
    .then(function (response) {
        //console.log(response.data);
        if(response.data.status === 'OK'){
            return response.data.results;
        }
        
    })
    .catch(function (error) {
        let msg = errorHandle(error)
        return {status: false, message: msg }
    })*/



}



export const postWithFile = async (api, data) => {
    var access_token = await token();
    try {

        return fetch(
            Global.API_ENDPOINT + api,
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    'Content-Type': 'multipart/form-data',
                    'Authorization': access_token
                },
                body: data
            }
        ).then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                return error;
            });
    } catch (errors) {
        return errors;
    }

}

function kFormatter(n) {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";

    //return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}
function getUserDetail() {

    return AsyncStorage.getItem('user' + Global.LOCALSTORAGE)
        .then((value) => {
            try {
                return (JSON.parse(value))
            } catch (err) {
            }
        })
}
export const getUserDetail2 = () => {

    return AsyncStorage.getItem('user' + Global.LOCALSTORAGE)
}
export const updateLoggedInUser = async () => {

    postData('get-profile', {}).then(async (res) => {
        if (res.status) {
            let access_token = await token();
            let user = res.data;
            user.token = access_token;
            await AsyncStorage.setItem('user' + Global.LOCALSTORAGE, JSON.stringify(user));
        }
    })
}


export const getLoggedInUser = async () => {
    var user = await AsyncStorage.getItem('user' + Global.LOCALSTORAGE);
    if (user && user != undefined && user != '') {
        return JSON.parse(user);
    } else {
        return false;
    }
}

export const token = async () => {
    var user = await AsyncStorage.getItem('user' + Global.LOCALSTORAGE);
    if (user && user != undefined && user != '') {
        user = JSON.parse(user);
        return user.token;
    } else {
        return '';
    }
}

export const updateUser = async (type, data) => {
    var user = await AsyncStorage.getItem('user' + Global.LOCALSTORAGE);
    if (user && user != undefined && user != '') {
        user = JSON.parse(user);

        if (type == 'create_password') {
            user.is_first_time_login = false;
        } else if (type == 'current_plan') {
            user.current_plan = data;
        }
        await AsyncStorage.setItem('user' + Global.LOCALSTORAGE, JSON.stringify(user));
        return true;
    } else {
        return false;
    }
}

export const isValidName = (string) => {
    if (/^[a-z][a-z\s]*$/i.test(string) && string != '') {
        return true;
    } else {
        return false;
    }
}



export const seatStatus = (seat_status_label) => {
    if (seat_status_label == 'Confirmed') {
        return 'C';
    } else if (seat_status_label == 'Waitlisted') {
        return 'WL';
    } else {
        return 'P';
    }

    /*let confirm_date_key = '';
    let waiting_no_key = ''
    if(confirm_date_type == 'date_1'){
        waiting_no_key = 'waiting_no_1';
        confirm_date_key = 'date_1_response';  
    }else if(confirm_date_type == 'date_2'){
        waiting_no_key = 'waiting_no_2';
        confirm_date_key = 'date_2_response';  
    }else if(confirm_date_type == 'date_3'){
        waiting_no_key = 'waiting_no_3';
        confirm_date_key = 'date_3_response';  
    }
    if(confirm_date_type && confirm_date_type != '' && item[confirm_date_key] == 'accepted' && item[waiting_no_key] > 0){
        return 'WL';
    }else if(confirm_date_type && confirm_date_type != '' && item[confirm_date_key] == 'accepted' && item[waiting_no_key] == 0){
        return 'C';
    }else if(confirm_date_type && confirm_date_type != '' && (!item[confirm_date_key] || item[confirm_date_key] == '' || item[confirm_date_key] == 'decline')){
        return 'P';
    }else if(!confirm_date_type || confirm_date_type == ''){
        return 'P';
    }*/
}
export const seatStatusLabel = (seat_status_label) => {
    if (seat_status_label == 'Confirmed') {
        return 'Confirmed';
    } else if (seat_status_label == 'Waitlisted') {
        return 'Waiting';
    } else {
        return 'Pending';
    }
    /*let confirm_date_key = '';
    let waiting_no_key = ''
    if(confirm_date_type == 'date_1'){
        waiting_no_key = 'waiting_no_1';
        confirm_date_key = 'date_1_response';  
    }else if(confirm_date_type == 'date_2'){
        waiting_no_key = 'waiting_no_2';
        confirm_date_key = 'date_2_response';  
    }else if(confirm_date_type == 'date_3'){
        waiting_no_key = 'waiting_no_3';
        confirm_date_key = 'date_3_response';  
    }
    if(confirm_date_type && confirm_date_type != '' && item[confirm_date_key] == 'accepted' && item[waiting_no_key] > 0){
        return 'Waiting';
    }else if(confirm_date_type && confirm_date_type != '' && item[confirm_date_key] == 'accepted' && item[waiting_no_key] == 0){
        return 'Confirmed';
    }else if(confirm_date_type && confirm_date_type != '' && (!item[confirm_date_key] || item[confirm_date_key] == '' || item[confirm_date_key] == 'decline')){
        return 'Pending';
    }else if(!confirm_date_type || confirm_date_type == ''){
        return 'Pending';
    }*/
}

export const convertDateTime = (date, format) => {
    let game_time = moment.utc(date).toDate();
    let game_time_local = moment(game_time).local().format(format)

    //let new_date = moment(date).local().format(format)
    return game_time_local;
}
export const convertLocalToUTC = (dt, dtFormat='YYYY-MM-DD HH:mm:ss') => {
    return moment(dt, dtFormat).utc().format('YYYY-MM-DD HH:mm:ss');
}

export const getCurrency = (code) => {
    let currencySymbol = Images.indianRupee;
    let index = allCountry.findIndex((value) => {
        console.log(value.callingCodes)
        return value.callingCodes.includes(code+'')
    })
    if(index > -1){
        if(allCountry[index].symbol[0].symbol){
            let symbol = allCountry[index].symbol[0].symbol;
            if(symbol === '₹'){
                currencySymbol = Images.indianRupee;
            }else if(symbol === '$'){
                currencySymbol = Images.dollar;
            }else if(symbol === '฿'){
                currencySymbol = Images.bhat;
            }else if(symbol === '£'){
                currencySymbol = Images.pound;
            }else if(symbol === '¥'){
                currencySymbol = Images.yen;
            }else if(symbol === '€'){
                currencySymbol = Images.euro;
            }
        }
    }
    return currencySymbol;
}

export const getCurrencyName = (code) => {
    let currencySymbol = 'rupee-sign';
    let index = allCountry.findIndex((value) => {
        console.log(value.callingCodes)
        return value.callingCodes.includes(code+'')
    })
    if(index > -1){
        if(allCountry[index].symbol[0].symbol){
            let symbol = allCountry[index].symbol[0].symbol;
            if(symbol === '₹'){
                currencySymbol = 'rupee-sign';
            }else if(symbol === '$'){
                currencySymbol = 'dollar-sign';
            }else if(symbol === '฿'){
                currencySymbol = 'dollar-sign';
            }else if(symbol === '£'){
                currencySymbol = 'pound-sign';
            }else if(symbol === '¥'){
                currencySymbol = 'yen-sign';
            }else if(symbol === '€'){
                currencySymbol = 'euro-sign';
            }
        }
    }
    return currencySymbol;
}

export const randNumber = (length) => {
    var a = Math.floor(100000 + Math.random() * 900000)
    a = a.toString().substring(0, length);

    let number =  parseInt(a);

    return number;
}
export { getUserDetail, kFormatter };