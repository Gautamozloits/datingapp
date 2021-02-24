import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import normalize from 'react-native-normalize';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";

import { postData } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';

import FloatingLabel from '../../components/FloatingLabel';

import Images from '../../../constants/Images';
import Styles from '../../styles/Styles';
import { SmallButton } from '../../components/Buttons/Button';

var thisObj;
var deviceHeight = Dimensions.get("window").height;
const { width, height } = Dimensions.get('window');

class MyListItem extends React.PureComponent {

    render() {
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <TouchableOpacity onPress={this.props.onPress.bind(this)} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9EBEE' }}>
                    <Image source={(this.props.item.is_assigned) ? Images.checked : Images.unchecked} resizeMode="contain" style={{ height: normalize(20), width: normalize(20) }} /><Text style={this.props.style}>{this.props.item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class GroupAssignModal extends React.Component {
    constructor(props) {
        super(props);
        thisObj = this;

        this.state = {
            createGroupModalVisibility: false,
            saveBtn: 'Save',
            groupName: ''
        };
    }

    onItemPressed(item, index) {

        this.props.selectedGroupUsers[this.props.userIndex].groups[index].is_assigned = !this.props.selectedGroupUsers[this.props.userIndex].groups[index].is_assigned;

        this.setState({
            saveBtn: 'Save',
        });

    }

    getStyle(item) {
        try {
            return item.is_assigned ? styles.itemTextSelected : styles.itemText;
        } catch (e) {
            return styles.itemText;
        }
    }

    _renderItem = ({ item, index }) => {
        return (<MyListItem style={this.getStyle(item)} onPress={this.onItemPressed.bind(this, item, index)} item={item} />);
    }

    toggleCreateGroup() {
        this.setState({ createGroupModalVisibility: true })
    }

    createGroup() {
        if (this.checkValidGroupForm()) {
            let params = { name: this.state.groupName };
            this.setState({ saveBtn: 'Saving...' })
            postData('group/create', params).then(async (res) => {
                this.setState({ saveBtn: 'Save' })
                if (res.status) {
                    ToastMessage(res.message)
                    this.props.that.state.groups.push(res.data)
                    this.setState({ createGroupModalVisibility: false, groupName: '' })
                } else {
                    ToastMessage(res.message, "error")
                }
            })
        }

    }

    checkValidGroupForm() {
        if (this.state.groupName === '') {
            ToastMessage('Please enter group name', 'error')
            return false;
        }
        return true;
    }

    _calcPosition() {
        const { dropdownStyle, style, adjustFrame } = this.props;

        const dimensions = Dimensions.get('window');
        const windowWidth = dimensions.width;
        const windowHeight = dimensions.height;

        const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
            StyleSheet.flatten(styles.dropdown).height;

        const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
        const rightSpace = windowWidth - this._buttonFrame.x;
        const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
        const showInLeft = rightSpace >= this._buttonFrame.x;

        const positionStyle = {
            height: dropdownHeight,
            top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
        };

        if (showInLeft) {
            positionStyle.left = this._buttonFrame.x;
        } else {
            const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
                (style && StyleSheet.flatten(style).width) || -1;
            if (dropdownWidth !== -1) {
                positionStyle.width = dropdownWidth;
            }
            positionStyle.right = rightSpace - this._buttonFrame.w;
        }

        return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
    }

    render() {

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
            >

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.createGroupModalVisibility}>

                    <View style={[styles.modalBackground]}>
                        <View style={styles.modalContent2}>
                            <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                                <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Create Group</Text>
                                <TouchableOpacity
                                    activeOpacity={Styles.touchOpacity}
                                    onPress={() => { this.setState({ createGroupModalVisibility: false }) }}
                                >
                                    <Image source={Images.crossIcon} resizeMode="contain" style={{ height: normalize(18), width: normalize(18) }} />
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={styles.modalBody}>
                                <View style={Styles.tbRow}>
                                    <View style={[Styles.formGroup]}>
                                        <FloatingLabel
                                            // icon={Images.user}
                                            maxLength={50}
                                            onChangeText={value => {
                                                this.setState({ groupName: value });
                                            }}
                                            //value={email}
                                            refer='groupName'
                                            //required={true}
                                            style={{ borderBottomColor: '#E9EBEE' }}
                                            labelStyle={[Styles.fontRegular, Styles.font14]}
                                        >Group - Name</FloatingLabel>
                                    </View>
                                </View>

                                <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                                    <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]}>
                                        <SmallButton onPress={() => {
                                            this.createGroup();
                                        }} label={this.state.saveBtn}
                                            fontSize={normalize(16)}
                                            btnStyle={{ width: '40%', height: normalize(30) }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {!this.state.createGroupModalVisibility ?
                    <View style={[styles.modalBackground]}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalBody}>
                                <View style={styles.rootView}>
                                    <FlatList style={styles.list}
                                        initialNumToRender={1}
                                        extraData={this.state}
                                        data={this.props.data}
                                        renderItem={this._renderItem.bind(this)}
                                        keyExtractor={item => Math.random().toString()}
                                    />
                                </View>

                                <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                                    <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]}>
                                        <SmallButton onPress={() => {
                                            this.toggleCreateGroup();
                                        }} label="Create Group" image={Images.plusIcon}
                                            fontSize={normalize(16)}
                                            btnStyle={{ width: '50%', height: normalize(30) }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>



                    </View>
                    : null}

            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flexGrow: 1,
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
        position: 'absolute',
        height: (33 + StyleSheet.hairlineWidth) * 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        borderRadius: 2,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    modalContent2: {
        height: normalize(200),
        width: '90%',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden'
    },
    modalBody: {
        flex: 1,
        padding: 15,
        paddingTop: 20,
        backgroundColor: '#FFF'
    },

    rootView: {
        height: 200,
        width: '100%'
    },
    itemText: {
        padding: 8,
        color: "#77869E"
    },
    itemTextSelected: {
        padding: 8,
        color: "#1C2A48",
    },
    list: {
        height: 100,
    }
});