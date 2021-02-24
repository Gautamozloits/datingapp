import React from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal, FlatList, Platform
} from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";

import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import SwitchSelector from "react-native-switch-selector";
import { ToastMessage } from '../../components/ToastMessage';
import moment from "moment";
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import GroupsDropdown from './GroupsDropdown';
import { NoRecord } from '../../components/Loader'
import Images from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
import { isValidName, isValidPhoneNumber } from '../../api/service';
const { width, height } = Dimensions.get('window');
//const modalFlash1 = useRef(null);

export class AddNewPersonModalGuest extends React.PureComponent {


    constructor(props) {
        super(props);

        this.myLocalFlashMessage = React.createRef();
        this.state = {
            //SELECTED_GROUP_USERS: [],
        };
    }

    componentDidMount = async () => {
        // var { SELECTED_GROUP_USERS } = this.props.that.state
        // let dummyUser = { id: '', name: '', nickname: '', phone_number: '', isVisible: false, assign_groups: [], groups: [] };

        // let blankUser = JSON.parse(JSON.stringify(dummyUser));
        // if (SELECTED_GROUP_USERS.length > 0) {
        //     SELECTED_GROUP_USERS.unshift(blankUser);
        // } else {
        //     SELECTED_GROUP_USERS.push(blankUser);
        // }
        // this.props.that.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS })
    }

    closeModal() {
        //this.props.that.state.isAddPlayerModalVisible
        this.props.that.setState({ isAddPlayerModalVisible: false })
    }
    togglePhoneBook(item, index, type = 'name') {
        console.log('here.......',this.props.that.state.isPhoneBookModalVisible)
        // if (!props.that.state.isPhoneBookModalVisible) {
        //     props.that.setState({ selectedUserForContact: item, selectedIndexForContact: index, openPhoneBookFor: type })
        // }
        this.props.that.setState({ isPhoneBookModalVisible: !this.props.that.state.isPhoneBookModalVisible, isAddPlayerModalVisible: !this.props.that.state.isAddPlayerModalVisible, openPhoneBookFor: type })
        this.props.that.forceUpdate()
    }
    addNewGroup = (group) => {
        var groups = this.props.that.state.groups;
        groups.push(group)
        this.props.that.setState(groups);
        this.props.that.forceUpdate()
    }
    
