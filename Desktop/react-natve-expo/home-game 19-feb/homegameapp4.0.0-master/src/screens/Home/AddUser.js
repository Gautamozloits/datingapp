/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View, TextInput,
    Image, StyleSheet, FlatList, TouchableOpacity, Picker, Dimensions, StatusBar, Modal, OverflowableView, Platform
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import ActionDropdown from '../../components/ActionDropdown';
import { postData, getData, getUserDetail, isValidName, isInvalidUsername, isUsernameExist } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';

import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton, SwipeBtn, GroupButton, GroupUserCount, GroupRemoveButton } from '../../components/Buttons/Button';
import InputScorllListUsers from '../Views/InputScorllListUsers';
import { HeaderBG, HeaderLeftBack, BankerFilter } from '../../components/HeaderOptions';

//import { PhoneBook } from './PhoneBook';
import { PockerBuddies } from '../Comman/PockerBuddies';

import normalize from 'react-native-normalize';
import GroupAssignModal from './GroupAssignModal';
import { CreateGroupModal } from './CreateGroupModal';
import { Loader } from '../../components/Loader'

//import ModalDropdown from 'react-native-modal-dropdown';

import ModalDropdown from './ModalDropdown';


const { width, height } = Dimensions.get('window');
let screen_height = 300;
let header_hight = 50;
if (Platform.OS == 'android') {
    screen_height = height - StatusBar.currentHeight;
    header_hight = StatusBar.currentHeight;
} else {
    screen_height = height;
}
const HEADER_HIGHT = header_hight;
const SCREEN_HEIGHT = screen_height;


class NickName extends React.PureComponent {
    changetext = (text) => {
        this.props.user.nickname = text
        this.forceUpdate()
    }
    render() {
        return (
            //     <View style={{flex: 1}}>
            //     <Text style={{position:'absolute',marginTop:4, marginLeft:4, color:'#77869E'}}>{(!this.props.user.nickname || this.props.user.nickname === '') ? 'Enter nickname' : '' } </Text>
            //     <TextInput onSubmitEditing={this.props.onSubmitEditing} onChangeText={(text) => this.changetext(text)}
            //     value={this.props.user.nickname}
            //     placeholder="" maxLength={50} style={styles.inputField} />
            // </View>
            <TextInput autoCapitalize='words' onBlur={this.props.onBlur} onChangeText={(text) => this.changetext(text)}
                value={this.props.user.nickname}
                placeholder="Enter nickname" maxLength={50} style={styles.inputField} />
        );
    }
}

