/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */
'use strict';
import React from 'react';
import {
    ScrollView,
    Text,
    View, SafeAreaView,
    Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert, TouchableHighlight, TextInput, StatusBar, Share
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { RFPercentage } from "react-native-responsive-fontsize";
import ActionDropdown from '../../components/ActionDropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { postData, getUserDetail } from '../../api/service';
import { getListContent } from '../../api/serviceHandler';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader'
import { ToastMessage } from '../../components/ToastMessage';
import Styles from '../../styles/Styles';
import Global from '../../../constants/Global';
import Images from '../../../constants/Images';
import { RoundButton, SmallButton, IconButton, PlainIcon } from '../../components/Buttons/Button';
import { HeaderBG, HeaderLeft, HeaderRightNotification } from '../../components/HeaderOptions';
import ContainerFixScreen from './../Views/ContainerFixScreen';
import { MultiGameModal } from './MultiGameModal';
import { SaveGameModal } from './SaveGameModal';
import normalize from 'react-native-normalize';
import moment from "moment";
import { KeyboardAvoidingView } from 'react-native';
//import { TextInput } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

export default class HomeScreen extends React.Component {

    //--g code
    
    shareLink = async () => {
        try {
           
          const result = await Share.share({
            message: this.state.share_link,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
                console.log('shared...1')
              // shared with activity type of result.activityType
            } else {
              // shared
              console.log('shared...2')
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
            console.log('shared...3')
          }
        } catch (error) {
          alert(error.message);
        }
    }

    //--g code

    abortController = new AbortController();

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Home</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerRight: () => <HeaderRightNotification unreadCount={(navigation.getParam('navBar', { unreadCount: 0 }).unreadCount)} onPress={navigation.getParam('notifications')} />,
            headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            searchId: '',
            showSearchResult: false,
            listRecords2: [],
            //list variable
            listRecords: [],
            current_page: 1,
            total_pages: 1,

            //loading status
            is_api_calling: false,//show if api already called
            show_footer_loader: false,// show when next page called
            show_no_record: false, // show when no record in list
            showIndicator: false, // show loader for first time
            refreshing: false, //show loader on pull to refresh


            showMultiGameModal: false,
            showSaveGameModal: false,
            todaysGames: [],

            users: [{ id: 1, name: 'lokesh', image_url: '' }, { id: 2, name: 'lokesh', image_url: '' }, { id: 3, name: 'lokesh', image_url: '' }, { id: 4, name: 'lokesh', image_url: '' }, { id: 5, name: 'lokesh', image_url: '' }],
            dropdownOptions: [],
            //listRecords: [],
            isModalOpen: false,
            modalText: '',
            selectedGameArray: {},
            user: {},
            showModal: true,
        };

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getListData('first');
            this.getNotificationUnreadCount()


        })
        this.getListData('first');
    }

    componentDidMount = async () => {
        this.props.navigation.setParams({ notifications: this.notifications });
        this.socket = Global.THIS_SOCKET;

        this.getAppLinks();

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const { params } = this.props.navigation.state;
            if (params) {
                if(params.view == 'join'){
                    let game_id = params.game_id;
                
                    this.setState({searchId: game_id.toString()})
                        
                    this.searchGame(game_id);
                }
            }
        });

    }


    getAppLinks = () => {
        let params = {};

        postData('getAppLinks', params).then(async (res) => {
            this.setState({share_link: res.share_link})

            // console.log("this is link ", res.share_link)
        })
      }

    notifications = () => {
        console.log('sdkjflsdkjflsdkf jsdlkfj lksd')
        this.props.navigation.navigate('Notifications');
    }

    getNotificationUnreadCount = () => {
        let params = {};

        postData('notifications/unread_count', params).then(async (res) => {
            if (res.status) {
                this.props.navigation.setParams({
                    navBar: {
                        unreadCount: res.unread_count
                    }
                });
            } else {
                ToastMessage(res.message, "error")
            }
        })
    }

    componentWillUnmount() {
        this.focusListener.remove();
        this.abortController.abort();
    }

    getListData = async (type) => {
        let user = await getUserDetail();
        this.setState({ user: user, showSearchResult: false })

        let params = {};
        getListContent('games', params, this, type)
    }

    navigateCreate = () => {
        this.props.navigation.navigate('CreateGame');
    }

    oddsCalc = () => {
        this.props.navigation.navigate("OddsCalc", {});
    };

    editGame = (game) => {
        this.props.navigation.navigate('EditGame', { game: game });
    }

    shareGame = (game) => {
        this.shareLink()
        // this.props.navigation.navigate('EditGame', { game: game });
    }

    deleteGame = (id, index) => {
        this.setState({ showModal: false })
        setTimeout(() => {
            Alert.alert('Home Game', 'Are you sure want to delete this game?', [{
                text: 'Yes', onPress: async () => {
                    this.setState({ showIndicator: true })
                    let params = { game_id: id };

                    postData('game/delete', params).then(async (res) => {
                        if (res.status) {
                            let list = this.state.listRecords;
                            list.splice(index, 1);

                            this.setState({ listRecords: list })
                        } else {
                            ToastMessage(res.message, "error")
                        }
                        this.setState({ showIndicator: false, showModal: true })
                    })
                }
            },
            {
                text: 'Cancel',
                onPress: () => { this.setState({ showModal: true }) },
                style: 'cancel',
            },
            ], { cancelable: false });
        }, 400);

    }

    startTheGame = () => {
        var todaysGames = [];
        var today = moment().format('YYYY-MM-DD');

        this.state.listRecords.map((item, index) => {
            if (item.status === 'Pending' && (item.is_owner === 1 && (today === moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')))) {
                todaysGames.push(item);
            }
        })
        if (todaysGames.length === 1) {
            this.startGame(todaysGames[0].game_id)
        } else if (todaysGames.length > 1) {
            this.setState({ showMultiGameModal: true, todaysGames: todaysGames })
        } else {
            Alert.alert('Home Game', 'Currently there are no game to be start.', [{
                text: 'OK', style: 'cancel', onPress: async () => {
                }
            },
            ], { cancelable: false });
        }
    }

    startGame = (id) => {
        Alert.alert('Home Game', 'Are you sure want to start game?', [{
            text: 'Yes', onPress: async () => {
                this.setState({ showIndicator: true })
                let params = { user_id: this.state.user.id, game_id: id, user: this.state.user };
                this.socket.emit("startGame", params, (res) => {
                    if (res.status) {
                        ToastMessage(res.message)
                        Global.ACTIVE_GAME_IMAGE = Images.activeGame
                        this.props.navigation.navigate('ActiveGame');
                    } else {
                        ToastMessage(res.message, "error")
                    }
                    this.setState({ showIndicator: false })
                })
            }
        },
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        ], { cancelable: false });
    }
    joinGame = (id) => {
        Alert.alert('Home Game', 'Are you sure want to join this game?', [{
            text: 'Yes', onPress: async () => {
                this.setState({ showIndicator: true })

                let params = { game_id: id };

                    postData('game/join', params).then(async (res) => {
                        this.setState({ showIndicator: false, showSearchResult: false , searchId: ''})
                        if (res.status) {
                            ToastMessage(res.message, "success")
                            this.getListData('first');
                        } else {
                            ToastMessage(res.message, "error")
                        }
                        
                    })
            }
        },
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        ], { cancelable: false });
    }

    
    viewGame = (item) => {
        if (item.is_banker) {
            this.props.navigation.navigate('BuyIN', { game_id: item.game_id });
        } else {
            this.props.navigation.navigate('BuyINNonBanker', { game_id: item.game_id });
        }
    }

    openSaveGameModal = (item, index) => {
        this.setState({ showModal: false })
        setTimeout(() => {
            this.setState({ showSaveGameModal: true, selectedGameArray: { game_id: item.game_id, index: index } })
        }, 400);
    }

    saveGame = (gameTitle) => {

        this.setState({ showIndicator: true, showModal: true })
        let params = { game_id: this.state.selectedGameArray.game_id, sub_title: gameTitle };

        postData('game/save', params).then(async (res) => {
            if (res.status) {
                var listRecords = this.state.listRecords;
                listRecords[this.state.selectedGameArray.index]['saved_game_id'] = res.saved_game_id;
                this.setState({ listRecords: listRecords, showSaveGameModal: false })
                ToastMessage(res.message)
            } else {
                ToastMessage(res.message, "error")
            }
            this.setState({ showIndicator: false })
        })


    }

    userRow = (item, index) => {
        return (<TouchableOpacity
            activeOpacity={Styles.touchOpacity}
        //onPress={() => { (item.is_banker === 0 && item.current_status === 'Start') ? selectUser(item.game_user_id, item) : showLocalMessage('To leave the game, please assign someone else the banker') }}
        >
            <View key={index} style={[styles.rowFront, styles.activeRow]}>

                <View style={[Styles.tbCol, { width: '20%', flexDirection: 'row', alignItems: 'center' }]}>
                    <Image source={(item.image && item.image !== '') ? { uri: Global.ROOT_PATH + item.image } : Images.userImage} style={styles.cardImage} />
                    {(item.is_banker == 1) ? <View style={[Styles.shadow5, { borderRadius: 50, position: 'absolute', right: -5 }]}><Image source={Images.bankerIcon} style={{ height: normalize(20), width: normalize(20) }} /></View> : null}
                </View>

                <View style={[Styles.tbCol, { width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                    <Text style={[Styles.font16, Styles.fontRegular, Styles.textPrimaryDark, { marginLeft: 10 }]} numberOfLines={2}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>)
    }
    userToolTipView = (players) => {

        return (<View style={{ padding: 8, backgroundColor: '#FFF' }}>
            <Text style={[Styles.font16, Styles.fontRegular, Styles.textPrimaryDark, { paddingBottom: 5 }]}>Total Players: {players.length}</Text>
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: '#FFF', paddingBottom: 10 }}
                data={players}
                renderItem={({ item, index }) =>
                    this.userRow(item, index)
                }
                keyExtractor={item => Math.random().toString()}
                ListFooterComponent={<View style={{ margin: 10, }} />}
            />
        </View>)

    }

    showHideUserTooltip = (item, index) => {
        const { listRecords } = this.state;
        listRecords[index]['is_tooltip_visible'] = !listRecords[index]['is_tooltip_visible'];
        this.setState({ listRecords: listRecords })
    }

    searchGame = (game_id = '') => {
        if(game_id == ''){
            game_id = this.state.searchId
        }
        console.log('this.state.searchId: ',game_id)
        this.setState({ showIndicator: true })
        let params = { game_id:  game_id};
        console.log(params)
        postData('guest-games', params).then(async (res) => {
            if (res.status) {
                console.log(JSON.stringify(res))
                // var listRecords = this.state.listRecords;
                // listRecords[this.state.selectedGameArray.index]['saved_game_id'] = res.saved_game_id;
                this.setState({ listRecords2: res.data, showSearchResult: true })
                //ToastMessage(res.message)
            } else {
                ToastMessage(res.message, "error")
            }
            this.setState({ showIndicator: false })
        })

    }
    renderList = (item, index) => {
        const { listRecords, showModal } = this.state;
        var options = ['View'];
        if (item.is_owner && item.status === 'Pending') {
            if (item.is_schedule_game == 1) {
                options = ['Delete'];
            } else {
                options = ['Edit', 'Delete', 'Share'];
            }

            if (!item.saved_game_id || item.saved_game_id == '') {
                options.push('Save');
            }
        }
        var dropdownOptions = options;

        return (
            <>

                <View key={'game_' + index} style={{ paddingTop: normalize(15), paddingBottom: normalize(15) }}>
                    <View style={[Styles.tbRow]}>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '30%', justifyContent: 'center' }]}>
                            <View style={[styles.imgContainer]}>
                                <Image source={(item.image && item.image !== "") ? { uri: Global.ROOT_PATH + item.image } : Images.demo} style={styles.gameImage} />
                                <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimary, { marginTop: 3 }]}>GameID: {item.game_id}</Text>
                            </View>
                        </View>
                        <View style={[Styles.tbCol, { width: '70%', paddingRight: normalize(10) }]}>
                            <View style={[Styles.tbRow, { justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[Styles.tbCol, { borderRightWidth: 1, borderRightColor: '#DFE7F5' }]}>
                                        <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular, Styles.centerText, { paddingRight: normalize(5), }]}>{moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                    </View>
                                    <View style={[Styles.tbCol]}>
                                        <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontRegular, { paddingLeft: normalize(5) }]}>{moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')}</Text>
                                    </View>

                                </View>
                                <View style={[{ flexDirection: 'row', alignSelf: 'flex-end' }]}>

                                    {(item.is_owner && item.status === 'Pending') ? <ActionDropdown
                                        showModal={showModal}
                                        options={dropdownOptions}
                                        dropdownStyle={Styles.dropdown_2_dropdown}
                                        onSelect={(idx, value) => {
                                            if (item.is_owner && item.status === 'Pending') {
                                                if (value === 'Edit') {
                                                    this.editGame(item)
                                                } else if (value === 'Delete') {
                                                    this.deleteGame(item.game_id, index)
                                                } else if (value === 'Save') {
                                                    this.openSaveGameModal(item, index)
                                                } else if (value === 'Share') {
                                                    this.shareGame(item)
                                                }
                                            } else {
                                                if (value === 'View') {
                                                    this.viewGame(item)
                                                }
                                            }
                                        }
                                        }
                                    /> : null}

                                </View>
                            </View>


                            <View>
                                <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontBold]}>{item.title}</Text>
                                <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontMedium]}>@{item.location}</Text>

                                <Text numberOfLines={2} style={[Styles.textGrayLight, Styles.font12, Styles.fontRegular, { marginTop: normalize(5) }]}>{item.note}</Text>
                            </View>

                            <View style={[Styles.tbRow, { marginTop: normalize(5) }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular]}>Created by:</Text><Text style={[Styles.textGrayLight, Styles.font12, Styles.fontRegular, Styles.title]}> {item.owner_name}</Text>
                                </View>
                            </View>



                        </View>

                    </View>
                    <View style={[Styles.tbRow, Styles.centerText, { marginTop: normalize(5), }]}>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '30%' }]}>
                            {(item.is_owner && item.status === 'Pending') ? (moment().format('YYYY-MM-DD') === moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) ? <SmallButton onPress={() => this.startGame(item.game_id, index)} label="Start" fontSize={12} btnStyle={{ width: '80%' }} /> : <SmallButton label="Start" fontSize={12} btnStyle={{ width: '80%' }} startColor='#DCDCDC' endColor='#808080' /> : null}

                        </View>
                        <View style={[Styles.tbCol, { width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }]}>

                            <Tooltip
                                animated={true}
                                backgroundColor="rgba(0,0,0,0)"
                                isVisible={item['is_tooltip_visible']}
                                content={this.userToolTipView(item.users)}
                                contentStyle={[Styles.shadow5, { padding: 0, width: '80%' }]}
                                arrowSize={{ width: 16, height: 8 }}
                                placement="top"
                                allowChildInteraction={false}
                                showChildInTooltip={false}
                                onClose={() => this.showHideUserTooltip(item, index)}
                            >
                                <TouchableHighlight style={{ width: '100%' }} onPress={() => { this.showHideUserTooltip(item, index); }}>

                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ padding: 5, paddingRight: 10 }}
                                        style={{ width: '100%' }}
                                    >

                                        {item.users.map((user, key) => {
                                            if (key <= 4) {
                                                return (
                                                    <View style={styles.userCard} key={'user_' + key}>
                                                        <Image source={(user.image && user.image !== '') ? { uri: Global.ROOT_PATH + user.image } : Images.userImage} style={[styles.userImg]} blurRadius={(item.users.length > 4 && key == 4) ? 3 : 0} />
                                                        {(item.users.length > 4 && key == 4) ?
                                                            <View style={[Styles.centerText, { position: 'absolute', borderRadius: 50, width: normalize(20) }]}>
                                                                <View style={{ zIndex: 1 }}>
                                                                    <PlainIcon name="dots-three-horizontal" type="Entypo" color="#FFF" fontSize={16} />
                                                                </View>
                                                            </View>
                                                            : null}

                                                    </View>
                                                )
                                            }

                                        })}

                                    </ScrollView>
                                </TouchableHighlight>
                            </Tooltip>
                            <View style={{ width: '45%', flexDirection: 'row' }}>
                                <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular, { marginLeft: 10 }]}>Total Players:</Text><Text style={[Styles.textGrayLight, Styles.font12, Styles.fontRegular]}> {item.user_count}</Text>
                            </View>

                        </View>
                    </View>

                </View>
                {listRecords.length > index + 1 ? <Image source={Images.bottomBorder} style={Styles.bottomBorderFullImage} /> : null}
            </>
        );
    }

    renderItem = (item, index) => {
        const { listRecords2, showModal } = this.state;


        return (
            <>

                <View key={'game_' + index} style={{ paddingTop: normalize(15), paddingBottom: normalize(15) }}>
                    <View style={[Styles.tbRow]}>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '30%', justifyContent: 'center' }]}>
                            <View style={[styles.imgContainer]}>
                                <Image source={(item.image && item.image !== "") ? { uri: Global.ROOT_PATH + item.image } : Images.demo} style={styles.gameImage} />
                                <Text style={[Styles.font12, Styles.fontRegular, Styles.textPrimary, { marginTop: 3 }]}>GameID: {item.game_id}</Text>
                            </View>
                        </View>
                        <View style={[Styles.tbCol, { width: '70%', paddingRight: normalize(10) }]}>
                            <View style={[Styles.tbRow, { justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[Styles.tbCol, { borderRightWidth: 1, borderRightColor: '#DFE7F5' }]}>
                                        <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular, Styles.centerText, { paddingRight: normalize(5), }]}>{moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                    </View>
                                    <View style={[Styles.tbCol]}>
                                        <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontRegular, { paddingLeft: normalize(5) }]}>{moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')}</Text>
                                    </View>

                                </View>

                            </View>


                            <View>
                                <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontBold]}>{item.title}</Text>
                                <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontMedium]}>@{item.location}</Text>

                                <Text numberOfLines={2} style={[Styles.textGrayLight, Styles.font12, Styles.fontRegular, { marginTop: normalize(5) }]}>{item.note}</Text>
                            </View>

                            <View style={[Styles.tbRow, { marginTop: normalize(5) }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular]}>Created by:</Text><Text style={[Styles.textGrayLight, Styles.font12, Styles.fontRegular, Styles.title]}> {item.owner_name}</Text>
                                </View>
                            </View>



                        </View>

                    </View>
                    <View style={[Styles.tbRow, Styles.centerText, { marginTop: normalize(5), }]}>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '30%' }]}>
                            {(!item.game_user_id || item.game_user_id == '') ? <SmallButton onPress={() => this.joinGame(item.game_id, index)} label="Join" fontSize={12} btnStyle={{ width: '80%' }} />  : null}

                        </View>
                        <View style={[Styles.tbCol, { width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }]}>

                            <Tooltip
                                animated={true}
                                backgroundColor="rgba(0,0,0,0)"
                                isVisible={item['is_tooltip_visible']}
                                content={this.userToolTipView(item.users)}
                                contentStyle={[Styles.shadow5, { padding: 0, width: '80%' }]}
                                arrowSize={{ width: 16, height: 8 }}
                                placement="top"
                                allowChildInteraction={false}
                                showChildInTooltip={false}
                                onClose={() => this.showHideUserTooltip(item, index)}
                            >
                                <TouchableHighlight style={{ width: '100%' }} onPress={() => { this.showHideUserTooltip(item, index); }}>

                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ padding: 5, paddingRight: 10 }}
                                        style={{ width: '100%' }}
                                    >

                                        {item.users.map((user, key) => {
                                            if (key <= 4) {
                                                return (
                                                    <View style={styles.userCard} key={'user_' + key}>
                                                        <Image source={(user.image && user.image !== '') ? { uri: Global.ROOT_PATH + user.image } : Images.userImage} style={[styles.userImg]} blurRadius={(item.users.length > 4 && key == 4) ? 3 : 0} />
                                                        {(item.users.length > 4 && key == 4) ?
                                                            <View style={[Styles.centerText, { position: 'absolute', borderRadius: 50, width: normalize(20) }]}>
                                                                <View style={{ zIndex: 1 }}>
                                                                    <PlainIcon name="dots-three-horizontal" type="Entypo" color="#FFF" fontSize={16} />
                                                                </View>
                                                            </View>
                                                            : null}

                                                    </View>
                                                )
                                            }

                                        })}

                                    </ScrollView>
                                </TouchableHighlight>
                            </Tooltip>
                            <View style={{ width: '45%', flexDirection: 'row' }}>
                                <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular, { marginLeft: 10 }]}>Total Players:</Text><Text style={[Styles.textGrayLight, Styles.font12, Styles.fontRegular]}> {item.user_count}</Text>
                            </View>

                        </View>
                    </View>

                </View>
                {listRecords2.length > index + 1 ? <Image source={Images.bottomBorder} style={Styles.bottomBorderFullImage} /> : null}
            </>
        );
    }


    renderView = () => {
        const { listRecords, showIndicator, refreshing, show_footer_loader, show_no_record, showMultiGameModal, showSaveGameModal, showSearchResult, listRecords2 } = this.state;
        return (
            <>
                {showIndicator ? <Loader /> : null}
                <View style={{ flex: 1, flexDirection: 'column', height: height }}>
                    <View style={styles.topSection} >
                        <View style={[Styles.tbRow, styles.gridCol, { flex: 1 }]}>
                            <View style={[Styles.tbCol, styles.gridWidth]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateScheduleGame')}>
                                    <ImageBackground source={Images.homeGrid1} style={styles.gridBGImage} resizeMode="contain">
                                        <Text style={[Styles.textWhite, Styles.fontBold, Styles.font14, { textAlign: 'center' }]}>SCHEDULE{'\n'}GAME</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>

                            <View style={[Styles.tbCol, styles.gridWidth]}>
                                <TouchableOpacity onPress={() => this.navigateCreate()}>
                                    <ImageBackground source={Images.homeGrid3} style={styles.gridBGImage} resizeMode="contain">
                                        <Text style={[Styles.textWhite, Styles.fontBold, Styles.font14, { textAlign: 'center' }]}>CREATE{'\n'}GAME</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>

                            {/* <View style={[Styles.tbCol, styles.gridWidth]}>
                                <TouchableOpacity onPress={() => this.startTheGame()}>
                                    <ImageBackground source={Images.homeGrid1} style={styles.gridBGImage} resizeMode="contain">
                                        <Text style={[Styles.textWhite, Styles.fontBold, Styles.font14, { textAlign: 'center' }]}>START{'\n'}GAME</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View> */}

                            {/* <View style={[Styles.tbCol, styles.gridWidth]}>
                                <ImageBackground source={Images.homeGrid2} style={styles.gridBGImage} resizeMode="contain">
                                    <Text style={[Styles.textWhite, Styles.fontBold, Styles.font14, { textAlign: 'center', flexWrap: 'wrap' }]}>END{'\n'}GAME</Text>
                                </ImageBackground>
                            </View> */}


                            <View style={[Styles.tbCol, styles.gridWidth]}>

                                <TouchableOpacity onPress={() => this.oddsCalc()}>
                                    <ImageBackground source={Images.homeGrid2} style={styles.gridBGImage} resizeMode="contain">
                                        <Text style={[Styles.textWhite, Styles.fontBold, Styles.font14, { textAlign: 'center' }]}>ODDS{'\n'}CALCULATOR</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>
                    <View style={styles.middleSection}>

                        <View style={{ flex: 1 }}>
                            <View style={{ borderTopLeftRadius: normalize(10), borderTopRightRadius: normalize(10), overflow: 'hidden' }}>
                                <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', height: normalize(45) }]}>
                                    <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                        <View style={[Styles.tbCol, { width: '50%', padding: normalize(10) }]}>
                                            <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16]}>Upcoming Games</Text>
                                        </View>
                                        <View style={[Styles.tbCol, {
                                            width: '50%',
                                            paddingTop: normalize(5),
                                            paddingBotttom: normalize(5),
                                            paddingLeft: normalize(5),
                                            paddingRight: normalize(10)
                                        }]}>
                                            <View style={{ borderColor: '#FFF', borderWidth: 1, borderRadius: 5 , flexDirection:'row', alignItems:'center'}}>
                                                <TextInput
                                                    onBlur={() => this.searchGame()}
                                                    defaultValue={this.state.searchId}
                                                    value={this.state.searchId}
                                                    onChangeText={(text) => this.setState({ searchId: text })}
                                                    keyboardType={"numeric"}
                                                    returnKeyType='done'
                                                    placeholder="Search Game ID" placeholderTextColor="#FFF" style={{ padding: 5, height: normalize(30), color: '#FFFFFF' }} />
                                                    {(showSearchResult) ? <IconButton onPress={() => this.setState({showSearchResult: false, searchId: ''})} name="times" color="#FFFFFF" type="FontAwesome5" fontSize={20} 
                                                    style={{
                                                        right: -20
                                                    }}/> : null}
                                            </View>

                                        </View>
                                    </View>

                                </LinearGradient>
                            </View>
                            <View style={styles.innerSection}>

                                {(showSearchResult) ?
                                    <FlatList
                                        data={listRecords2}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}
                                        keyExtractor={item => item.game_id.toString() + Math.random()}
                                        ListEmptyComponent={() => <NoRecord visible={true} />}

                                    />
                                    :
                                    <FlatList
                                        data={listRecords}
                                        renderItem={({ item, index }) => this.renderList(item, index)}
                                        keyExtractor={item => item.game_id.toString() + Math.random()}
                                        ListFooterComponent={() => <LoaderFooter visible={show_footer_loader} />}
                                        ListEmptyComponent={() => <NoRecord visible={show_no_record} />}
                                        onRefresh={() => {
                                            this.getListData('refresh');
                                        }}
                                        refreshing={refreshing}
                                        onEndReached={() => {
                                            this.getListData('loadmore');
                                        }}
                                    />
                                }
                            </View>
                        </View>
                    </View>
                </View>
                {showMultiGameModal ? <MultiGameModal that={this} /> : null}
                {showSaveGameModal ? <SaveGameModal that={this} /> : null}
            </>
        );
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0} behavior="height" enabled>
                <LinearGradient colors={["#2A395B", "#080B12"]} start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <StatusBar translucent={true} backgroundColor={'transparent'} />
                </LinearGradient >

                {/* <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} /> */}

                <View style={[Styles.container, { padding: 20, backgroundColor: '#FFFFFF' }]}>
                    {this.renderView()}
                </View>

            </KeyboardAvoidingView>
        );
        return (
            <ContainerFixScreen styles={{ paddingTop: normalize(5) }} children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    topSection: { width: '100%', height: RFPercentage(15), paddingTop: 0 },
    middleSection: {
        width: '100%',
        flex: 5,
        paddingTop: 0,
        paddingBottom: normalize(75),
    },
    innerSection: {
        paddingBottom: normalize(20),
        backgroundColor: '#FFF',
        flex: 1,
        height: '100%',
        borderBottomLeftRadius: normalize(10),
        borderBottomRightRadius: normalize(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    gameRow: {
        padding: normalize(20)
    },
    gridCol: {
        height: normalize(15),
        justifyContent: 'space-between',
    },
    gridBGImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gridWidth: {
        width: '31%'
    },
    imgContainer: {
        width: '100%',
        height: normalize(70),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        padding: normalize(5),
    },
    gameImage: {
        width: normalize(70),
        height: normalize(70),
        borderRadius: 10
    },
    userCard: {
        backgroundColor: 'transparent',
        width: normalize(24),
        height: normalize(24),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(-6),
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: normalize(5),
        backgroundColor: 'transparent'
    },
    userImg: {
        width: normalize(20),
        height: normalize(20),
        borderRadius: 50
    },
    rowFront: { flexDirection: 'row', marginBottom: normalize(5), borderRadius: 10, flex: 1, padding: 5 },
    activeRow: { backgroundColor: '#FFF' },
    cardImage: {
        height: normalize(35),
        width: normalize(35),
        borderRadius: 50
    },

});