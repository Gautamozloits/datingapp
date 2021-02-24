import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import SwitchSelector from "react-native-switch-selector";
import { ToastMessage } from '../../components/ToastMessage';

import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton, HeaderButton, BorderButton, RoundButton2 } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
const { width, height } = Dimensions.get('window');
const options = [
    { label: "Half Value", value: "half" },
    { label: "Full Value", value: "full" }
  ];

export function CreateGroupModal(props) {
    
    const [gamevalue, setGamevalue] = useState('full');
    const [othervalue, setOthervalue] = useState('');
    const [showdown, setShowdown] = useState('');
    const [initialbuyin, setInitialbuyin] = useState('');
    const [blinds, setBlinds] = useState('');
    
    var isVisible = false;
    if (props.isVisible) {
        isVisible = props.isVisible
    }

    function closeModal() {
        props.that.toggleCreateGroup()
    }
    const amount = [{ id: 1, amount: '20k' }, { id: 2, amount: '40k' }, { id: 3, amount: '30k' }, { id: 4, amount: '20k' }]
    
    function saveOption(){
        if(checkValidForm()){
            let optionList = {game_value: gamevalue, other_value: othervalue, showdown: showdown,initial_buy_in: initialbuyin, blinds: blinds,is_filled:'Selected'};
            props.that.toggleOption(optionList)
        }
            
        
        
    }
    function checkValidForm(){
        if(gamevalue === ''){
            ToastMessage('Please enter game value', 'error')
            return false;
        }else if(othervalue === ''){
            ToastMessage('Please enter other value', 'error')
            return false;
        }else if(showdown === ''){
            ToastMessage('Please enter showdown value', 'error')
            return false;
        }else if(initialbuyin === ''){
            ToastMessage('Please enter initial buy in value', 'error')
            return false;
        }else if(blinds === ''){
            ToastMessage('Please enter blinds value', 'error')
            return false;
        }
        return true;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}>
            <View style={[styles.modalBackground]}>
                <View style={styles.modalContent}>
                    <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                        <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Create Group</Text>
                        <TouchableOpacity
                            activeOpacity={Styles.touchOpacity}
                            style={Styles.closeBtn}
                            onPress={closeModal}
                        >
                            <Image source={Images.crossIcon} resizeMode="contain" style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.modalBody}>
                        
                    </View>
                </View>



            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        //padding: 20,
        backgroundColor: '#00000090',
        alignItems:'center',
        justifyContent:'center'
    },
    modalHeader:{ 
        width: '100%', 
        paddingLeft: 15, 
        paddingRight: 15, 
        paddingTop: 10, 
        paddingBottom: 10, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    modalContent:{
        height: height/1.8,
        width: '90%',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden'
    },
    modalBody:{ 
        flex: 1, 
        padding: 15, 
        paddingTop: 20, 
        backgroundColor: '#FFF' 
    }
});