export default class AddUser extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Add Player</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
            headerBackTitle: " ",
        };
    };

    constructor(props) {
        super(props);
        this.flatListRef = React.createRef();

        this._button2 = null;
        this._button2Frame = null;
        this.handleOnChange = this.handleOnChange.bind(this);

        this.state = {
            loggedInUser: {},
            showIndicator: false,
            showCreateUser: false,
            newUser: { id: 0, name: '', nickname: '', username: '', isVisible: false, groups: [] },
            isPhoneBookModalVisible: false,
            isCreateGroupModalVisible: false,
            groups: [],
            SELECTED_GROUPS: [],
            SELECTED_GROUP_USERS: [],

            selectedGroupUsers: [],
            selectedGroup: {},

            selectedUserForContact: {},
            selectedIndexForContact: null,
            openPhoneBookFor: '',

            switch1Value: false,
            isModalVisible: false,
            selectedItem: null,
            data: [{ key: "key1", label: "label1" }, { key: "key2", label: "label2" }],
            ALL_GROUP_USERS: [],
            mode: 'create',
            route: 'CreateGame',
            groupViewMode: 'View'
        };
    }

    componentDidMount = async () => {

        let user = await getUserDetail();
        this.setState({ loggedInUser: user })
        //this.getselectedGroupUsers('final_score')
        //this.focusListener = this.props.navigation.addListener('didFocus', () => {

        // })
        const { params } = this.props.navigation.state;
        if (params) {
            if (params.mode) {
                this.setState({ mode: params.mode })
            }
            if (params.route) {
                this.setState({ route: params.route })
            }
            
            if (params.users) {
                if (params.users.length > 0) {

                    this.setState({ SELECTED_GROUP_USERS: params.users })
                }
            }
            if (params.groups) {
                if (params.groups.length > 0) {
                    this.setState({ SELECTED_GROUPS: params.groups })
                }
            }
        }
        this.getGroups();

    }

    componentWillUnmount() {
        // this.getGroups();
    }

    switchGroup = (item) => {
        var { SELECTED_GROUPS, SELECTED_GROUP_USERS, groups } = this.state;
        if (SELECTED_GROUPS.includes(item.id)) {
            SELECTED_GROUPS = SELECTED_GROUPS.filter(id => id !== item.id)
        } else {
            SELECTED_GROUPS.push(item.id)
        }

        var group_users = []
        SELECTED_GROUP_USERS.map((user, index) => {
            if (!user.id || user.id === '') {
                group_users.push(user)
            }
        })


        SELECTED_GROUPS.map((id, index) => {
            var group_index = groups.findIndex((value) => {
                return value.id === id;
            })

            if (group_index >= 0) {
                if (index > 0) {
                    if (groups[group_index].users) {
                        groups[group_index].users.map((user, index) => {
                            var user_index = group_users.findIndex((value) => {
                                return value.id === user.id;
                            })
                            if (user_index < 0) {
                                group_users.push(user);
                            }
                        })
                    }

                } else {
                    Array.prototype.push.apply(group_users, groups[group_index].users);
                }

                //Array.prototype.push.apply(group_users, groups[group_index].users); 
            }
        })
        this.setState({ SELECTED_GROUPS: SELECTED_GROUPS, SELECTED_GROUP_USERS: group_users })
    }

    getGroups = () => {
        this.setState({ saveBtn: 'Save', showIndicator: true })
        getData('groups').then(async (res) => {
            console.log(JSON.stringify(res))
            if (res.status) {
                let arr = {};
                let users = []
                if (res.data.length > 0) {
                    arr = res.data[0];
                    users = arr.users;

                    //get all users from all groups
                    let users = [];
                    res.data.map((groups, index) => {
                        Array.prototype.push.apply(users, groups.users);

                    })
                    this.setState({ ALL_GROUP_USERS: users })
                }
                //this.setState({ groups: res.data })
                this.setState({ groups: res.data })
                //this.switchGroup(arr)
            } else {
                ToastMessage(res.message, "error")
            }
            this.setState({ saveBtn: 'Save', showIndicator: false })

        })
    }

    getGroupsData = () => {
        getData('groups').then(async (res) => {
            if (res.status) {
                var { ALL_GROUP_USERS, groups} = this.state;
                let arr = {};
                let users = []
                if (res.data.length > 0) {
                    arr = res.data[0];
                    users = arr.users;

                    //get all users from all groups
                    let users = [];
                    res.data.map((groups, index) => {
                        Array.prototype.push.apply(users, groups.users);

                    })
                    this.setState({ ALL_GROUP_USERS: users })
                   // ALL_GROUP_USERS = users
                }
                //groups = res.data;
                this.setState({ groups: res.data })
                console.log(JSON.stringify(groups))
                //this.switchGroup(arr)
            } else {
                ToastMessage(res.message, "error")
            }

        })
    }

    addNewGroup = (group) => {
        var groups = this.state.groups;
        groups.push(group)
        this.setState(groups);
        this.forceUpdate()

    }
    groupDropDown = (item, index) => {
        return (<ModalDropdown ref="dropdown_2"
            style={styles.dropdown}
            textStyle={styles.dropdown_2_text}
            dropdownStyle={styles.dropdown_2_dropdown}
            groups={this.state.groups}

            data={item.groups}
            SELECTED_GROUP_USERS={this.state.SELECTED_GROUP_USERS}
            user={item}
            userIndex={index}
            that={this}
            selectedItems={this.state.selectedItem}
        />);



    }


    addBlankUser = (type='show') => {
        var { SELECTED_GROUP_USERS, newUser } = this.state
        let dummyUser = { id: '', name: '', nickname: '', username: '', isVisible: false, assign_groups: [], groups: [], type: type };

        let blankUser = JSON.parse(JSON.stringify(dummyUser));
        if (SELECTED_GROUP_USERS.length > 0) {
            SELECTED_GROUP_USERS.unshift(blankUser);
        } else {
            SELECTED_GROUP_USERS.push(blankUser);
        }
        this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS })
        // this.flatListRef.scrollToOffset({x: 0,
        //     y: 0,
        //     animated: true,});

    }

    selectContact = (user, type="single") => {
        console.log('user',user)
        if(type == 'multiple'){
            var { SELECTED_GROUP_USERS, newUser } = this.state
            user.map((usr) => {
                
                var user_index = SELECTED_GROUP_USERS.findIndex((value) => {
                    return value.id === usr.id;
                })
        
                if (user_index > -1) {
                    ToastMessage('This contact already added in list')

                }else{
                    
                    let dummyUser = { id: usr.id, name: usr.name, nickname: usr.nickname, username: usr.username, isVisible: false, assign_groups: [], groups: []};
        
                    let blankUser = JSON.parse(JSON.stringify(dummyUser));
                    if (SELECTED_GROUP_USERS.length > 0) {
                        SELECTED_GROUP_USERS.unshift(blankUser);
                    } else {
                        SELECTED_GROUP_USERS.push(blankUser);
                    }
                    
                }
            })
            this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS })
    
            this.setState({ isPhoneBookModalVisible: !this.state.isPhoneBookModalVisible })

            console.log(type)
        }else{
            var { SELECTED_GROUP_USERS, newUser } = this.state
            var user_index = SELECTED_GROUP_USERS.findIndex((value) => {
                return value.id === user.id;
            })
    
            if (user_index > -1) {
                ToastMessage('This contact already added in list')

            }else{
                
                let dummyUser = { id: user.id, name: user.name, nickname: user.nickname, username: user.username, isVisible: false, assign_groups: [], groups: []};
    
                let blankUser = JSON.parse(JSON.stringify(dummyUser));
                if (SELECTED_GROUP_USERS.length > 0) {
                    SELECTED_GROUP_USERS.unshift(blankUser);
                } else {
                    SELECTED_GROUP_USERS.push(blankUser);
                }
                this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS })
    
                this.setState({ isPhoneBookModalVisible: !this.state.isPhoneBookModalVisible })
            }
            
        }
        
    }
    openPhoneBook = () => {
        // var { SELECTED_GROUP_USERS, newUser } = this.state
        // let dummyUser = { id: '', name: '', nickname: '', username: '', isVisible: false, assign_groups: [], groups: [], type: 'hide' };

        // let blankUser = JSON.parse(JSON.stringify(dummyUser));
        // if (SELECTED_GROUP_USERS.length > 0) {
        //     SELECTED_GROUP_USERS.unshift(blankUser);
        // } else {
        //     SELECTED_GROUP_USERS.push(blankUser);
        // }
        // this.setState({ SELECTED_GROUP_USERS: SELECTED_GROUP_USERS })

        // if (!this.state.isPhoneBookModalVisible) {
        //     this.setState({ selectedUserForContact: dummyUser, selectedIndexForContact: 0, openPhoneBookFor: 'name' })
        // }
        this.setState({ isPhoneBookModalVisible: !this.state.isPhoneBookModalVisible })
    }

    handleOnChange = (text, index) => {
        this.setState(prevState => {
            prevState.SELECTED_GROUP_USERS[index].nickname = text
            return {
                textArray: prevState.textArray
            }
        }, () => console.log(''))
        return false;
    }

    async togglePhoneBook(item, index, type = 'name') {
        if (!this.state.isPhoneBookModalVisible) {
            this.setState({ selectedUserForContact: item, selectedIndexForContact: index, openPhoneBookFor: type })
        }
        this.setState({ isPhoneBookModalVisible: !this.state.isPhoneBookModalVisible })
    }
    async toggleCreateGroup() {
        this.setState({ isCreateGroupModalVisible: !this.state.isCreateGroupModalVisible })
    }

    deleteUser = (index) => {
        var SELECTED_GROUP_USERS = this.state.SELECTED_GROUP_USERS;
        SELECTED_GROUP_USERS.splice(index, 1);
        this.setState(SELECTED_GROUP_USERS)
    }
    doneAddUser = async () => {
        if (this.state.SELECTED_GROUP_USERS.length > 50) {
            ToastMessage('You can not select more than 50 contacts', 'error')
        }else{
            let check = await this.checkValidUsers();
            console.log('checkkk....',check)
            if (check) {
                console.log('valid...')
                this.props.navigation.navigate(this.state.route, { users: this.state.SELECTED_GROUP_USERS, groups: this.state.SELECTED_GROUPS })
            }else{
                console.log('invalid....')
            }
        }
    }

    checkValidUsers = async () => {
        var users = this.state.SELECTED_GROUP_USERS;
        var flag = true;
        var newArray = [];
        return await Promise.all(
            users.map(async (user, index) => {
                if(user.id && user.id !== ''){
                    newArray.push(user)
                }else{
                    //console.log(user)
                    user.invalid_username = false;
                    if ((!user.name || user.name === '') && (!user.nickname || user.nickname === '')) {
                        flag = false;
                        ToastMessage('Contact must have name or nickname', 'error')
                    } else if (user.name && !isValidName(user.name)) {
                        flag = false;
                        ToastMessage('The Name field must contain only letters.', 'error')
                    } else if (user.generate_temp_id) {

                    } else if (!user.generate_temp_id) {
                        if (!user.username || user.username === '') {
                            flag = false;
                            ToastMessage('All contact must have username', 'error')
                            user.invalid_username = true;
                        } else if (!user.is_valid_username) {

                            let check = await isUsernameExist(user)
                            console.log('check:....',check)
                            if (!check) {
                                flag = false;
                                ToastMessage('Username is not exist', 'error')
                                user.invalid_username = true;
                            }

                        }
                    } else if (!user.generate_temp_id && (!user.username || user.username === '')) {
                        flag = false;
                        ToastMessage('All contact must have username', 'error')
                        user.invalid_username = true;
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

    checkUsername = async (user, index) => {
        //this.props.that.setState({ showIndicator: true })
        let params = { 'username': user.username }
        console.log(params)
        postData('check-username', params).then(async (res) => {
            console.log(res)
            const { SELECTED_GROUP_USERS } = this.state;
            let users = SELECTED_GROUP_USERS;

            if (res.status) {

                users[index].id = res.data.id;
                users[index].is_valid_username = true;
                users[index].invalid_username = false;

            } else {
                users[index].is_valid_username = false;
                users[index].invalid_username = true;
                ToastMessage(res.message, 'error')
            }
            this.setState({ SELECTED_GROUP_USERS: users })
            this.forceUpdate()

            //this.props.that.setState({ showIndicator: false })

        })
    }
    __checkValidUsers = () => {
        var users = this.state.SELECTED_GROUP_USERS;
        var flag = true;
        users.map((user, index) => {
            if ((!user.name || user.name === '')  && (!user.nickname || user.nickname === '')) {
                flag = false;
                ToastMessage('All contact must have name or nickname', 'error')
            }else if(user.name && !isValidName(user.name)){
                flag = false;
                ToastMessage('The Name field must contain only letters.', 'error')
            }else if (!user.id && !user.generate_temp_id && (!user.username || user.username === '')) {
                flag = false;
                ToastMessage('All contact must have username', 'error')
            }else if(!user.id && !user.generate_temp_id && user.username){
                let msg = isInvalidUsername(user.username);
                if(msg && msg !== ''){
                    flag = false;
                    ToastMessage(msg, 'error')
                }
            }
        })

        return flag;
    }

    updateGroupUser(user, index) {
        const { loggedInUser } = this.state;
        if (user.id && user.id !== '') {
            let params = { owner_id: loggedInUser.id, user: user };
            postData('update-group-user', params).then(async (res) => {
                if (res.status) {
                    //this.props.that.getGroups();
                    // this.setGroupSelectionLabel()
                    this.getGroupsData()
                    ToastMessage(res.message)
                } else {
                    ToastMessage(res.message, "error")
                }
            })
        }
    }

    updateTempStatus(user, index, status) {
        const { SELECTED_GROUP_USERS } = this.state;
        let users = SELECTED_GROUP_USERS;
        users[index].generate_temp_id = status;
        if(status){
            users[index].username = '';
        }
        this.setState({SELECTED_GROUP_USERS: users})
    }

    
    updateGroupName(item, index) {
        console.log('new name: ',item.name);
        //return false;
        if(item.name == ''){
            ToastMessage('Group name can not be blank', "error")
        }else{
            let params = { id: item.id, name: item.name };
            postData('group/update', params).then(async (res) => {
                if (res.status) {
                    //this.props.that.getGroups();
                    // this.setGroupSelectionLabel()
                    //this.getGroupsData()
                    ToastMessage(res.message)
                } else {
                    ToastMessage(res.message, "error")
                }
            })
        }
    }
    
    removeGroup(id, index) {
        var { groups } = this.state;
        let params = { id: id };
        postData('group/remove', params).then(async (res) => {
            console.log(res)
            if (res.status) {
                groups.splice(index, 1);
                this.setState({groups: groups})
                ToastMessage(res.message)
            } else {
                ToastMessage(res.message, "error")
            }
        })
    }
    

    renderUserCard = () => {
        const { loggedInUser, SELECTED_GROUP_USERS } = this.state;
        return (
            <View style={[{ flexDirection: 'column', backgroundColor: '#77869E', marginBottom: normalize(25), borderRadius: 10 }]}>

                <View style={[styles.rowFront, { borderRadius: 10, borderBottomRightRadius: 40, backgroundColor: '#FFF' }]}>
                    <View style={styles.sNo}>
                        <Text style={[Styles.font13, Styles.fontMedium, Styles.textWhite]}>1</Text>
                    </View>
                    <View style={Styles.tbRow}>
                        <View style={[Styles.tbCol, styles.inputBox]}>
                            <TouchableOpacity style={[styles.inlineInput]}>
                                <Image source={Images.user} style={styles.inputIcon} />
                                <TextInput editable={false} value={loggedInUser.name} placeholder="Name" maxLength={50} style={styles.inputField} />
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.tbCol, styles.inputBox]}>
                            <TouchableOpacity style={[styles.inlineInput]}>
                                <Image source={Images.user} style={styles.inputIcon} />
                                <TextInput editable={false} value={loggedInUser.username} placeholder="Username" maxLength={50} style={styles.inputField} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={Styles.tbRow}>
                        <View style={[Styles.tbCol, styles.inputBox]}>
                            <View style={styles.inlineInput}>
                                <Image source={Images.user} style={styles.inputIcon} />
                                <TextInput editable={false} value={loggedInUser.nickname} placeholder="Nickname" maxLength={50} style={styles.inputField} />
                            </View>
                        </View>
                        <View style={[Styles.tbCol, styles.inputBox]}>
                            <View style={styles.inlineInput}>
                                <Image source={Images.groupIcon} resizeMode="contain" style={styles.inputIcon} />
                                <TextInput editable={false} placeholder="Self" value="All" maxLength={50} style={styles.inputField} />
                            </View>
                        </View>
                    </View>
                    
                </View>
            </View>

        );

    }


    renderCard = (item, index) => {
        const { SELECTED_GROUP_USERS } = this.state;
        //if(item.type !== 'hide'){
            return (
                <View key={index} style={[{ flexDirection: 'column', backgroundColor: '#77869E', marginBottom: normalize(25), borderRadius: 10 }]}>
    
                    <View style={[styles.rowFront, { borderRadius: 10, borderBottomRightRadius: 40, backgroundColor: '#FFF' }]}>
                        <View style={styles.sNo}>
                            <Text style={[Styles.font13, Styles.fontMedium, Styles.textWhite]}>{(SELECTED_GROUP_USERS.length + 1) - index}</Text>
                        </View>
                        <View style={Styles.tbRow}>
                            <View style={[Styles.tbCol, styles.inputBox]}>
                                <TouchableOpacity
    
                                    style={[styles.inlineInput]}
                                    onPress={() => {
                                        //this.togglePhoneBook(item, index, 'name');
                                    }}>
                                    <Image source={Images.user} style={styles.inputIcon} />
                                    
                                    <TextInput 
                                    autoCapitalize='words'
                                    editable={true} 
                                    onChangeText={value => {
                                        item.name = value
                                    }}
                                    defaultValue={item.name} 
                                    placeholder="Enter name" maxLength={50} style={styles.inputField} /> 
                                    
                                </TouchableOpacity>
                            </View>
                            <View style={[Styles.tbCol, styles.inputBox]}>
                                <TouchableOpacity
                                    style={[styles.inlineInput, (item.invalid_username) ? Styles.redBorder: null]}
                                    onPress={() => {
                                        //this.togglePhoneBook(item, index, 'username');
                                    }}>
                                    <Image source={Images.user} style={styles.inputIcon} />
                                   
                                    <TextInput 
                                    editable={(item.generate_temp_id || item.id !== '') ? false : true}
                                    onBlur={() => this.checkUsername(item, index)}
                                    onChangeText={value => {
                                        item.username = value
                                    }}
                                    returnKeyType='done'
                                    autoCapitalize='none'
                                    maxLength={20}
                                    defaultValue={item.username} 
                                    placeholder="Enter username" style={styles.inputField} />
                                </TouchableOpacity>
                            </View>
                        </View>
    
                        <View style={Styles.tbRow}>
                            <View style={[Styles.tbCol, styles.inputBox]}>
                                <View style={styles.inlineInput}>
                                    <Image source={Images.user} style={styles.inputIcon} />
    
                                    <NickName
                                        SELECTED_GROUP_USERS={this.state.SELECTED_GROUP_USERS}
                                        user={item}
                                        nickname={item.nickname}
                                        userIndex={index}
                                        that={this}
                                        onBlur={() => this.updateGroupUser(item, index)}
                                    />
                                </View>
                            </View>
                            <View style={[Styles.tbCol, styles.inputBox]}>
                                <View style={styles.inlineInput}>
                                    <Image source={Images.groupIcon} resizeMode="contain" style={styles.inputIcon} />
                                    {this.groupDropDown(item, index)}
                                </View>
                            </View>
                        </View>
                        {(!item.id || item.id == '') ?
                        <View style={[Styles.tbRow, {marginTop:normalize(10)}]}>
                            <View style={[Styles.tbCol, {width:'100%'}]}>
                                {(item.generate_temp_id) ? <TouchableOpacity 
                                onPress={() => 
                                    //item.generate_temp_id = false
                                    this.updateTempStatus(item, index, false)
                                } 
                                style={[{ flexDirection: 'row', alignItems:'center' }]}>
                                    <Image source={Images.checked}  style={{ height: normalize(20), width: normalize(20) }} /><Text style={[Styles.font14, Styles.fontRegular]}> Auto generate username</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity 
                                onPress={() => 
                                    //item.generate_temp_id = true
                                    this.updateTempStatus(item, index, true)
                                } 
                                style={[{ flexDirection: 'row', alignItems:'center' }]}>
                                    <Image source={Images.unchecked}  style={{ height: normalize(20), width: normalize(20) }} /><Text style={[Styles.font14, Styles.fontRegular]}> Auto generate username</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                        : null}
                        
                    </View>
                </View>
    
            );
        //}
        

    }

    renderView = () => {
        const { showIndicator, selectedGroup, SELECTED_GROUPS, SELECTED_GROUP_USERS, groupViewMode } = this.state;
        return (
            <>
                {/* {showIndicator ? <Loader /> : null} */}
                <CreateGroupModal that={this} isVisible={this.state.isCreateGroupModalVisible} />
                {this.state.isPhoneBookModalVisible ? <PockerBuddies isMultiple={true} that={this} isVisible={this.state.isPhoneBookModalVisible} /> : null}
                <View style={styles.grid}>
                    <View style={{ height: normalize(110) }}>
                        <View style={[{ flexDirection: 'column', marginBottom: normalize(20), borderRadius: 10 }]}>
                            <View style={[Styles.tbRow, { marginBottom: normalize(10), justifyContent:'space-between' }]}>
                                <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontMedium]}>Choose From a Group</Text>

                                <ActionDropdown
                                        options={['View', 'Edit', 'Delete']}
                                        dropdownStyle={Styles.dropdown_2_dropdown}
                                        onSelect={(idx, value) => {
                                            this.setState({groupViewMode: value})
                                        }}
                                    />

                            </View>

                            <View style={[Styles.tbRow]}>
                                <FlatList
                                    horizontal={true}
                                    contentContainerStyle={{ paddingBottom: 10, paddingLeft: 0, paddingRight: 0,paddingTop:10 }}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.groups}
                                    renderItem={({ item, index }) =>
                                        <View style={{ marginRight: 15 }}>
                                            {
                                                (groupViewMode == 'Edit') ? <TextInput
                                                defaultValue={item.name}
                                                onBlur={() => this.updateGroupName(item, index)}
                                                placeholder="Enter Name"
                                                onChangeText={(value) => item.name = value}
                                                maxLength={20}
                                                autoCapitalize='words'
                                                style={[Styles.inputField, { width: '100%', height: normalize(28)}]}
                                            />
                                            : 
                                            <>
                                            <GroupButton borderColor={(SELECTED_GROUPS.includes(item.id)) ? '#2A395B' : '#DFE7F5'} onPress={() => this.switchGroup(item)} label={item.name} />
                                            {(groupViewMode == 'View') ? <GroupUserCount userCount={(item.users) ? item.users.length : 0}/> : <GroupRemoveButton onPress={() => {this.removeGroup(item.id, index)}}/>}
                                            </>
                                            }
                                            
                                           
                                        </View>
                                    }
                                    ListEmptyComponent={<Text style={[Styles.font14, Styles.textGrayLight, Styles.fontRegular]}>No Group created at the moment.</Text>}
                                    keyExtractor={item => Math.random().toString()}
                                />

                            </View>

                            <View style={[Styles.tbRow]}>
                                <View style={[Styles.tbCol, { width: '40%' }]}>
                                    <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontMedium]}>Add Name</Text>
                                </View>
                                <View style={[Styles.tbCol, { width: '40%', alignItems: 'flex-end' }]}>
                                    <SmallButton onPress={() => {
                                        this.openPhoneBook()
                                        //this.setState({showCreateUser:true});
                                    }} label="Poker Buddies" fontSize={9} />
                                </View>

                                <View style={[Styles.tbCol, { width: '20%', alignItems: 'flex-end' }]}>
                                    <SmallButton onPress={() => {
                                        this.addBlankUser()
                                        //this.setState({showCreateUser:true});
                                    }} label="ADD" image={Images.plusIcon} fontSize={9} />
                                </View>


                            </View>



                        </View>
                    </View>
                    <View style={[{ flex: 4 }]}>
                        {/* {this.renderUserCard()} */}
                        {/* {this.newUserCard()}                */}
                        {SELECTED_GROUP_USERS ?
                            <SwipeListView
                                keyboardShouldPersistTaps={'handled'}
                                //listViewRef={this.flatListRef}
                                //ref={(ref) => { this.flatListRef = ref; }}
                                //listViewRef={ref => (this.flatListRef = ref)}
                                listViewRef={(ref) => { this.flatListRef = ref; }}
                                ListFooterComponent={this.renderUserCard()}
                                contentContainerStyle={{ paddingBottom: 120, paddingLeft: 2, paddingRight: 2, paddingTop: normalize(25) }}
                                showsVerticalScrollIndicator={false}
                                data={SELECTED_GROUP_USERS}
                                renderItem={({ item, index }) =>
                                      this.renderCard(item, index) 
                                }
                                renderHiddenItem={({ item, index }) => (
                                    <View style={styles.rowBack}>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => this.deleteUser(index)}
                                        ><Image source={Images.deleteIcon} resizeMode="contain" style={{ height: normalize(18) }} /></TouchableOpacity>
                                    </View>
                                )}
                                //leftOpenValue={120}
                                rightOpenValue={-60}
                                keyExtractor={item => item.id.toString() + Math.random()}
                            />
                            : null}


                    </View>
                    <View style={[Styles.centerText, { marginBottom:20,marginTop:5 }]}>
                        <View style={[Styles.tbRow, Styles.centerText]}>
                            {(SELECTED_GROUP_USERS.length >= 0) ?
                                <SmallButton onPress={() => {
                                    this.doneAddUser()
                                    //this.setState({showCreateUser:true});
                                }} label="Done" fontSize={12} btnStyle={{ width: '30%' }} />
                                : null}



                        </View>
                    </View>



                </View>
            </>
        );
    }
    render() {


        return (
            <InputScorllListUsers styles={{ paddingBottom: 0, backgroundColor: '#F8F9F9' }} children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    sNo: {
        backgroundColor: '#77869E',
        height: normalize(30),
        width: normalize(30),
        borderRadius: 50,
        position: 'absolute',
        zIndex: 10,
        top: -12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdown_2: {
        alignSelf: 'flex-end',
        //width: 150,
        marginTop: 0,
        right: 8,
        borderWidth: 0,
        borderRadius: 3,
        //backgroundColor: 'cornflowerblue',
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


    grid: {
        height: '100%'
    },
    row: {
        width: '100%',
        backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row', padding: 10,
        /* shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        elevation: 5,*/

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
    cardImage: {
        height: normalize(48),
        width: normalize(48),
        borderRadius: 8
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#2A395B',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: normalize(25),
        borderRadius: 10,
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
    }


});