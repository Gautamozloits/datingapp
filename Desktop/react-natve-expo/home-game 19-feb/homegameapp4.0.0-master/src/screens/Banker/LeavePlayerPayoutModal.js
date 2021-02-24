import React from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal, FlatList, ScrollView
} from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";

import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import SwitchSelector from "react-native-switch-selector";
import { ToastMessage } from '../../components/ToastMessage';
import { isValidNumber } from '../../api/service';
import moment from "moment";
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import { NoRecord } from '../../components/Loader'
import Images from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
import DoubleClicker from '../../components/react-native-double-click/main';
const { width, height } = Dimensions.get('window');
//const modalFlash1 = useRef(null);

export class LeavePlayerPayoutModal extends React.PureComponent {


    constructor(props) {
        super(props);

        this.myLocalFlashMessage = React.createRef();
        this.state = {
            gameUsers: [],
        };
    }

    componentDidMount = async () => {
        this.setState({ gameUsers: JSON.parse(JSON.stringify(this.props.leaveUsers)) })
        this.forceUpdate()
        console.log(JSON.stringify(this.state.gameUsers))
    }

    closeModal() {
        this.props.that.setState({ isLeavePlayerPayoutModalVisible: false, isLeaveGameModalVisible: true })
    }
    togglePhoneBook(item, index, type = 'name') {
        this.props.that.setState({ isPhoneBookModalVisible: !this.props.that.state.isPhoneBookModalVisible, isAddPlayerModalVisible: !this.props.that.state.isAddPlayerModalVisible, openPhoneBookFor: type })
    }

    checkIsAllPaidAmountEntered(arr) {
        var flag = true;
        if (arr.length > 0) {
            arr.map((value, key) => {
                if (value.result) {
                    if (value.result === 'Loser' && value.paid_amount === '') {
                        flag = false;
                    }
                }
            })
        }

        return flag;
    }

    checkIsAllChipsEntered(arr) {
        var flag = true;
        if (arr.length > 0) {
            arr.map((value, key) => {
                if (value.receive_buy_in === 0 || value.receive_buy_in > 0) {

                } else {
                    flag = false;
                }
            })
        }

        return flag;
    }

    updatePayoutUser = async () => {
        if (!this.checkIsAllChipsEntered(this.state.gameUsers)) {
            this.showLocalMessage("Please enter chips for all players")
        } else if (!this.checkIsAllPaidAmountEntered(this.state.gameUsers)) {
            this.showLocalMessage("Please enter Cash Paid for the losing players")
        } else {
            this.props.that.setState({ showIndicator: true })
            let params = { user_id: this.props.user.id, game_id: this.props.gameDetails.game_id, game_users: this.state.gameUsers };
            this.props.socket.emit("leaveMultipleUsers", params, (res) => {
                console.log(res)
                if (res.status) {
                    this.showLocalMessage(res.message)
                    this.props.that.getActiveGame();
                    this.props.that.setState({ isPhoneBookModalVisible: false, isLeaveGameModalVisible: false, isLeavePlayerPayoutModalVisible: false })
                } else {
                    this.showLocalMessage(res.message, "error")
                }
                this.props.that.setState({ showIndicator: false })
            });
        }



    }
    getBankers = async (users) => {
        var user_index = users.findIndex((value) => {
            return value.is_banker === 1;
        })
        var banker = users[user_index];
        this.setState({ banker: banker })
        //auto_assign_loss
        if (banker.auto_assign_loss === 1) {
            var isValid = true;
            await this.props.gameDetails.users.map((item, index) => {
                if (item.result == 'Loser') {
                    if (item.paid_amount) {
                        isValid = false;
                    } else {
                        if (item.lost_amount <= parseFloat(this.props.gameDetails.options.showdown)) {
                            item.paid_amount = item.lost_amount.toString();
                        } else {
                            item.paid_amount = this.props.gameDetails.options.showdown.toString();
                        }
                    }
                }
            })
            if (isValid) {
                this.props.that.getActiveGame()
            }

        }

    }
    returnChips = (game_user, index) => {

        var game = this.props.gameDetails;

        if (game_user.receive_buy_in != '' && game_user.receive_buy_in >= 0) {
            if (game_user) {
                let options = game.options;
                let game_value = options.game_value;

                let buy_in = parseFloat(game_user.buy_in);
                let receive_buy_in = parseFloat(game_user.receive_buy_in);
                let g_data = { receive_buy_in: receive_buy_in, result: 'Winner' };
                game_user.receive_buy_in = receive_buy_in;
                game_user.result = 'Winner';

                if (receive_buy_in < buy_in) {
                    game_user.result = 'Loser';
                    let amount = (game_value === 'full') ? (buy_in - receive_buy_in) : ((buy_in - receive_buy_in) / 2);
                    game_user.lost_amount = amount;
                    game_user.won_amount = 0;
                    game_user.paid_amount = ''
                    game_user.remaining_amount_tobe_paid = amount;
                    game_user.remaining_amount_tobe_rcvd = 0;
                    if (amount == 0) {
                        game_user.is_account_clear = 1
                    } else {
                        game_user.is_account_clear = 0
                    }
                } else if (receive_buy_in > buy_in) {
                    let amount = (game_value === 'full') ? (receive_buy_in - buy_in) : ((receive_buy_in - buy_in) / 2);
                    game_user.won_amount = amount;
                    game_user.paid_amount = '';
                    game_user.lost_amount = 0;
                    game_user.remaining_amount_tobe_paid = 0;
                    game_user.remaining_amount_tobe_rcvd = amount;
                    game_user.result = 'Winner';
                    if (amount === 0) {
                        game_user.is_account_clear = 1
                    } else {
                        game_user.is_account_clear = 0
                    }
                } else {
                    let amount = (game_value === 'full') ? (receive_buy_in - buy_in) : ((receive_buy_in - buy_in) / 2);
                    game_user.won_amount = 0;
                    game_user.remaining_amount_tobe_rcvd = 0;
                    game_user.remaining_amount_tobe_paid = 0;
                    game_user.result = 'Quits';

                    game_user.paid_amount = 0;
                    game_user.lost_amount = 0;

                    if (amount === 0) {
                        game_user.is_account_clear = 1
                    } else {
                        game_user.is_account_clear = 0
                    }
                }
                var { gameUsers } = this.state;
                this.setState({ gameUsers: gameUsers })
                this.forceUpdate()
            }
        }
    }

