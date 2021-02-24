import React from 'react';
import {
  View, StyleSheet,
  ActivityIndicator,
  Modal, Text
} from 'react-native';
import normalize from 'react-native-normalize';
import Styles from '../styles/Styles';

export const NoData = () => {
    return (
        <View style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
          <ActivityIndicator style={{alignSelf:'center'}} size="large" color='#000' />
      </View>
    );
}


export const LoaderFooter = (props) => {
  if(props.visible){
    return (
      <View style={{height:100, width:'100%', textAlign:'center', justifyContent:'center'}}>
        <Text style={[Styles.fontRegular, Styles.font18, {color: '#042C5C', textAlign:'center'}]}>Loading content...</Text>
      </View>
    );
  }else{
    return null;
  }  
  
}

export const NoRecord = (props) => {
  if(props.visible){
    let styles = {height:100, width:'100%', backgroundColor:'#FFF', textAlign:'center', justifyContent:'center'}
    if(props.style){
      styles = {...props.style, ...styles};
    }
    return (
      <View style={styles}><Text style={{textAlign:'center', fontSize:18}}>{(props.message) ? props.message : 'No Record Found'}</Text></View>
    );
  }else{
    return null;
  }  
  
}

export const EmptyRecord = (props) => {
  if(props.visible){
    let styles = {height:normalize(70), width:'100%', backgroundColor:'#FFF', textAlign:'center', justifyContent:'center'}
    if(props.style){
      styles = {...props.style, ...styles};
    }
    return (
      <View style={styles}><Text style={[Styles.fontRegular,Styles.font14, {textAlign:'center'}]}>{props.message ? props.message : 'No Record Found'}</Text></View>
    );
  }else{
    return null;
  }  
  
}

export const NoMember = (props) => {
  if(props.visible){
    return (
      <View style={{height:100, width:'100%', borderRadius: 5, padding:50, backgroundColor:'#FFF', textAlign:'center', justifyContent:'center'}}><Text style={[Styles.font18, Styles.textBlue, Styles.fontMedium]}>Not a member yet? Join Now</Text></View>
    );
  }else{
    return null;
  }  
  
}

export const Loader = () => {
  const { loading } = true;  
  return (
      <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            color = '#042C5C'
            size = "large"
            animating={loading} />
            <Text style={[Styles.fontRegular, Styles.font16, {color: '#042C5C'}]}>Please wait...</Text>
        </View>
      </View>
    </Modal>
    );
}

export const LoaderIndicator = () => {
  const { loading } = true;  
  return (
      <View style={styles.centerLoader}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            color = '#042C5C'
            size = "large"
            animating={loading} />
            <Text style={[Styles.fontRegular, Styles.font16, {color: '#042C5C'}]}>Please wait...</Text>
        </View>
      </View>
    );
}


const styles = StyleSheet.create({
  centerLoader: {
    flex: 1,
    position:'absolute',
    height:'100%',
    width:'100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000040',
    zIndex:9
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});