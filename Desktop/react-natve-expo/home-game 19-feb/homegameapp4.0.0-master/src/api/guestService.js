import { AsyncStorage  } from "react-native";
import axios from "react-native-axios";
import Global from '../../constants/Global';
import * as Device from 'expo-device';

export const postData = (api, data) => {
    return axios.post(Global.API_ENDPOINT+api, data,{
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
           // 'Authorization': `${token()}`
        }
    })
    .then(function (response) {
        return responseHandle(response.data)
    })
    .catch(function (error) {
        let msg = errorHandle(error)
        return {status: false, message: msg }
    })
}

const responseHandle = (response) => {
    return response   
}

const errorHandle = (error) => {
    
    let message = error.message;
    if(error.response.status === 400){
        if(error.response.data){
            var err_res = error.response.data;
            for (let [key, value] of Object.entries(err_res)) {
                return value.msg;
              }    
        }
    }else if(error.response){
        if(error.response.data){
            if(error.response.data.message){
                message = error.response.data.message;
            }else if(error.response.data.error_description){
                message = error.response.data.error_description;
            }    
        }
    }
    return message;
}
export const getData = (api) => {
    try {
        return  response = fetch(
            Global.API_ENDPOINT+api,
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
    var user = await AsyncStorage.getItem('user'+Global.LOCALSTORAGE);
    if(user && user != undefined && user != ''){
        return true;
    }else{
        return false;
    }
}

export const getLoggedInUser = async () => {
    var user = await AsyncStorage.getItem('user'+Global.LOCALSTORAGE);
    if(user && user != undefined && user != ''){
        return JSON.parse(user);
    }else{
        return false;
    }
}

export const getDeviceInfo = async () => {
    let device = {
        is_device: Device.isDevice,
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        modelId: Device.modelId,
        designName: Device.designName,
        productName: Device.productName,
        deviceYearClass: Device.deviceYearClass,
        totalMemory: Device.totalMemory,
        supportedCpuArchitectures: Device.supportedCpuArchitectures,
        osName: Device.osName,
        osVersion: Device.osVersion,
        osBuildId: Device.osBuildId,
        osInternalBuildId: Device.osInternalBuildId,
        deviceName: Device.deviceName,


    };
    return device;
    
}
