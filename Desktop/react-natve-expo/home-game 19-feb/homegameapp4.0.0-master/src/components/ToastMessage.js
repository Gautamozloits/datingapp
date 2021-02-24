import { showMessage, hideMessage } from "react-native-flash-message";

  
export function ToastMessage(message,type="success") {
  if(type === 'error'){
    type = 'danger'  
  }
  showMessage({
    message: message,
    //type: type,
    duration: 4000,
    position:'top',
    floating:'yes',
    animated: false,
    style:{
      backgroundColor:'#646560',
      borderRadius:25,
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      zIndex:-1
    },
    titleStyle:{
      color:'#FFFFFF'
    }
  });

  // if (Platform.OS == 'android') {
    //   ToastAndroid.show(message, ToastAndroid.LONG);
    // }else{
    //   NativeModules.LRDRCTSimpleToast.show(message, NativeModules.LRDRCTSimpleToast.LONG)
    // }

    //alert(message)
  //Toast.show(message, Toast.LONG)
  
}
  