    groupDropDown(item, index) {
        return (<GroupsDropdown ref="dropdown_2"
            style={styles.dropdown}
            textStyle={styles.dropdown_2_text}
            dropdownStyle={styles.dropdown_2_dropdown}
            groups={this.props.that.state.groups}

            data={item.groups}
            SELECTED_GROUP_USERS={this.props.that.state.SELECTED_GROUP_USERS}
            user={item}
            userIndex={index}
            that={this}
            selectedItems={null}

        />);
    }
    doneUser() {
        if (this.checkValidUsers()) {
            this.props.that.updateGamePlayers(this.props.that.state.SELECTED_GROUP_USERS[0])
        }
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
    checkValidUsers = () => {
        var users = this.props.that.state.SELECTED_GROUP_USERS;
        var flag = true;
        users.map((user, index) => {
            if (!user.name || user.name === '') {
                flag = false;
                this.showLocalMessage('All contact must have name', 'error')
            }else if(!isValidName(user.name)){
                flag = false;
                this.showLocalMessage('The Name field must contain only letters.', 'error')
            }else if (!user.phone_number || user.phone_number === '') {
                flag = false;
                this.showLocalMessage('All contact must have phone number', 'error')
            }else if(!isValidPhoneNumber(user.phone_number)){
                flag = false;
                this.showLocalMessage('The Phone Number must be a valid 10 digit number.', 'error')
            }
        })

        return flag;
    }

    userCard(item, index) {
        const { SELECTED_GROUP_USERS } = this.props.that.state;
        return (<View key={index} style={[{ flexDirection: 'column', backgroundColor: '#77869E', marginBottom: normalize(25), borderRadius: 10 }]}>

            <View style={[styles.rowFront, { borderRadius: 10, borderBottomRightRadius: 40, backgroundColor: '#FFF' }]}>
                <View style={styles.sNo}>
                    <Text style={[Styles.font13, Styles.fontMedium, Styles.textWhite]}>{(SELECTED_GROUP_USERS.length + 1) - index}</Text>
                </View>
                <View style={Styles.tbRow}>
                    <View style={[Styles.tbCol, styles.inputBox]}>
                        <TouchableOpacity

                            style={[styles.inlineInput]}
                            onPress={() => {
                               // this.togglePhoneBook(item, index, 'name');
                            }}>
                            <Image source={Images.user} style={styles.inputIcon} />
                            <TextInput autoCapitalize='words' editable={true} defaultValue={item.name} placeholder="Enter name" maxLength={50} style={styles.inputField} onChangeText={(value) => item.name = value}/>
                            
                        </TouchableOpacity>
                    </View>
                    <View style={[Styles.tbCol, styles.inputBox]}>
                        <TouchableOpacity
                            style={[styles.inlineInput]}
                            onPress={() => {
                               // this.togglePhoneBook(item, index, 'phone_number');
                            }}>
                            <Image source={Images.phoneIcon} style={styles.inputIcon} />
                            <TextInput editable={true} 
                                returnKeyType='done'
                                keyboardType="number-pad"
                                autoCapitalize='none' 
                                defaultValue={item.phone_number} 
                                placeholder="Enter phone number" 
                                maxLength={12} 
                                style={styles.inputField} 
                                onChangeText={(value) => item.phone_number = value} />
                            {/* {Platform.OS == "android" ?
                                <TextInput editable={true} value={item.phone_number} placeholder="Enter phone number" maxLength={50} style={styles.inputField} onChangeText={(value) => item.phone_number = value} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.inputField, { textAlignVertical: "center", paddingTop: 5, color: item.phone_number ? '#2A395B' : '#d3d3d3' }]} onChangeText={(value) => item.phone_number = value} >{item.phone_number ? item.phone_number : "Enter phone number"}</Text>
                            } */}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={Styles.tbRow}>
                    <View style={[Styles.tbCol, styles.inputBox, {width: '100%'}]}>
                        <View style={styles.inlineInput}>
                            <Image source={Images.user} style={styles.inputIcon} />
                            <TextInput
                                autoCapitalize='words'
                                onChangeText={value => {
                                    item.nickname = value;
                                }}
                                //value={item.phone_number} 
                                placeholder="Nickname" maxLength={50} style={styles.inputField} />

                        </View>
                    </View>
                   
                </View>
            </View>
        </View>);


    }

    render() {
        if (this.props.that.state.SELECTED_GROUP_USERS.length > 0) {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.that.state.isAddPlayerModalVisible}
                    onRequestClose={() => this.closeModal()}>
                    <View style={[styles.modalBackground]}>
                        <View style={styles.modalContent}>
                            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                            <View style={[Styles.tbRow]}>
                                <View style={[Styles.tbCol, { width: '40%' }]}>
                                    <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Add Player</Text>
                                </View>
                                <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-start' }]}>
                                    <SmallButton onPress={() => {
                                        this.togglePhoneBook({}, 0, 'name');
                                        //this.setState({showCreateUser:true});
                                    }} label="Phone Book" fontSize={9} />
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

                                {this.userCard(this.props.that.state.SELECTED_GROUP_USERS[0], 0)}

                                <SmallButton onPress={() => {
                                    this.doneUser()
                                    //this.setState({showCreateUser:true});
                                }} label="Add" fontSize={12} btnStyle={{ width: '30%' }} />

                            </View>
                        </View>



                    </View>
                    <FlashMessage ref={this.myLocalFlashMessage} />
                </Modal>
            );
        } else {
            return null;
        }
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
        height: normalize(250),
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
    rowFront: {
        zIndex: -1,
        position: 'relative',
        alignItems: 'center',
        backgroundColor: '#77869E',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
        //  height: 50,
    },
    inputBox: {
        width: '50%', paddingLeft: 5, paddingRight: 5
    },
    inlineInput: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        borderColor: '#DFE7F5',
        borderBottomWidth: 1,
    },
    inputIcon: {
        height: normalize(15),
        width: normalize(15),
    },
    inputField: {
        height: normalize(30),
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: normalize(16),
        color: '#2A395B',
        fontFamily: 'Regular'
    },
    dropdown: {
        height: normalize(30),
        width: '93%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    dropdownIcon: {
        height: normalize(10),
        width: normalize(10),
    },
    inputBox: {
        width: '50%', paddingLeft: 5, paddingRight: 5
    },
    readOnlyInput: {
        ...Styles.font14,
        ...Styles.fontRegular,
        ...Styles.textPrimary,
        marginLeft: 5,
    },
    dropdown_2_text: {
        //marginVertical: normalize(10),
        //marginHorizontal: normalize(3),
        //fontSize: 18,
        // color: 'white',
        //textAlign: 'center',
        //textAlignVertical: 'center',
        ...Styles.font14,
        ...Styles.fontRegular,
        ...Styles.textPrimary,
        // marginLeft: -5,
    },
    dropdown_2_dropdown: {
        width: normalize(150),
        //height: normalize(200),
        borderColor: '#DFE7F5',
        borderWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,

    },
});