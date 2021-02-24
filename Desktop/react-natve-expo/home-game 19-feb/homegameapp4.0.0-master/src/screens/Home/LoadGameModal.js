import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal, FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import SwitchSelector from "react-native-switch-selector";
import { ToastMessage } from '../../components/ToastMessage';
import moment from "moment";
import Styles from '../../styles/Styles';
import { NoRecord } from '../../components/Loader'
import Images from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
const { width, height } = Dimensions.get('window');
const options = [
    { label: "Half Value", value: "half" },
    { label: "Full Value", value: "full" }
];

export function LoadGameModal(props) {

    const [gameid, setGameid] = useState([]);
    const [selectedGame, setSelectedGame] = useState({});

    function closeModal() {
        props.that.setState({ isLoadGameModalVisible: false })
    }
    const amount = [{ id: 1, amount: '20k' }, { id: 2, amount: '40k' }, { id: 3, amount: '30k' }, { id: 4, amount: '20k' }]

    function loadGame() {
        props.that.setState({ isLoadGameModalVisible: false })
        props.that.selectGame(selectedGame)


    }
    function checkValidForm() {
        if (initialbuyin === '') {
            ToastMessage('Please enter initial buy in value', 'error')
            return false;
        }
        return true;
    }

    const renderView = (item, index) => {
        return (
            <View key={index} style={{ padding: 10, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E9EBEE' }}>
                <TouchableOpacity onPress={() => { setGameid(item.game_id); setSelectedGame(item) }} style={{ flexDirection: 'row', paddingLeft: 0, }}>
                    <Image source={(gameid === item.game_id) ? Images.checked : Images.unchecked} style={{ height: normalize(20), width: normalize(20) }} /><Text style={[Styles.font14, Styles.fontRegular, { marginLeft: 10 }]} numberOfLines={2}>{item.sub_title} - {item.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={closeModal}>
            <View style={[styles.modalBackground]}>
                <View style={styles.modalContent}>
                    <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                        <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Saved Games</Text>
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
                            data={props.that.state.savedGames}
                            renderItem={({ item, index }) =>
                                renderView(item, index)
                            }
                            keyExtractor={item => Math.random().toString()}
                            ListEmptyComponent={() => <NoRecord visible={props.that.state.savedGames.length > 0 ? false : true} />}
                        />

                        {props.that.state.savedGames.length > 0 ? <View style={[Styles.tbRow, { paddingTop: 50 }]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]}>
                                <SmallButton onPress={() => loadGame()} label="Load Game" fontSize={12} btnStyle={{ width: '40%' }} />
                            </View>
                        </View> : null}

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
        justifyContent: 'space-between',
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
        backgroundColor: '#FFF'
    }
});