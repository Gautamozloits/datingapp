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
import GroupsDropdown from '../Comman/GroupsDropdown';
import { NoRecord } from '../../components/Loader'
import Images, { user } from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
import { isValidName, isInvalidUsername, postData, isUsernameExist, randNumber } from '../../api/service';
const { width, height } = Dimensions.get('window');
//const modalFlash1 = useRef(null);

export class AddPlayerModal extends React.PureComponent {


    constructor(props) {
        super(props);

        this.myLocalFlashMessage = React.createRef();
        this.state = {
            SELECTED_GROUP_USERS: [],
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
        this.setState({ SELECTED_GROUP_USERS: this.props.that.state.SELECTED_GROUP_USERS })
        
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.that.state.SELECTED_GROUP_USERS !== this.state.SELECTED_GROUP_USERS) {
            this.setState({ SELECTED_GROUP_USERS: prevProps.that.state.SELECTED_GROUP_USERS })
            //this.fetchData(this.props.userID);
        }
    }

    closeModal() {
        //this.props.that.state.isAddPlayerModalVisible
        this.props.that.setState({ isAddPlayerModalVisible: false })
    }

    checkUsername = (user) => {
        this.props.that.setState({ showIndicator: true })
        let params = { 'username': user.username }
        console.log(params)
        postData('check-username', params).then(async (res) => {
            console.log(res)
            const { SELECTED_GROUP_USERS } = this.state;
            let users = SELECTED_GROUP_USERS;

            if (res.status) {

                users[0].id = res.data.id;
                users[0].is_valid_username = true;
                users[0].invalid_username = false;
                users[0].name = res.data.name;
                users[0].nickname = res.data.nickname;

            } else {
                users[0].is_valid_username = false;
                users[0].invalid_username = true;
                this.showLocalMessage(res.message, 'error')
            }
            this.setState({ SELECTED_GROUP_USERS: users })
            this.forceUpdate()

            this.props.that.setState({ showIndicator: false })

        })
    }

