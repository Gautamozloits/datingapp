/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    Image, ScrollView, StyleSheet, Dimensions, FlatList, TouchableOpacity, TouchableHighlight
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import normalize from 'react-native-normalize';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { HeaderBG, HeaderLeft, PeriodFilter } from '../../components/HeaderOptions';
import ContainerFixScreen from './../Views/ContainerFixScreen';
import Global from '../../../constants/Global';
import { getListContent } from '../../api/serviceHandler';
import { Loader, LoaderFooter, NoRecord } from '../../components/Loader';
import { DateFilter } from '../../components/DateFilter';
import moment from "moment";
import * as Analytics from 'expo-firebase-analytics';
import { PlainIcon } from '../../components/Buttons/Button';
import { convertLocalToUTC, convertDateTime } from '../../api/service';

const { width, height } = Dimensions.get('window');

export default class MyGames extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle: () => <Text style={Styles.headerTitle}>My Games</Text>,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderBG />,
            headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
            headerRight: () => <PeriodFilter options={['Weekly', 'Monthly', 'Yearly']} changeFilter={navigation.getParam('changeFilter')} />,
        };
    };



    constructor(props) {
        super(props);
        this.state = {
            //list variable
            listRecords: [],
            page: 1,
            current_page: 1,
            total_pages: 1,

            //loading status
            is_api_calling: false,//show if api already called
            show_footer_loader: false,// show when next page called
            show_no_record: false, // show when no record in list
            showIndicator: false, // show loader for first time
            refreshing: false, //show loader on pull to refresh

            isModalOpen: false,
            modalText: '',
            current_filter: 'week',
            filter_mode: 'week',
            dates: { start_date: '', end_date: '' }
        };

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({ changeFilter: this.changeFilter });
        //this.getListData('first');
        Analytics.logEvent('MyGames', {
            /*
             * We want to know if the user came from from the swipe card as
             * opposed to from chat or a deep link.
             */
            sender: 'player',
            /*
             * This may be too specific and not very useful, but maybe down the line * we could investigate why a certain user is more popular than others.
             */
            user: '123456',
            /*
             * We can use this information later to compare against other events.
             */
            screen: 'MyGames',
            purpose: 'Viewing game list',
          });

    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    changeFilter = (id, name) => {
        var filter = ['week', 'month', 'year'];
        var type = filter[id];
        this.setState({ filter_mode: type })
    }

    getListData = async (type, dates) => {
        let start_date = convertLocalToUTC(dates.start_date+' 00:00:00');
        let end_date = convertLocalToUTC(dates.end_date+' 23:59:59');
        //var { dates } = this.state;
        let params = { start_date: start_date, end_date: end_date };
        getListContent('games-history', params, this, type)
    }

    /**
     * User Row
     * @param {*} item 
     * @param {*} index 
     */
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

    /**
     * TO create tooltip
     */
    userToolTipView = (players) => {

        return (<View style={[{ padding: 8, backgroundColor: '#FFF' }]}>
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

    renderList = (item, index) => {
        const { listRecords } = this.state;
        return (
            <>
                <TouchableOpacity key={'mygame_' + index} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('GameDetails', { gameDetails: item, game_id: item.game_id })} style={{ paddingTop: normalize(15), paddingBottom: normalize(15) }}>
                    <View style={[Styles.tbRow]}>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '30%', justifyContent: 'center' }]}>
                            <View style={[styles.imgContainer]}>
                                <Image source={(item.image && item.image !== "") ? { uri: Global.ROOT_PATH + item.image } : Images.demo} style={styles.gameImage} />
                            </View>
                        </View>
                        <View style={[Styles.tbCol, { width: '70%', paddingRight: normalize(10) }]}>
                            <View style={[Styles.tbRow, { justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[Styles.tbCol, { borderRightWidth: 1, borderRightColor: '#DFE7F5' }]}>
                                        <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular, Styles.centerText, { paddingRight: 5, }]}>Date</Text>
                                    </View>
                                    <View style={[Styles.tbCol]}>
                                        <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontRegular, { paddingLeft: 5 }]}>{convertDateTime(item.start_time, 'DD-MM-YYYY')}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[Styles.tbCol, { borderRightWidth: 1, borderRightColor: '#DFE7F5' }]}>
                                        <Text style={[Styles.textPrimary, Styles.font12, Styles.fontRegular, Styles.centerText, { paddingRight: 5, }]}>Duration</Text>
                                    </View>
                                    <View style={[Styles.tbCol]}>
                                        <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontRegular, { paddingLeft: 5 }]}>{item.duration}</Text>
                                    </View>
                                </View>
                            </View>


                            <View>
                                <Text style={[Styles.textPrimaryDark, Styles.font16, Styles.fontBold]}>{item.title}</Text>
                                <Text style={[Styles.textPrimaryLight, Styles.font12, Styles.fontMedium]}>@{item.location}</Text>

                                <Text numberOfLines={2} style={[Styles.textGrayLight, Styles.font10, Styles.fontRegular, { marginTop: normalize(5) }]}>{item.note}</Text>
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
                                            if(key <= 4){
                                            return (
                                                <View style={styles.userCard} key={'user_' + key}>
                                                    <Image source={(user.image && user.image !== '') ? { uri: Global.ROOT_PATH + user.image } : Images.userImage} style={styles.userImg} blurRadius={(item.users.length > 4 && key == 4) ? 3 : 0}/>
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

                </TouchableOpacity>
                {listRecords.length > index + 1 ? <Image source={Images.bottomBorder} style={Styles.bottomBorderFullImage} /> : null}
            </>
        );
    }

    renderView = () => {
        const { listRecords, showIndicator, refreshing, show_footer_loader, show_no_record, showMultiGameModal, filter_mode } = this.state;

        return (
            <View style={{ flex: 1, flexDirection: 'column', height: height }}>

                <View style={styles.middleSection}>
                    <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden',}}>
                        <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', height: normalize(50), paddingLeft: 0, paddingRight: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <DateFilter onChangeFilter={value => { this.setState({ dates: value }); this.getListData('first', value) }} mode={filter_mode} />
                        </LinearGradient>
                        <View style={styles.innerSection}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={listRecords}
                                renderItem={({ item, index }) => this.renderList(item, index)}
                                keyExtractor={item => 'mygame_' + item.game_id.toString() + Math.random()}

                                ListFooterComponent={() => <LoaderFooter visible={show_footer_loader} />}
                                ListEmptyComponent={() => <NoRecord visible={show_no_record} />}
                                onRefresh={() => {
                                    this.getListData('refresh', this.state.dates);
                                }}
                                refreshing={refreshing}
                                onEndReached={() => {
                                    this.getListData('loadmore', this.state.dates);
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    render() {
        return (
            <ContainerFixScreen children={this.renderView()} />
        );
    }
}

const styles = StyleSheet.create({
    topSection: { width: '100%', flex: 1 },
    middleSection: {
        width: '100%',
        flex: 5,
        paddingTop: 0,
        paddingBottom: normalize(75),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    innerSection: {
        paddingBottom: 20,
        backgroundColor: '#FFF',
        flex: 1,
        height: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
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
        padding: 20,
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
        width: '32%'
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
    },
    gameImage: {
        width: normalize(70),
        height: normalize(70),
        borderRadius: 10
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
    },
    rowFront: { flexDirection: 'row', marginBottom: normalize(5), borderRadius: 10, flex: 1, padding: 5 },
    activeRow: { backgroundColor: '#FFF' },
    cardImage: {
        height: normalize(35),
        width: normalize(35),
        borderRadius: 50
    },
});