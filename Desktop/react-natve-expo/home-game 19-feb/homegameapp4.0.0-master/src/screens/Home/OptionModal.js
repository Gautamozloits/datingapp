import React, { useState } from 'react';
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
import { isValidNumber } from '../../api/service';

import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
const options = [
    { label: "Half Value", value: "half" },
    { label: "Full Value", value: "full" }
  ];

export function OptionModal(props) {
    
    const [gamevalue, setGamevalue] = useState('full');
    const [othervalue, setOthervalue] = useState('');
    const [showdown, setShowdown] = useState('');
    const [initialbuyin, setInitialbuyin] = useState('');
    const [blinds, setBlinds] = useState('');
    
    var isVisible = false;
    if (props.isVisible) {
        isVisible = props.isVisible
        if(props.options){
            if(!initialbuyin && props.options.initial_buy_in){
                setInitialbuyin(props.options.initial_buy_in)
                setShowdown(props.options.showdown)
                setGamevalue(props.options.game_value)
                setOthervalue(props.options.other_value)
                setBlinds(props.options.blinds)
            }
        }
    }
    
    /**
     * Close modal
     */
    function closeModal() {
        props.that.toggleOption()
    }
    const amount = [{ id: 1, amount: '20k' }, { id: 2, amount: '40k' }, { id: 3, amount: '30k' }, { id: 4, amount: '20k' }]
    
    /**
     * Save buyin and close modal
     */
    function saveOption(){
        if(checkValidForm()){
            let optionList = {game_value: gamevalue, other_value: othervalue, showdown: showdown,initial_buy_in: initialbuyin, blinds: blinds,is_filled:'Selected'};
            props.that.toggleOption(optionList)
        }
    }

    /**
     * Check is form valid
     */
    function checkValidForm(){
        if(!isValidNumber(initialbuyin)){
            ToastMessage('Please enter valid initial buy', 'error')
            return false;
        }else if(showdown && !isValidNumber(showdown)){
            ToastMessage('Please enter valid showdown', 'error')
            return false;
        }else if(blinds && !isValidNumber(blinds)){
            ToastMessage('Please enter valid small blinds', 'error')
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
                        <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Option</Text>
                        <TouchableOpacity
                            activeOpacity={Styles.touchOpacity}
                            style={Styles.closeBtn}
                            onPress={closeModal}
                        >
                            <Image source={Images.crossIcon} resizeMode="contain" style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.modalBody}>
                        <View style={[Styles.tbRow]}>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <Text style={[Styles.font16, Styles.fontRegular, Styles.textPrimaryDark]}>Game value</Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <View>
                                <SwitchSelector
                                height={normalize(28)}
                                style={{borderColor: '#77869E', borderWidth:1.2, borderRadius:25}}
                                textStyle={{fontFamily:'Medium'}}
                                selectedTextStyle={{fontFamily:'Medium'}}
                                fontSize={normalize(12)}
                                textColor={'#77869E'} //'#7a44cf'
                                selectedColor={'#FFFFFF'}
                                buttonColor={'#2A395B'}
                                borderColor={'#77869E'}
                                
                                options={options}
                                initial={(props.options.game_value === 'full' ? 1 : 0 )}
                                onPress={value => setGamevalue(value)}
                                />

                                </View>
                            </View>
                        </View>

                        <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                            <View style={[Styles.tbCol, { width: '50%', flexDirection:'row', justifyContent:'flex-start' }]}>
                                <Text style={Styles.required}>*</Text><Text style={[Styles.font16, Styles.fontRegular, Styles.textPrimaryDark]}>Initial Buy In</Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <TextInput refer='initialbuyin' placeholder="Chips" maxLength={6} onChangeText={text => setInitialbuyin(text)} defaultValue={props.options.initial_buy_in.toString()} returnKeyType='done' keyboardType={"numeric"} style={Styles.inputField} />
                            </View>
                        </View>

                        <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <Text style={[Styles.font16, Styles.fontRegular, Styles.textPrimaryDark]}>Showdown</Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <TextInput refer='showdown' placeholder="Enter amount" maxLength={7} onChangeText={text => setShowdown(text)} defaultValue={props.options.showdown.toString()} returnKeyType='done' keyboardType={"numeric"} style={Styles.inputField} />
                            </View>
                        </View>
                        
                        <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <Text style={[Styles.font16, Styles.fontRegular, Styles.textPrimaryDark]}>Small Blind</Text>
                            </View>
                            <View style={[Styles.tbCol, { width: '50%' }]}>
                                <TextInput refer='blinds' placeholder="Enter amount" maxLength={7} returnKeyType='done' keyboardType={"numeric"} onChangeText={text => setBlinds(text)} defaultValue={props.options.blinds}  style={Styles.inputField} />
                            </View>
                        </View>

                        <View style={[Styles.tbRow, { paddingTop: 50 }]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]}>
                                <SmallButton onPress={() => saveOption()} label="Done" fontSize={12} btnStyle={{ width: '30%' }} />
                            </View>
                        </View>
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
        height: normalize(380),
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalBody:{ 
        flex: 1, 
        padding: 15, 
        paddingTop: 20, 
        backgroundColor: '#FFF' 
    }
});