    togglePhoneBook(item, index, type = 'name') {
        // if (!props.that.state.isPhoneBookModalVisible) {
        //     props.that.setState({ selectedUserForContact: item, selectedIndexForContact: index, openPhoneBookFor: type })
        // }
        this.props.that.setState({ isPhoneBookModalVisible: !this.props.that.state.isPhoneBookModalVisible, isAddPlayerModalVisible: !this.props.that.state.isAddPlayerModalVisible, openPhoneBookFor: type })
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
            SELECTED_GROUP_USERS={this.state.SELECTED_GROUP_USERS}
            user={item}
            userIndex={index}
            that={this}
            thatA={this.props.that}
            selectedItems={null}

        />);
    }
    doneUser = async () => {
        let check = await this.checkValidUsers();
        console.log('checkkk....',check)
        if (check) {
            console.log('valid...')
            this.props.that.updateGamePlayers(this.state.SELECTED_GROUP_USERS)
            
        }else{
            console.log('invalid....')
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
    checkValidUsers = async () => {
        var users = this.state.SELECTED_GROUP_USERS;
        var flag = true;
        var newArray = [];
        return await Promise.all(
            users.map(async (user, index) => {
                console.log('user....',user)
                if(user.id && user.id !== ''){
                    newArray.push(user)
                }else{
                    //console.log(user)
                    user.invalid_username = false;
                    if (!user.generate_temp_id) {
                        if (!user.username || user.username === '') {
                            flag = false;
                            this.showLocalMessage('All contact must have username', 'error')
                            user.invalid_username = true;
                        } else if (!user.is_valid_username) {

                            let check = await isUsernameExist(user)
                            console.log('check:....',check)
                            if (!check) {
                                flag = false;
                                this.showLocalMessage('Username does not exist', 'error')
                                user.invalid_username = true;
                            }else{
                                user.id = check.id;
                                user.name = check.name;
                                user.nickname = check.nickname;
                            }
                        }
                    } else if (!user.generate_temp_id && (!user.username || user.username === '')) {
                        flag = false;
                        this.showLocalMessage('All contact must have username', 'error')
                        user.invalid_username = true;
                    }else if ((!user.name || user.name === '') && (!user.nickname || user.nickname === '')) {
                        flag = false;
                        this.showLocalMessage('Contact must have name or nickname', 'error')
                    } else if (user.name && !isValidName(user.name)) {
                        flag = false;
                        this.showLocalMessage('The Name field must contain only letters.', 'error')
                    } else if (user.generate_temp_id) {

                    } 
                    newArray.push(user)
                }

            })
        ).then(data => {
            console.log('flag....',newArray)
            this.setState({SELECTED_GROUP_USERS: newArray})
            return flag;
        });
        //return flag;
    }

    updateTempStatus(user, index, status) {
        const { SELECTED_GROUP_USERS } = this.state;
        let users = SELECTED_GROUP_USERS;
        users[index].generate_temp_id = status;
        if (status) {
            users[index].username = 'temp_'+randNumber(6);
        }
        this.setState({ SELECTED_GROUP_USERS: users })
        this.forceUpdate()
    }

    userCard(item, index) {
        const { SELECTED_GROUP_USERS } = this.state;
        return (<View key={index} style={[{ flexDirection: 'column', backgroundColor: '#77869E', marginBottom: normalize(25), borderRadius: 10 }]}>

            <View style={[styles.rowFront, { borderRadius: 10, borderBottomRightRadius: 40, backgroundColor: '#FFF' }]}>

                <View style={Styles.tbRow}>
                    <View style={[Styles.tbCol, styles.inputBox]}>
                        <TouchableOpacity

                            style={[styles.inlineInput]}
                            onPress={() => {
                                // this.togglePhoneBook(item, index, 'name');
                            }}>
                            <Image source={Images.user} style={styles.inputIcon} />
                            <TextInput autoCapitalize='words' editable={true} defaultValue={item.name} placeholder="Enter name" maxLength={50} style={styles.inputField} onChangeText={(value) => item.name = value} />

                        </TouchableOpacity>
                    </View>
                    <View style={[Styles.tbCol, styles.inputBox]}>
                        
                        <TouchableOpacity style={[styles.inlineInput, (item.invalid_username) ? Styles.redBorder: null]}>
                            <Image source={Images.user} style={styles.inputIcon} />

                            <TextInput
                                editable={(item.generate_temp_id) ? false : true}
                                onChangeText={value => {
                                    item.username = value;
                                    item.is_valid_username = false;
                                }}
                                onBlur={() => this.checkUsername(item)}

                                returnKeyType='done'
                                autoCapitalize='none'
                                maxLength={50}
                                defaultValue={item.username}
                                placeholder="Enter username" style={styles.inputField} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={Styles.tbRow}>
                    <View style={[Styles.tbCol, styles.inputBox, {width: (!this.props.hideGroupOption) ? '50%' : '100%'}]}>
                        <View style={styles.inlineInput}>
                            <Image source={Images.user} style={styles.inputIcon} />
                            <TextInput
                                autoCapitalize='words'
                                onChangeText={value => {
                                    item.nickname = value;
                                }}
                                value={item.nickname} 
                                placeholder="Nickname" maxLength={50} style={styles.inputField} />

                        </View>
                    </View>
                    {(!this.props.hideGroupOption) ? 
                    <View style={[Styles.tbCol, styles.inputBox]}>
                        <View style={styles.inlineInput}>
                            <Image source={Images.groupIcon} resizeMode="contain" style={styles.inputIcon} />
                            {this.groupDropDown(item, index)}
                        </View>
                    </View>
                    :null}
                </View>

                <View style={[Styles.tbRow, { marginTop: normalize(10) }]}>
                    <View style={[Styles.tbCol, { width: '100%' }]}>
                        {(item.generate_temp_id) ? <TouchableOpacity
                            onPress={() =>
                                //item.generate_temp_id = false
                                this.updateTempStatus(item, index, false)
                            }
                            style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                            <Image source={Images.checked} style={{ height: normalize(20), width: normalize(20) }} /><Text style={[Styles.font14, Styles.fontRegular]}> Auto generate username</Text>
                        </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() =>
                                    //item.generate_temp_id = true
                                    this.updateTempStatus(item, index, true)
                                }
                                style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={Images.unchecked} style={{ height: normalize(20), width: normalize(20) }} /><Text style={[Styles.font14, Styles.fontRegular]}> Auto generate username</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>

            </View>
        </View>);


    }

    render() {
        if (this.state.SELECTED_GROUP_USERS.length > 0) {
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
                                        <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Game Player</Text>
                                    </View>
                                    <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-start' }]}>
                                        <SmallButton onPress={() => {
                                            this.togglePhoneBook({}, 0, 'name');
                                            //this.setState({showCreateUser:true});
                                        }} label="Poker Buddies" fontSize={9} />
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

                                {this.userCard(this.state.SELECTED_GROUP_USERS[0], 0)}

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
        height: normalize(260),
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