/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    StyleSheet, Dimensions
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";
import normalize from 'react-native-normalize';
import { ImageModal } from '../../components/ImageModal';
import { Loader } from '../../components/Loader';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { RoundButton, SmallButton } from '../../components/Buttons/Button';
import { HeaderBG, HeaderLeftBack, HeaderRightNotification } from '../../components/HeaderOptions';
import InputScorllList from './../Views/InputScorllList';
import { ScrollView } from 'react-native-gesture-handler';
import { LocationGame } from '../Home/LocationGame'
import { OptionModal } from '../Home/OptionModal'
import { postWithFile, getUserDetail, postData } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';
import { LoadGameModal } from './LoadGameModal'
import { DatePicker } from '../../components/DatePicker';

const { width, height } = Dimensions.get('window');

export default class EditGame extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>Edit Game</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerBackImage: () => <HeaderLeftBack />,
            headerBackTitle: " ",
        };
    };



    constructor(props) {
        super(props);

        this.state = {
            game_id: '',
            title: '',
            date: moment().add(10, 'minutes').format('DD-MM-YYYY hh:mm A'),
            gameLocation: '',
            options: { game_value: 'full', other_value: 0, showdown: 0, initial_buy_in: 0, blinds: 0, is_filled: '' },
            optionTitle: '',
            users: [],
            groups: [],
            userSelected: '',
            note: '',
            pickedImage: null,
            selectedImage: '',

            listRecords: [{ id: 1, name: 'lokesh', image_url: '' }, { id: 2, name: 'lokesh', image_url: '' }, { id: 3, name: 'lokesh', image_url: '' }, { id: 4, name: 'lokesh', image_url: '' }, { id: 5, name: 'lokesh', image_url: '' }],
            isModalOpen: false,
            isOptionModalVisible: false,
            isLocationModalVisible: false,
            isLoadGameModalVisible: false,
            modalText: '',
            isVisible: false,
            autoFocus: false,
            createBtn: 'UPDATE',
            isModalVisible: false,
            loading: false,
            loggedInUser: {},
            savedGames: []


        };

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const { params } = this.props.navigation.state;
            if (params) {
                if (params.game) {
                }
                if (params.game && this.state.game_id == '') {
                    this.getGame(params.game.game_id)
                }
                if (params.users) {
                    if (params.users.length > 0) {
                        let text = this.setUserSelectionLabel(params.users);
                        this.setState({ users: params.users, userSelected: text })
                        setTimeout(() => {
                            this.setState({ autoFocus: true });
                        }, 100)
                    }
                }
                if (params.groups) {
                    if (params.groups.length > 0) {
                        this.setState({ groups: params.groups })
                    }
                }
            }

        })
    }

    componentDidMount = async () => {



        // this.getSavedGame();
    }
    getGame = async (id) => {
        let params = { game_id: id }
        postData('edit-game', params).then(async (res) => {
            if (res.status) {
                this.selectGame(res.data);

                if (res.data.users.length > 0) {
                    let text = this.setUserSelectionLabel(res.data.users);
                    this.setState({ users: res.data.users, userSelected: text })
                    setTimeout(() => {
                        this.setState({ autoFocus: true });
                    }, 100)
                }
            }
        })
    }
    getSavedGame = () => {
        let params = {};

        postData('saved-game', params).then(async (res) => {
            if (res.status) {
                this.setState({ savedGames: res.data })
            }
        })
    }
    selectGame = async (game) => {
        let user = await getUserDetail();
        this.setState({ loggedInUser: user })

        if (game) {
            if (game.users.length > 0) {
                let user_id = this.state.loggedInUser.id;
                var user_index = game.users.findIndex((value) => {
                    return value.id === user_id;
                })
                let gameUsers = game.users;
                gameUsers.splice(user_index, 1);
                let text = this.setUserSelectionLabel(game.users);
                this.setState({ users: game.users, userSelected: text })
            }
            this.setOptionSelectionLabel(JSON.parse(game.options))

            this.setState({ game_id: game.game_id, title: game.title, gameLocation: game.location, options: JSON.parse(game.options), note: game.note, date: moment(game.date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A') })

            setTimeout(() => {

                this.setState({ autoFocus: true });
            }, 100)
        }
    }

    setUserSelectionLabel(users) {
        let loggedInUser = this.state.loggedInUser;
        let count = users.length;
        let strArray = [];
        let endStr = '';


        if (loggedInUser.nickname && loggedInUser.nickname !== '') {
            strArray.push(loggedInUser.nickname);
        } else {
            strArray.push(loggedInUser.name);
        }

        if (users.length > 1) {
            count = 1;
            endStr = users.length - 1
            endStr = '     +' + endStr;
        } else {
            //strArray.push(loggedInUser.name);
        }


        for (let i = 0; i < count; i++) {
            if (users[i].nickname && users[i].nickname !== '') {
                strArray.push(users[i].nickname);
            } else {
                strArray.push(users[i].name);
            }


        }
        let str = strArray.join(', ');
        return str + endStr;
    }

    setOptionSelectionLabel(options) {
        let title = '';
        if (options.game_value) {
            title += (options.game_value === 'full') ? 'full value, ' : 'half value, ';
        }
        if (options.initial_buy_in) {
            title += 'initial buy in:' + options.initial_buy_in;
        }

        //title += 'Game';
        if (options.showdown) {
            title += ', showdown:' + options.showdown;
        }
        if (options.othervalue) {
            title += ', other:' + options.othervalue;
        }
        if (options.blinds) {
            title += ', blinds:' + options.blinds;
        }
        this.setState({ optionTitle: title });
    }

    setLocation = (location) => {
        this.setState({ gameLocation: location })
    }

    toggleOption = (options) => {
        if (options && this.state.isOptionModalVisible) {
            this.setOptionSelectionLabel(options)
            this.setState({ options: options });
            setTimeout(() => {
                this.setState({ isOptionModalVisible: !this.state.isOptionModalVisible })
            }, 200)

        } else {
            this.setState({ isOptionModalVisible: !this.state.isOptionModalVisible })
        }



    }
    toggleLocation = () => {
        this.setState({ isLocationModalVisible: !this.state.isLocationModalVisible })
    }

    createGame = () => {
        if (this.checkValidForm()) {
            this.setState({ loading: true })
            const data = new FormData();
            let title = '';
            if (this.state.options.initial_buy_in) {
                title += this.state.options.initial_buy_in + ' ';
            }
            if (this.state.options.game_value) {
                title += (this.state.options.game_value === 'full') ? 'full value ' : 'half value ';
            }

            title += 'Game';
            if (this.state.options.showdown) {
                title += ' - ' + this.state.options.showdown + ' showdown';
            }

            data.append('game_id', this.state.game_id);
            data.append('title', title);
            data.append('date', moment(this.state.date, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD HH:mm:ss'));
            data.append('location', this.state.gameLocation);
            data.append('options', JSON.stringify(this.state.options));
            data.append('users', JSON.stringify(this.state.users));
            data.append('note', this.state.note);
            if (this.state.pickedImage) {
                data.append('image', this.state.pickedImage);
            }
            this.setState({ createBtn: 'UPDATING...' })
            postWithFile('game/update', data).then(async (res) => {
                this.setState({ createBtn: 'UPDATE' })
                if (res.status) {
                    ToastMessage(res.message)
                    this.props.navigation.navigate('Home')
                } else {
                    ToastMessage(res.message, "error")
                }
            })
        }

    }

    checkValidForm() {
        if (this.state.gameLocation === '') {
            ToastMessage('Please enter location', 'error')
            return false;
        } else if (this.state.options.is_filled === '') {
            ToastMessage('Please select options', 'error')
            return false;
        } else if (this.state.users.length == 0) {
            ToastMessage('Please select user', 'error')
            return false;
        }
        return true;
    }

    openModal = () => {
        this.setState({ isModalVisible: true });
    }
    skipModal() {
        this.setState({ isModalVisible: false });
    }

    renderView = () => {
        const { isModalVisible, loading } = this.state;
        return (
            <>
                <View style={{ flex: 1, flexDirection: 'column', height: height }}>
                    {(loading) ? <Loader /> : null}
                    <View style={styles.middleSection}>
                        <View style={{ flex: 1, paddingBottom: 10 }}>
                            <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' }}>
                                <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', padding: 12, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <Text style={[Styles.textWhite, Styles.fontMedium, Styles.font16]}>Edit Game</Text>
                                    <View style={[Styles.tbCol, { width: '30%', justifyContent: 'flex-end', alignItems: 'flex-end' }]}>

                                    </View>
                                </LinearGradient>
                            </View>
                            <ScrollView style={[styles.innerSection, { paddingLeft: 15, paddingRight: 15 }]}>

                                <View style={[Styles.formGroup, { marginTop: normalize(25) }]}>
                                    <DatePicker default_date={this.state.date ? this.state.date : new Date()} required={true} that={this} date_key="date" iconLeftName={Images.dateRangeIcon} />
                                    {/* <FloatingLabel
                                        style={{ borderBottomColor: '#DFE7F5' }}
                                        editable={false}
                                        required={true}
                                        date={this.state.date ? this.state.date : new Date()}
                                        mode="datetime"
                                        placeholder="select date"
                                        format="DD-MM-YYYY hh:mm A"
                                        minDate={new Date(Date.now() + (10 * 60 * 1000))}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"

                                        labelStyle={[Styles.fontRegular, Styles.font14]}
                                        icon={Images.dateRangeIcon}
                                        maxLength={70}
                                        onChangeText={value => {
                                            if (moment(value, 'DD-MM-YYYY hh:mm A').format('X') < moment().add(10, 'minutes').format('X')) {
                                                ToastMessage('Please select date time greater then 10 minutes from now.', 'error');
                                            } else {
                                                this.setState({ date: moment(value, 'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A') });
                                            }
                                        }}

                                        refer='Date'
                                        isDate={true}
                                        other={true}
                                    >Date</FloatingLabel> */}
                                </View>
                                <View style={[Styles.formGroup]}>
                                    <FloatingLabel
                                        style={{ borderBottomColor: '#DFE7F5' }}
                                        icon={Images.locationOnIcon}
                                        autoFocus={this.state.autoFocus}
                                        maxLength={50}
                                        onPress={() => this.toggleLocation()}
                                        refer='location'
                                        required={true}
                                        value={this.state.gameLocation}
                                        labelStyle={[Styles.fontRegular, Styles.font14]}
                                        autoCapitalize='none'
                                        other={true}
                                    >Location</FloatingLabel>
                                </View>

                                <View style={[Styles.formGroup]}>
                                    <FloatingLabel
                                        style={{ borderBottomColor: '#DFE7F5' }}
                                        icon={Images.user}
                                        maxLength={50}
                                        onPress={() => this.props.navigation.navigate('AddUser', { users: this.state.users, groups: this.state.groups, mode: 'edit', route: 'EditGame' })}
                                        refer='location'
                                        required={true}
                                        autoFocus={this.state.autoFocus}
                                        value={this.state.userSelected}
                                        labelStyle={[Styles.fontRegular, Styles.font14]}
                                        autoCapitalize='none'
                                        other={true}
                                    >Add Players</FloatingLabel>
                                </View>

                                <View style={[Styles.formGroup]}>
                                    <FloatingLabel
                                        style={{ borderBottomColor: '#DFE7F5' }}
                                        icon={Images.optionsIcon}
                                        maxLength={50}
                                        onPress={() => this.toggleOption()}
                                        value={this.state.optionTitle}
                                        required={true}
                                        refer='Option'
                                        labelStyle={[Styles.fontRegular, Styles.font14]}
                                        autoCapitalize='none'
                                        autoFocus={this.state.autoFocus}
                                        other={true}
                                    >Options</FloatingLabel>
                                </View>

                                {/* <View style={[Styles.formGroup]}>
                                    <FloatingLabel
                                        style={{ borderBottomColor: '#DFE7F5' }}
                                        icon={Images.noteAddIcon}
                                        maxLength={500}
                                        onChangeText={value => {
                                            this.setState({ note: value });
                                        }}
                                        refer='note'
                                        labelStyle={[Styles.fontRegular, Styles.font14]}
                                        autoCapitalize='none'
                                        defaultValue={this.state.note}
                                        value={this.state.note}
                                        autoFocus={this.state.autoFocus}
                                    >Note</FloatingLabel>
                                </View> */}



                                <View style={[Styles.formGroup]}>
                                    <FloatingLabel
                                        style={{ borderBottomColor: '#DFE7F5' }}
                                        icon={Images.imageIcon}
                                        maxLength={50}
                                        onPress={() => this.openModal()}
                                        refer='location'
                                        value={this.state.selectedImage}
                                        labelStyle={[Styles.fontRegular, Styles.font14]}
                                        autoCapitalize='none'
                                        other={true}
                                    >GIF</FloatingLabel>

                                </View>


                            </ScrollView>
                        </View>

                    </View>
                    <ImageModal type={"user"} that={this} isVisible={isModalVisible} />
                    <OptionModal that={this} options={this.state.options} isVisible={this.state.isOptionModalVisible} />
                    {this.state.isLocationModalVisible ?
                        <LocationGame that={this} isVisible={this.state.isLocationModalVisible} />
                        : null}

                    {this.state.isLoadGameModalVisible ? <LoadGameModal that={this} /> : null}
                </View>

            </>
        );
    }
    render() {
        return (

            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                <View style={{ flex: 5 }} children={this.renderView()}></View>
                <View style={[Styles.formGroup, { marginTop: RFPercentage(2), flex: 0.8 }]}>
                    <RoundButton onPress={() => this.createGame()} startColor="#2A395B" endColor="#080B12" label={this.state.createBtn} fontSize={16} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topSection: { width: '100%', flex: 1, paddingTop: 5 },
    middleSection: {
        width: '100%',
        flex: 5,
        paddingTop: 5,
        paddingBottom: 0,
    },
    innerSection: {
        paddingBottom: 20,
        backgroundColor: '#FFF',
        flex: 1,
        height: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    gameRow: {
        padding: 20
    },
    gridCol: {
        height: RFPercentage(15),
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
        width: RFPercentage(10),
        height: RFPercentage(10),
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
        padding: 5,
        backgroundColor: '#FFFFFF'
    },
    gameImage: {
        width: RFPercentage(9.5),
        height: RFPercentage(9.5)
    },
    userCard: {
        backgroundColor: 'transparent',
        width: RFPercentage(3),
        height: RFPercentage(3),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -8,
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
        padding: 5,
        backgroundColor: 'transparent'
    },
    userImg: {
        width: RFPercentage(2.5),
        height: RFPercentage(2.5),
        padding: 2,
        borderRadius: 50
    }
});