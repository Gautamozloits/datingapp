import React, { useState, useEffect } from 'react';
import {
    View,
    Text, TextInput,
    Dimensions,
    ScrollView, FlatList, Image, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import { Overlay } from 'react-native-elements';
import { ToastMessage } from '../../components/ToastMessage';
import { kFormatter } from '../../api/service';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import normalize from 'react-native-normalize';

export function ByInModal(props) {
    const [totalChips, setTotalChips] = useState('');
    const [amountHistory, setAmountHistory] = useState([]);
    const [userDetails, setUserDetails] = useState('');
    const { width, height } = Dimensions.get('window');
    var isVisible = false;
    if (props.isVisible) {
        isVisible = props.isVisible
    }

    useEffect(() => {
        async function getAmountDetails() {
            let amount_details = props.amountDetails;
            setUserDetails(amount_details)
            setTotalChips(amount_details.buy_in)
            if (amount_details.buyins) {
                let amountHistory = amount_details.buyins;//JSON.parse(amount_details.amount_history);
                var amountArr = []
                amountHistory.map((amount, key) => {
                    let amountObj = {
                        id: amount.id,
                        buyin: amount.buyin,
                        isEditable: false
                    }
                    amountArr.push(amountObj)
                })
                console.log(JSON.stringify(amountArr))
                setAmountHistory(amountArr)
            }

        }
        getAmountDetails();
    }, []);

    function toggleInput(index) {
        const array = [...amountHistory];
        array.map((value, placeindex) =>
            placeindex === index
                ? (array[placeindex]['isEditable'] = !array[placeindex]['isEditable'])
                : (array[placeindex]['isEditable'] = false)
        );

        setAmountHistory(array)
    }

    function updateChips(item, index){
        console.log(item);
        let amounts = [];
        amountHistory.map((amount, key) => {
            if(amount.buyin > 0){
                amounts.push(amount.buyin)
            }
        })
        let user = userDetails;
        if(item.buyin != '' && item.buyin > 0){
            user.buyins[index] = item;
        }else{
            user.buyins.splice(index,1)
        }
        
        setUserDetails(user)

        var buy_in = amounts.reduce(function(a, b) { return parseInt(a) + parseInt(b); }, 0);
        
        let params = { user_id: props.that.props.user.id, game_user_id: userDetails.game_user_id,game_id: props.that.props.gameDetails.game_id, amount_history: amounts, buy_in: buy_in, buyin_obj: item }
        props.that.props.socket.emit("updateChips", params, (res) => {
            //console.log(JSON.stringify(res))
            if (res.status) {
                props.that.props.that.getActiveGame()

                //console.log(userDetails.buyins)
                let amountHistory = userDetails.buyins;//JSON.parse(amount_details.amount_history);
                var amountArr = [];
                console.log('amountHistory: ',JSON.stringify(amountHistory))
                amountHistory.map((amount, key) => {
                    let amountObj = {
                        id: amount.id,
                        buyin: amount.buyin,
                        isEditable: false
                    }
                    amountArr.push(amountObj)
                })
                console.log(JSON.stringify(amountArr))
                setAmountHistory(amountArr)

                var amountArr = []
                // amounts.map((amount, key) => {
                //     let amountObj = {
                //         amount: amount,
                //         isEditable: false
                //     }
                //     amountArr.push(amountObj)
                // })
                // setAmountHistory(amountArr)
                ToastMessage(res.message)
                setTotalChips(buy_in)
            } else {
                ToastMessage(res.message, "error")
            }
        });

        toggleInput(index)
    }

    function closeModal() {
        props.that.skipModal()
    }
    const amountView = (item, index) => {
        if(item.buyin > 0) {
        return (
            <View key={index} style={[Styles.centerText, { flexDirection: 'row', paddingBottom: 10 }]}>
                <TouchableOpacity activeOpacity={0.7}
                    onPress={() => toggleInput(index)}
                >
                    {item.isEditable ? <TextInput
                        onBlur={() => updateChips(item, index)} 
                        placeholder="Chips"
                        defaultValue={item.buyin.toString()}
                        onChangeText={(value) => item.buyin = value} 
                        maxLength={8}
                        keyboardType={"numeric"}
                        returnKeyType='done'
                        style={[Styles.inputField]}
                    /> : <View style={[Styles.centerText, Styles.shadow2, (index % 2) ? Styles.bgBrown : Styles.bgYellow, { borderRadius: 50, height: RFPercentage(5.8), width: RFPercentage(5.8) }]}>
                            <Text style={[Styles.textWhite, Styles.font14, Styles.fontBold,]}>{kFormatter(item.buyin)} {item.isEditable}</Text>
                        </View>}

                </TouchableOpacity>
                {amountHistory.length > index + 1 ? <View style={{ padding: 6 }}>
                    <Image source={Images.plusIcon} resizeMode="contain" style={{ height: RFPercentage(2.6), width: RFPercentage(2.6) }} />
                </View> : null}

            </View>

        ) }else{
            return null;
        }
    }
    return (
        <Overlay isVisible={isVisible} height={'60%'} overlayStyle={{ padding: 0, borderRadius: 10, backgroundColor: '#FFF' }}>
            <View style={{ height: '100%' }}>
                <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[Styles.textWhite, Styles.font20, Styles.fontBold,]}>Buy In breakup</Text>
                    <TouchableOpacity
                        activeOpacity={Styles.touchOpacity}
                        style={Styles.closeBtn}
                        onPress={closeModal}
                    >
                        <Image source={Images.crossIcon} resizeMode="contain" style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={[Styles.centerText, { height: normalize(60) }]}>
                    <Text style={[Styles.font28, Styles.fontBold, Styles.textPrimaryDark, Styles.title]}>{userDetails.name}</Text>
                </View>
                <View style={[Styles.centerText, { flex: 3 }]}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <FlatList
                            //horizontal={true}
                            contentContainerStyle={[Styles.centerText]}
                            showsHorizontalScrollIndicator={false}
                            data={amountHistory}
                            renderItem={({ item, index }) =>
                                amountView(item, index)
                            }
                            numColumns={4}
                            //ListEmptyComponent={<Text style={[Styles.font14, Styles.textGrayLight, Styles.fontRegular]}>No Create Group at the moment.</Text>}
                            keyExtractor={item => Math.random().toString()}
                        />

                        {/* {amountHistory.map((item, index) => {
                            return amountView(item, index)
                        })} */}
                    </View>
                </View>
                <View style={[{ height:normalize(100) }]}>
                    <Image source={Images.line} resizeMode="cover" style={{ width: '70%', height: 1, alignSelf: 'center' }} />
                    <View style={[Styles.centerText, { padding: 20 }]}>
                        <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontRegular]}>Total Amount</Text>
                        <Text style={[Styles.textPrimaryDark, Styles.font22, Styles.fontBold]}>{totalChips}</Text>
                    </View>
                </View>
            </View>
        </Overlay>
    );
}
