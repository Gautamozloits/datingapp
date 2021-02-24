import React, { useRef } from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal, FlatList
} from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import SwitchSelector from "react-native-switch-selector";
import { ToastMessage } from '../../components/ToastMessage';
import moment from "moment";
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';

import { NoRecord } from '../../components/Loader'
import Images from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
const { width, height } = Dimensions.get('window');
const options = [
    { label: "Half Value", value: "half" },
    { label: "Full Value", value: "full" }
];

export function LeaveGameUsersModal(props) {
    const modalFlash = useRef(null);
    function closeModal() {
        props.that.setState({ isLeaveGameModalVisible: false })
    }
    const amount = [{ id: 1, amount: '20k' }, { id: 2, amount: '40k' }, { id: 3, amount: '30k' }, { id: 4, amount: '20k' }]

    function leaveGame() {
        props.that.leaveMultipleUser()
    }

    function selectUser(id, item) {
        let users = props.that.state.selectedUsers;
        const index = users.indexOf(id);
        if (index > -1) {
            users.splice(index, 1);
        } else {
            users.push(id);
        }
        props.that.setState({ selectedUsers: users })
    }
    function checkValidForm() {
        if (initialbuyin === '') {
            ToastMessage('Please enter initial buy in value', 'error')
            return false;
        }
        return true;
    }
    function showLocalMessage(msg) {
        modalFlash.current.showMessage({
            message: msg,
            type: 'danger',
            duration: 4000,
            position: 'top',
            floating: 'yes',
            style: {
                backgroundColor: '#646560',
                borderRadius: 25,
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center'
            },
            titleStyle: {
                color: '#FFFFFF'
            }
        })
    }
    const renderView = (item, index) => {
        return (
            <TouchableOpacity
                activeOpacity={Styles.touchOpacity}
                onPress={() => { (item.is_banker === 0 && item.current_status === 'Start') ? selectUser(item.game_user_id, item) : showLocalMessage('To leave the game, please assign someone else the banker') }}
            >
                <View key={index} style={[styles.rowFront, (item.is_banker === 0 && item.current_status === 'Start') ? styles.activeRow : styles.inactiveRow]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '10%', padding: normalize(10) }]}>
                        {(item.current_status === 'Start') ? <Image source={(props.that.state.selectedUsers.includes(item.game_user_id)) ? Images.checked : Images.unchecked} style={{ height: normalize(20), width: normalize(20) }} /> : null}
                    </View>
                    <View style={[Styles.tbCol, { width: '20%', flexDirection: 'row', alignItems: 'center' }]}>
                        <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                        {(item.is_banker == 1) ? <View style={[Styles.shadow5, { borderRadius: 50, position: 'absolute', right: 0 }]}><Image source={Images.bankerIcon} style={{ height: normalize(20), width: normalize(20) }} /></View> : null}
                    </View>

                    <View style={[Styles.tbCol, { width: '70%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                        <Text style={[Styles.font16, Styles.fontRegular, { marginLeft: 10 }]} numberOfLines={2}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={closeModal}>
            <View style={[styles.modalBackground]}>
                <View style={styles.modalContent}>
                    <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                        <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Game Players</Text>
                        <TouchableOpacity
                            activeOpacity={Styles.touchOpacity}
                            style={Styles.closeBtn}
                            onPress={closeModal}
                        >
                            <Image source={Images.crossIcon} resizeMode="contain" style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.modalBody}>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={props.that.state.gameDetails.users}
                            renderItem={({ item, index }) =>
                                renderView(item, index)
                            }
                            keyExtractor={item => Math.random().toString()}
                        //ListEmptyComponent={() => <NoRecord visible={props.that.state.gameDetails.length > 0 ? false : true} />}
                        />
                        {props.that.state.selectedUsers.length > 0 ? <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]}>
                            <SmallButton onPress={() => leaveGame()} label="Leave Game" fontSize={12} btnStyle={{ width: '40%' }} />
                        </View> : null}


                    </View>
                </View>



            </View>
            <FlashMessage ref={modalFlash} position="top" />
        </Modal>
    );
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
        height: height / 1.2,
        
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalBody: {
        flex: 1,
        padding: 15,
        paddingTop: 20,
        backgroundColor: '#F8F9F9'
    },
    rowFront: { flexDirection: 'row', marginBottom: normalize(16), borderRadius: 10, flex: 1, padding: 5 },
    activeRow: { backgroundColor: '#FFF' },
    inactiveRow: { backgroundColor: '#E9EBEE' },
    cardImage: {
        height: normalize(48),
        width: normalize(48),
        borderRadius: 8
    },
});