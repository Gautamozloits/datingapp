import React from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal, ScrollView
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import Styles from '../../styles/Styles';
import { PlainIcon, SwitchExample } from '../../components/Buttons/Button';
import Images from '../../../constants/Images';
import normalize from 'react-native-normalize';
const { width, height } = Dimensions.get('window');

export default class SettingModal extends React.PureComponent {


    constructor(props) {
        super(props);

        this.state = {
            saveBtn: 'Save',
            showIndicator: false,
            switch1Value: false,
            hidden_pols:false,
            open_invitation: true,
            date_selection: false,
            auto_confirm: false,
            quorum_user_count:8,
            isEditable: false
        };
    }

    componentDidMount = async () => {
        this.renderSettings(this.props.that.state.gameDetails)
    }
    renderSettings = async (settings) => {
        this.setState({
            hidden_pols: (settings.hidden_pols == 1) ? true : false,
            open_invitation: (settings.open_invitation == 1) ? true : false,
            date_selection: (settings.date_selection === 'single') ? true : false,
            auto_confirm: (settings.auto_confirm == 1) ? true : false,
            quorum_user_count: settings.quorum_user_count,
        })
    }
  
    closeModal() {
        //this.props.that.state.isAddPlayerModalVisible
        this.props.that.setState({ isSettingModalVisible: false, selectedGame:{} })
    }

    renderView = () => {
        const { quorum_user_count, showIndicator } = this.state;
        return (
            <>
                <View style={styles.content}>
                    <View style={{ flex: 5.5 }}>

                        <ScrollView style={[{ flex: 1 }]}>
                            <View style={styles.content}>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.cancelEye} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Hidden Poll</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#77869e'
                                                            falseColor='#e9ebee'
                                                            thumbColor='#77869e'
                                                            //toggleSwitch1={this.toggleSwitch1}
                                                            switch1Value={this.state.hidden_pols} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Player's name and votes are confidential, Only you can see the results</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.invitationIcon} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Open Invitation</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#1bc773'
                                                            falseColor='#b4ffd9'
                                                            thumbColor='#1bc773'
                                                            //toggleSwitch1={this.toggleSwitch2}
                                                            switch1Value={this.state.open_invitation} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Player can invite other players to the game</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.calander} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Limit One Date Selection</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#1bc773'
                                                            falseColor='#b4ffd9'
                                                            thumbColor='#1bc773'
                                                            //toggleSwitch1={this.toggleSwitch3}
                                                            switch1Value={this.state.date_selection} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Player's can select only one of the dates</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <PlainIcon type="Image" name={Images.arrowSquare} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>Automatically Confirm Game</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '20%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <SwitchExample
                                                            trueColor='#1bc773'
                                                            falseColor='#b4ffd9'
                                                            thumbColor='#1bc773'
                                                            //toggleSwitch1={this.toggleSwitch4}
                                                            switch1Value={this.state.auto_confirm} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Automatically confirm the game when the quorum is reached</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flex: 1 }}>
                                    <View style={[styles.box, Styles.borderBottom]}>
                                        <View style={styles.boxContent}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.tbCol, { width: '70%', justifyContent: 'flex-start' }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <PlainIcon type="Image" name={Images.twoUser} fontSize={20}/><Text style={[Styles.textPrimary, Styles.fontMedium, Styles.font16, { marginLeft: 5 }]}>No of Players For Full Quorum</Text>
                                                    </View>
                                                </View>
                                                <View style={[Styles.tbCol, { width: '30%', justifyContent: 'flex-end' }]}>
                                                    <View style={{ alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                        <View style={{flexDirection:'row'}}>
                                                            <TouchableOpacity 
                                                            //onPress={() => (quorum_user_count > 2) ? this.setState({quorum_user_count: parseInt(quorum_user_count)-1}) : null} 
                                                            style={{justifyContent:'center', backgroundColor:'#1bc773', padding:normalize(10), borderTopLeftRadius:15, borderBottomLeftRadius:15}}
                                                            >
                                                                <PlainIcon name="minus" fontSize={normalize(12)} color="#FFF" />
                                                            </TouchableOpacity>
                                                            <View style={[Styles.centerText, {width:normalize(25), backgroundColor:'#e9f9f1', width:normalize(30)}]}>
                                                                <TextInput
                                                                    editable={false}
                                                                    defaultValue={quorum_user_count}
                                                                    value={`${quorum_user_count}`}
                                                                    //onChangeText={(value) => this.setState({quorum_user_count: value})} 
                                                                    maxLength={3}
                                                                    keyboardType={"numeric"}
                                                                    style={[Styles.green, Styles.fontBold, Styles.font12, {width:'100%', textAlign:'center'}]}
                                                                    //style={[Styles.inputField]}
                                                                /> 
                                                                {/*<Text style={[Styles.green, Styles.fontBold, Styles.font12]}>{quorum_user_count}</Text> */}

                                                            </View>
                                                            <TouchableOpacity 
                                                            //onPress={() => this.setState({quorum_user_count: parseInt(quorum_user_count)+1})} 
                                                            style={{justifyContent:'center', backgroundColor:'#1bc773', padding:normalize(10), borderTopRightRadius:15, borderBottomRightRadius:15}}>
                                                                <PlainIcon name="plus" fontSize={normalize(12)} color="#FFF" />
                                                            </TouchableOpacity>
                                                            
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                                <View style={[Styles.tbCol, { width: '80%', justifyContent: 'flex-start' }]}>
                                                    <Text style={[Styles.checkBoxText]}>Max number of players needed to confirm the game and close the table</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                        
                    </View>
                </View>
            </>
        );
    }

    render() {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.settingModalVisible}
                    onRequestClose={() => this.closeModal()}>
                    <View style={[styles.modalBackground]}>
                        <View style={styles.modalContent}>
                            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                            <View style={[Styles.tbRow]}>
                                <View style={[Styles.tbCol, { width: '80%' }]}>
                                    <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Settings</Text>
                                </View>
                                
                                <View style={[Styles.tbCol, { width: '20%', alignItems: 'flex-end' }]}>
                                    <TouchableOpacity
                                        activeOpacity={Styles.touchOpacity}
                                        style={Styles.closeBtn}
                                        onPress={() => this.closeModal()}
                                    >
                                        <Image source={Images.crossIcon} resizeMode="contain" style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </LinearGradient>

                            <View style={[styles.modalBody, Styles.centerText]}>
                                {this.renderView()}
                            </View>
                        </View>
                    </View>
                </Modal>
            );
        
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        //padding: 20,
        backgroundColor: '#00000090',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalHeader: {
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
    modalContent: {
        height: '75%',
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalBody: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
        backgroundColor: '#F8F9F9'
    },
    content: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column' },
    box: { width: '100%', flex: 1, flexDirection: 'row' },
    boxContent: {
        paddingTop: 10,
    }
});