    checkPaybleAmount = async (item, value, index) => {
        const { gameUsers } = this.state;
        if (!value || value == '') {
            item.paid_amount = '';
            gameUsers[index] = item;
            this.setState({ gameUsers: gameUsers })
            this.forceUpdate()
        } else {
            var amount = parseFloat(value);
            if (isValidNumber(amount)) {
                if (item.remaining_amount_tobe_paid < amount) {
                    this.showLocalMessage('Cash paid cannot be more than the remaining balance', 'error')
                    amount = amount.toString()
                    amount = amount.slice(0, amount.length - 1);

                    item.paid_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })

                } else {
                    item.paid_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })
                }
                this.forceUpdate();
            } else {
                this.showLocalMessage('Please enter valid number', 'error')
            }
        }
    }

    checkPaybleReceiveAmount = async (item, value, index) => {
        const { gameUsers } = this.state;
        if (!value || value == '') {
            item.received_amount = '';
            gameUsers[index] = item;
            this.setState({ gameUsers: gameUsers })
            this.forceUpdate()
        } else {
            var amount = parseFloat(value);
            if (isValidNumber(amount)) {
                if (item.remaining_amount_tobe_rcvd < amount) {
                    this.showLocalMessage('Receive amount cannot be more than the balance to be paid', 'error')
                    amount = amount.toString()
                    amount = amount.slice(0, amount.length - 1);

                    item.received_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })

                } else {
                    item.received_amount = amount;
                    gameUsers[index] = item;
                    this.setState({ gameUsers: gameUsers })
                }
                this.forceUpdate();
            } else {
                this.showLocalMessage('Please enter valid number', 'error')
            }
        }
    }

    payLostAmount = (item, index, type = 'manual') => {
        var gameDetails = this.props.gameDetails;
        if (item.remaining_amount_tobe_paid < item.paid_amount) {
            this.showLocalMessage('Cash paid cannot be more than the remaining balance', 'error')
            return false;
        } else {
            let message = 'Are you sure want to pay this amount? After that you will not be able to update this amount.';
            if (gameDetails.is_banker === 1) {
                message = 'Are you sure want to pay this amount?';
            }
            var gameDetails = this.props.gameDetails;
            this.setState({ showIndicator: true })
            let params = { user_id: this.props.user.id, game_id: gameDetails.game_id, game_user_id: item.game_user_id, paid_amount: item.paid_amount };
            this.props.socket.emit("payLostAmount", params, (res) => {
                if (res.status) {
                    if (type === 'manual') {
                        this.props.that.getActiveGame()
                    }

                    // ToastMessage(res.message)

                } else {
                    this.showLocalMessage(res.message, "error")
                }
                this.setState({ showIndicator: false })
            });
        }



    }

    getBalance = (item) => {
        let balance = null;
        if (item.result == 'Winner') {
            balance = item.won_amount - item.received_amount;

        } else if (item.result == 'Loser') {
            balance = item.lost_amount - item.paid_amount;
        } else if (item.result == 'Quist') {
            balance = 0;
        }
        return balance;
    }


    showLocalMessage(msg) {
        this.myLocalFlashMessage.current.showMessage({
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


    resultView = (item, index) => {
        const { user, gameDetails } = this.props
        var placeholder = 'Enter';

        if (item.result == 'Winner') {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.greenBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9F9F1', padding: 5, }]}>
                                <Image source={Images.arrowGreen} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Won</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}>{item.won_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, }]}>
                                <Image source={Images.receiptIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 5 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Rcvd</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    {/* <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View> */}
                                    {(gameDetails.is_banker === 1 || (user.id === item.id)) ?
                                        <TextInput
                                            returnKeyType='done'
                                            defaultValue={`${item.received_amount}`}
                                            editable={(gameDetails.status === 'Tallied') ? false : true}
                                            placeholder={placeholder} //onSubmitEditing={() => this.payLostAmount(item, index)} 
                                            //onBlur={() => this.payLostAmount(item, index)}
                                            value={`${item.received_amount}`}
                                            //onChangeText={(value) => item.paid_amount = value} 
                                            onChangeText={(value) => { this.checkPaybleReceiveAmount(item, value, index) }}
                                            keyboardType={"numeric"} style={styles.inputField} />
                                        :
                                        <TextInput value={`${item.received_amount}`} placeholder="Enter" editable={false} style={styles.inputField} />

                                    }
                                    {/* <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark]}>{item.received_amount}</Text> */}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else if (item.result == 'Loser') {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.redBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#FEECED', padding: 5, }]}>
                                <Image source={Images.arrowRed} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Lost</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}>{item.lost_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.yellowBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#FFF8EA', padding: 5, }]}>
                                <Image source={Images.paymentIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 5 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Paid</Text>
                                <View style={styles.editBox}>
                                    {(gameDetails.is_banker === 1 || (user.id === item.id)) ?
                                        <TextInput
                                            returnKeyType='done'
                                            defaultValue={`${item.paid_amount}`}
                                            editable={(gameDetails.status === 'Tallied') ? false : true}
                                            placeholder={placeholder} //onSubmitEditing={() => this.payLostAmount(item, index)} 
                                            //onBlur={() => this.payLostAmount(item, index)}
                                            value={`${item.paid_amount}`}
                                            //onChangeText={(value) => item.paid_amount = value} 
                                            onChangeText={(value) => { this.checkPaybleAmount(item, value, index) }}
                                            keyboardType={"numeric"} style={styles.inputField} />
                                        :
                                        <TextInput value={`${item.paid_amount}`} placeholder="Enter" editable={false} style={styles.inputField} />

                                    }


                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else if (item.result == 'Quits') {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, flexDirection: 'row' }]}>
                                <Image source={Images.arrowGreen} style={styles.arrows} />
                                <Image source={Images.arrowRed} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Quits</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}>{item.lost_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, }]}>
                                <Image source={Images.paymentIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 5 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Cash Paid</Text>
                                <View style={styles.editBox}>
                                    {(item.paid_amount > 0 && gameDetails.is_banker !== 1) ?
                                        <TextInput value={item.paid_amount.toString()} editable={false} style={styles.inputField} />
                                        :
                                        <TextInput returnKeyType='done' editable={(gameDetails.status === 'Tallied') ? false : true} placeholder="Amount"
                                            //onSubmitEditing={() => this.payLostAmount(item, index)} 
                                            //onBlur={() => this.payLostAmount(item, index)}
                                            onChangeText={(value) => item.paid_amount = value} keyboardType={"numeric"} style={styles.inputField} defaultValue={`${item.paid_amount}`} />
                                    }


                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[Styles.tbRow, { paddingBottom: 0, paddingTop: 5 }]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, flexDirection: 'row' }]}>
                                <Image source={Images.arrowGreen} style={styles.arrows} />
                                <Image source={Images.arrowRed} style={styles.arrows} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Won/Loss</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                        <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                    </View>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 2 }]}></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[styles.grayBox]}>
                            <View style={[Styles.tbCol, Styles.centerText, { width: '40%', backgroundColor: '#E9EBEE', padding: 5, }]}>
                                <Image source={Images.receiptIcon} style={{ height: 22, width: 26 }} />
                            </View>
                            <View style={[Styles.tbCol, { width: '60%', padding: 8 }]}>
                                <Text style={[Styles.font10, Styles.fontRegular, Styles.textGray]}>Paid/Rcvd</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <Text style={[Styles.font14, Styles.fontRegular, Styles.textPrimaryDark]}></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

    }
    payLostAmountDoubleTap = (item, index) => {
        console.log(item)
        const { gameUsers } = this.state
        gameUsers[index] = item;
        this.setState(gameUsers)
        this.forceUpdate()
    } 
    
    receiveAmountDoubleTap = (item, index) => {
        console.log(item)
        const { gameUsers } = this.state
        gameUsers[index] = item;
        this.setState(gameUsers)
        this.forceUpdate()
    } 

    renderCard = (item, index) => {
        var balance = this.getBalance(item)
        const { user, gameDetails } = this.props
        return (
            <View key={index} style={[styles.gridBox, { marginBottom: (this.state.gameUsers.length === index + 1) ? RFPercentage(15) : RFPercentage(2), backgroundColor: (gameDetails.is_banker === 1 || (user.id === item.id)) ? '#FFF' : '#DCDCDC' }]}>
                <View style={[Styles.tbRow]}>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '20%', padding: 10 }]}>
                        <View style={styles.userImgContainer}>
                            <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                        </View>

                    </View>
                    <View style={[Styles.tbCol, { width: '45%', flexDirection: 'row', height: '100%' }]}>
                        <View style={[{ flexDirection: 'row' }]}>

                            <View style={[Styles.tbCol, { width: '90%', }]}>
                                <Text style={[Styles.font18, Styles.fontMedium, Styles.textPrimaryDark, { textTransform: 'capitalize' }]}>{item.name}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '35%', padding: 5 }]}>
                        <Text style={[Styles.font10, Styles.fontRegular, Styles.textPrimaryDark]}>Total Buy in</Text>
                        <Text style={[Styles.font16, Styles.fontRegular, Styles.textGray]}>{item.buy_in}</Text>
                    </View>
                </View>

                <View style={{ paddingTop: 0, paddingBottom: 5 }}>
                    <Image source={Images.line} style={{ width: '100%', height: 1, alignSelf: 'center' }} />
                </View>

                {(gameDetails.is_banker === 1 || (user.id === item.id)) ?
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[Styles.tbCol, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            <Text style={[Styles.font14, Styles.fontMedium, Styles.textPrimaryDark]}>Chip Count</Text>
                        </View>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            {/* <TextInput value="6000" style={Styles.inputField} /> */}
                            <TextInput returnKeyType='done' editable={(gameDetails.status === 'Tallied') ? false : true} placeholder={(gameDetails.is_banker === 1 || (user.id === item.id)) ? "Enter total chips" : ""}
                                //onSubmitEditing={() => this.returnChips(item, index)} 
                                onBlur={() => this.returnChips(item, index)}
                                onChangeText={(value) => { item.receive_buy_in = value; this.returnChips(item, index) }} defaultValue={`${item.receive_buy_in}`} keyboardType={"numeric"} style={[Styles.inputField, (gameDetails.status === 'Tallied' || (gameDetails.is_banker !== 1 && (user.id !== item.id))) ? Styles.disabled : null]} maxLength={8} />

                        </View>
                    </View>
                    : <View style={{ flexDirection: 'row' }}>
                        <View style={[Styles.tbCol, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            <Text style={[Styles.font14, Styles.fontMedium, Styles.textPrimaryDark]}>Chip Count</Text>
                        </View>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '50%', paddingLeft: 10, paddingRight: 10 }]}>
                            {/* <TextInput value="6000" style={Styles.inputField} /> */}
                            <TextInput editable={false} placeholder=""
                                defaultValue={`${item.receive_buy_in}`} keyboardType={"numeric"} style={[Styles.inputField, Styles.disabled]} maxLength={8} />

                        </View>
                    </View>}


                {this.resultView(item, index)}

                {(gameDetails.is_banker !== 1 && (user.id !== item.id) && !item.result) ? null :
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Image source={Images.line} style={{ width: '100%', height: 1, alignSelf: 'center' }} />
                    </View>
                }

                <View style={[{ flexDirection: 'row', padding: 15, paddingTop: 5, justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={[Styles.tbCol, { width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }]}>
                        <DoubleClicker onClick={() => {
                            if ((item.result == 'Loser') && balance > 0) {
                                item.paid_amount = balance;
                                this.payLostAmountDoubleTap(item, index)
                            }else if((item.result == 'Winner') && balance > 0){
                                item.received_amount = balance;
                                this.receiveAmountDoubleTap(item, index)
                            }
                        }}
                            style={[Styles.tbCol, { width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }]}
                        >
                            <Text style={[Styles.font18, Styles.fontBold, Styles.textPrimaryDark]}>{(item.result == 'Loser') ? 'Balance to be paid' : (item.result == 'Winner') ? 'Balance to be rcvd' : 'Balance'}: </Text>
                            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                                <View style={[Styles.shadow5, { borderRadius: 50 }]}>
                                    <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
                                </View>
                            </View>
                            <Text style={[Styles.font18, Styles.fontRegular, Styles.textPrimaryDark]}>{balance}</Text>
                        </DoubleClicker>
                    </View>
                    <View style={[Styles.tbCol, { width: '26%', justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                        {/* <SmallButton label="Done" fontSize={8} /> */}
                    </View>
                </View>

            </View>


        );

    }
    renderView = () => {
        const { gameDetails } = this.props;
        const { refreshing, gameUsers } = this.state;
        return (
            <>
                <View style={styles.grid}>
                    <View style={{}}>
                        <ScrollView
                            keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}
                            style={{ paddingBottom: normalize(20), paddingLeft: normalize(5), paddingRight: normalize(5) }}>
                            {gameUsers.map((item, index) => {
                                return (this.renderCard(item, index))
                            })}
                        </ScrollView>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 5 }}>
                            <SmallButton onPress={() => {
                                this.updatePayoutUser()
                                //this.setState({showCreateUser:true});
                            }} label="Submit" fontSize={12} btnStyle={{ width: '30%' }} />
                        </View>
                    </View>

                </View>
            </>
        );
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => this.closeModal()}>
                <View style={[styles.modalBackground]}>
                    <View style={styles.modalContent}>
                        <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.modalHeader, { alignItems: "center" }]}>
                            <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Game Players</Text>
                            <TouchableOpacity
                                activeOpacity={Styles.touchOpacity}
                                style={Styles.closeBtn}
                                onPress={() => this.closeModal()}
                            >
                                <Image source={Images.crossIcon} resizeMode="contain" style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
                            </TouchableOpacity>
                        </LinearGradient>



                        <View style={[styles.modalBody, Styles.centerText]}>

                            {this.renderView()}



                        </View>
                    </View>



                </View>
                <FlashMessage ref={this.myLocalFlashMessage} />
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
        height: '90%',
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalBody: {
        flex: 1,
        padding: 5,
        paddingTop: 20,
        backgroundColor: '#F8F9F9'
    },
    activeRow: { backgroundColor: '#FFF' },
    inactiveRow: { backgroundColor: '#E9EBEE' },
    cardImage: {
        height: normalize(48),
        width: normalize(48),
        borderRadius: 8
    },
    grid: {
        height: '100%',
    },
    gridBox: {
        width: '98%',
        marginLeft: RFPercentage(0.4),
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 15,
        marginTop: 5
    },

    row: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row',
        padding: 10
    },
    greenBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#E9F9F1', borderRadius: 8,
        overflow: 'hidden'
    },
    grayBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#E9EBEE', borderRadius: 8,
        overflow: 'hidden'
    },
    redBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#FEECED', borderRadius: 8,
        overflow: 'hidden'
    },
    yellowBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#FFF8EA', borderRadius: 8,
        overflow: 'hidden'
    },
    editBox: {
        flexDirection: 'row', alignItems: 'center',
    },
    inputField: {
        borderColor: '#FFF8EA', borderRadius: 4, borderWidth: 1, padding: normalize(5),
        height: normalize(25),
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: normalize(14),
        color: '#77869E',
        fontFamily: 'Medium'
    },
    tbRow: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row', padding: 10,
        marginBottom: 10,
        /* shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        elevation: 5,*/

    },
    userImgContainer: {
        height: RFPercentage(6),
        width: RFPercentage(6),
        borderRadius: 50,
        overflow: 'hidden'
    },

    cardImage: {
        height: RFPercentage(6),
        width: RFPercentage(6),
    },

    hrGreen: {
        height: 1,
        width: '80%',
        backgroundColor: '#E9F9F1',
        position: 'absolute',
        zIndex: -1
    },
    borderVertical: {
        height: '100%',
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'center'

    },
    arrows: {
        height: 22,
        width: 15
    }
});