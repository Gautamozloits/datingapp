import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet,
    Image, TouchableOpacity, TextInput, Modal, FlatList, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import normalize from 'react-native-normalize';
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, getData } from '../../api/service';
import FloatingLabel from '../../components/FloatingLabel';
import ActionDropdown from '../../components/ActionDropdown';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton, GroupButton, GroupUserCount, GroupRemoveButton } from '../../components/Buttons/Button';
import { searchAddress } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';
import { EmptyRecord } from '../../components/Loader'
import { TextInput as TextInput2 } from 'react-native-paper';
import Layout from '../../../constants/Layout';
import { add } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

const { width, height } = Dimensions.get('window');

export function LocationGame(props) {
    const [addresss, setAddresss] = useState(false);
    const [saveLocationShow, setSaveLocationShow] = useState(false);
    const [locations, setLocations] = useState([]);
    const [address, setAddress] = useState('');
    const [title, setTitle] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [saveBtn, setSaveBtn] = useState('Save');
    const [groupViewMode, setGroupViewMode] = useState('View');
    var isVisible = false;
    if (props.isVisible) {
        isVisible = props.isVisible
    }

    function toggleSaveLocation() {
        setSaveLocationShow(!saveLocationShow);
    }
    function closeModal() {
        props.that.toggleLocation()
    }
    function selectLocation(location) {
        setAddress(location.formatted_address)
    }
    function selectFromSaved(location) {
        if (location.address == address) {
            setAddress('')
        } else {
            setAddress(location.address)
        }

    }

    function useLocation() {
        if (address && address != '') {
            props.that.setLocation(address)
            setTimeout(() => {
                props.that.toggleLocation()
            }, 100)
        } else {
            ToastMessage('Address is required', 'error')
        }

    }
    function saveLocation() {
        if (!title || title === '') {
            ToastMessage('Title is required', 'error')
        } else if (!address || address === '') {
            ToastMessage('Address is required', 'error')
        } else {
            setSaveBtn('Saving...')
            let params = { title: title, address: address }
            postData('location/save', params).then(async (res) => {
                setSaveBtn('Save')
                if (res.status) {
                    locations.push(res.data);
                    setLocations(locations);

                    ToastMessage(res.message)
                    props.that.setLocation(address)
                    setTimeout(() => {
                        props.that.toggleLocation()
                        setSaveLocationShow(false);
                    }, 100)

                } else {
                    ToastMessage(res.message, 'error')
                }
            });
        }



        // props.that.setLocation(address)
        // setTimeout(() => {
        //     props.that.toggleLocation()
        // },100)
    }
    function updateLocationName(item, index) {
        console.log('new name: ', item.title);
        if (item.name == '') {
            ToastMessage('Group name can not be blank', "error")
        } else {
            let params = { id: item.id, title: item.title };
            postData('location/update', params).then(async (res) => {
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

    function removeLocation(id, index) {

        let params = { id: id };
        postData('location/remove', params).then(async (res) => {
            // console.log(res)
            if (res.status) {
                getLocationss();
                ToastMessage(res.message)
            } else {
                ToastMessage(res.message, "error")
            }
        })
    }
    function getLocationss() {
        //let url = 'http://something/' + productId;
        postData('locations', {}).then(async (res) => {
            setLocations(res.data)
        });

    }

    useEffect(() => {
        if (props.that.state.gameLocation !== '') {
            setAddress(props.that.state.gameLocation)
        }

        let didCancel = false;

        async function fetchMyAPI() {
            //let url = 'http://something/' + productId;
            let config = {};
            const response = await postData('locations').then(async (res) => {
                return res.data;
            });
            if (!didCancel) { // Ignore if we started fetching something else
                setLocations(response)
            }
        }

        fetchMyAPI();
        return () => { didCancel = true; }; // Remember if we start fetching something else
    }, []);


    async function searchLocation(text) {
        setAddress(text)
        let result = await searchAddress(text)
        if (result.status) {
            setAddresss(result.results)
        } else {
            ToastMessage(result.message, 'error');
        }

    }
    const amount = [{ id: 1, amount: '20k' }, { id: 2, amount: '40k' }, { id: 3, amount: '30k' }, { id: 4, amount: '20k' }]

    function renderList(item, index) {
        return (
            <TouchableOpacity onPress={() => selectLocation(item)}>
                <View style={[Styles.tbRow, styles.gameRow]}>
                    <View style={[Styles.tbCol, { width: '15%', justifyContent: 'flex-start' }]}>
                        <View style={[Styles.centerText, { backgroundColor: '#F7F8F8', height: RFPercentage(6), width: RFPercentage(6), padding: 10, borderRadius: 50 }]}>
                            <Image source={Images.locationblank} style={styles.userImg} resizeMode="contain" />
                        </View>
                    </View>
                    <View style={[Styles.tbCol, { width: '70%', borderBottomColor: '#F7F8F8', borderBottomWidth: 1 }]}>
                        <View>
                            <Text style={[Styles.textPrimaryDark, Styles.font14, Styles.fontMedium]}>{item.name}</Text>
                            <Text style={[Styles.textGray, Styles.font12, Styles.fontRegular]}>{item.formatted_address}</Text>
                        </View>
                    </View>
                    <View style={[Styles.tbCol, Styles.centerText, { width: '15%', borderBottomColor: '#F7F8F8', borderBottomWidth: 1 }]}>
                        <Image source={Images.arrow} style={{ height: RFPercentage(1.6), width: RFPercentage(1.6) }} resizeMode='contain' />

                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    function renderView() {
        return (
            <KeyboardAwareScrollView enableOnAndroid={true} style={{ height: "100%" }}
                enableAutoAutomaticScroll={(Platform.OS === 'ios')} >


                <View style={[styles.innerSection]}>
                    <View style={[Styles.tbRow, { marginTop: normalize(10), justifyContent: 'space-between' }]}>
                        <Text style={[Styles.textPrimaryDark, Styles.font14, Styles.fontMedium]}>Choose From Saved Locations</Text>
                        <ActionDropdown
                            options={['View', 'Edit', 'Delete']}
                            dropdownStyle={Styles.dropdown_2_dropdown}
                            onSelect={(idx, value) => {
                                setGroupViewMode(value)
                            }}
                        />
                    </View>

                    <View style={[Styles.tbRow]}>
                        <FlatList
                            horizontal={true}
                            contentContainerStyle={{ paddingBottom: 0, paddingTop: normalize(7), paddingLeft: 0, paddingRight: 0 }}
                            showsHorizontalScrollIndicator={false}
                            data={locations}
                            renderItem={({ item, index }) =>
                                <View style={{ marginRight: 15 }}>
                                    {
                                        (groupViewMode == 'Edit') ? <TextInput
                                            defaultValue={item.title}
                                            onBlur={() => updateLocationName(item, index)}
                                            placeholder="Enter Name"
                                            onChangeText={(value) => item.title = value}
                                            maxLength={20}
                                            autoCapitalize='words'
                                            style={[Styles.inputField, { width: '100%', height: normalize(28) }]}
                                        />
                                            :
                                            <>
                                                <GroupButton borderColor={(selectedAddress === item.id || address == item.address) ? '#2A395B' : '#DFE7F5'} onPress={() => {
                                                    if (selectedAddress == item.id) {
                                                        setSelectedAddress('');
                                                    } else {
                                                        setSelectedAddress(item.id);
                                                    }

                                                    selectFromSaved(item);
                                                }} label={item.title} />
                                                {(groupViewMode == 'Delete') ? <GroupRemoveButton onPress={() => { removeLocation(item.id, index) }} /> : null}
                                            </>
                                    }

                                    {/* <GroupButton borderColor={(selectedAddress === item.id || address == item.address) ? '#2A395B' : '#DFE7F5'} onPress={() => { setSelectedAddress(item.id); selectFromSaved(item); }} label={item.title} /> */}
                                </View>
                            }
                            keyExtractor={item => item.id + Math.random().toString()}
                            ListEmptyComponent={() => <EmptyRecord visible={true} message="No saved location at the moment" />}
                        />
                    </View>
                    <View style={[Styles.tbRow, { justifyContent: 'space-between', marginTop: normalize(30) }]}>
                        <Text style={[Styles.textPrimaryDark, Styles.font14, Styles.fontMedium]}>Or Enter Below</Text>

                    </View>
                    <View style={[Styles.tbRow, { marginTop: 10, marginBottom: 10 }]}>
                        <View style={[Styles.tbCol, { width: '80%' }]}>
                            <View style={[Styles.tbRow, Styles.centerText, { borderColor: '#DFE7F5', height: RFPercentage(5), borderWidth: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 30 }]}>
                                <Image source={Images.back} style={[styles.userImg, { width: '7%', marginLeft: 3 }]} resizeMode="contain" />
                                <TextInput
                                    placeholder="Enter Location"
                                    placeholderTextColor="#77869E"
                                    style={{ height: 20, width: '93%', fontSize: 12, paddingLeft: 5, paddingRight: 5, color: '#77869E' }}
                                    onChangeText={text => searchLocation(text)}
                                    value={address}
                                />
                            </View>

                        </View>
                        <View style={[Styles.tbCol, Styles.centerText, { width: '20%' }]}>
                            <SmallButton onPress={() => toggleSaveLocation()} label="Save" fontSize={12} />
                        </View>
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={addresss}
                        renderItem={({ item, index }) => renderList(item, index)}
                        keyExtractor={item => item.id.toString() + Math.random()}
                    />
                    <View style={[Styles.tbRow, Styles.centerText]}>
                        <SmallButton onPress={() => useLocation()} btnStyle={{ width: '30%' }} label="Done" fontSize={12} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
    return (
        <>
            {saveLocationShow ?
                <Modal
                    avoidKeyboard
                    animationType='fade'
                    transparent={true}
                    visible={true}>
                    <View style={[styles.modalBackground]}>
                        <View style={styles.modalContent2}>
                            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                                <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Save Location</Text>
                                <TouchableOpacity
                                    activeOpacity={Styles.touchOpacity}
                                    onPress={() => { setSaveLocationShow(!saveLocationShow) }}
                                >
                                    <Image source={Images.crossIcon} resizeMode="contain" style={{ height: normalize(18), width: normalize(18) }} />
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={styles.modalBody}>
                                <View style={Styles.tbRow}>
                                    <View style={[Styles.formGroupNew]}>

                                        <TextInput2
                                            autoCapitalize='words'
                                            maxLength={50}
                                            style={[Styles.inputBoxStyle]}
                                            label="Location Title"
                                            //value={name}
                                            theme={{ colors: Layout.inputBoxTheme }}
                                            onChangeText={value => {
                                                setTitle(value);
                                            }}
                                        //left={<TextInput.Icon forceTextInputFocus={false} name={() => <InputIcon image={Images.user} />} style={Styles.inputLeftIcon}/>}
                                        />


                                        {/* <FloatingLabel
                                            maxLength={50}
                                            onChangeText={value => {
                                                setTitle(value);
                                            }}
                                            refer='title'
                                            style={{ borderBottomColor: '#E9EBEE' }}
                                            labelStyle={[Styles.fontRegular, Styles.font14]}
                                        >Location Title</FloatingLabel> */}
                                    </View>
                                </View>

                                <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                                    <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]}>
                                        <SmallButton onPress={() => {
                                            saveLocation();
                                        }} label={saveBtn}
                                            fontSize={12}
                                            btnStyle={{ width: '40%', height: normalize(30) }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                :
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={closeModal}>
                    <View style={[styles.modalBackground]}>
                        <View style={styles.modalContent2}>
                            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                                <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Location</Text>
                                <TouchableOpacity
                                    activeOpacity={Styles.touchOpacity}
                                    style={Styles.closeBtn}
                                    onPress={closeModal}
                                >
                                    <Image source={Images.crossIcon} resizeMode="contain" style={{ height: normalize(18), width: normalize(18) }} />
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={styles.modalBody}>
                                {renderView()}
                            </View>
                        </View>
                    </View>
                </Modal>
            }
        </>

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
        height: '80%',
        width: '95%',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden'
    },
    modalContent2: {
        height: normalize(380),
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalBody: {
        flex: 1,
        padding: 15,
        paddingTop: 20,
        backgroundColor: '#FFF'
    },
    middleSection: {
        width: '100%',
        flex: 1,
        paddingTop: 15,
        paddingBottom: 30,
    },
    innerSection: {
        paddingBottom: 20,
        backgroundColor: '#FFF',
        flex: 1,
        height: '100%',
    },
    gameRow: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 20
        /* borderBottomWidth:2, 
        borderBottomColor: '#E9F1FF', 
        borderStyle: 'dashed'  */
    },


    userImg: {
        width: RFPercentage(2.8),
        height: RFPercentage(2.8),
        padding: 0,
        marginTop: 1,

    },
});