import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import normalize from 'react-native-normalize';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";

import Images from '../../../constants/Images';
import Styles from '../../styles/Styles';

var thisObj;
var deviceHeight = Dimensions.get("window").height;
const { width, height } = Dimensions.get('window');

class MyListItem extends React.PureComponent {

    render() {
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <TouchableOpacity onPress={this.props.onPress.bind(this)} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9EBEE' }}>
                    <Image source={(this.props.item.is_assigned) ? Images.checked : Images.unchecked} resizeMode="contain" style={{ height: normalize(15), width: normalize(15) }} /><Text style={this.props.style}>{this.props.item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class MultiSelect extends React.Component {
    constructor(props) {
        super(props);
        thisObj = this;
        var selectedItemsObj = {};
        if (this.props.selectedItems) {
            var items = this.props.selectedItems.split(',');
            items.forEach(function (item) {
                selectedItemsObj[item] = true;
            });
        }
        this.state = {
            selectedItems: selectedItemsObj
        };
    }

    onItemPressed(item, index) {
        this.props.user.groups[index].is_assigned = !this.props.user.groups[index].is_assigned;

        var oldSelectedItems = this.state.selectedItems;
        var itemState = oldSelectedItems[item.id];
        if (!itemState) {
            oldSelectedItems[item.id] = true;
        }
        else {
            var newState = itemState ? false : true;
            oldSelectedItems[item.id] = newState;
        }
        this.setState({
            selectedItems: oldSelectedItems,
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
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => {this.props.that.showDropdown(this.props.user, this.props.userIndex)}}
                >
                <View style={[styles.modalBackground]}>
                    <View style={styles.modalContent}>
                        <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalHeader}>
                            <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Groups</Text>
                            <TouchableOpacity
                                activeOpacity={Styles.touchOpacity}
                                onPress={() => {this.props.that.showDropdown(this.props.user, this.props.userIndex)}}
                            >
                                <Image source={Images.crossIcon} resizeMode="contain" style={{ height: normalize(18), width: normalize(18) }} />
                            </TouchableOpacity>
                        </LinearGradient>

                        <View style={styles.modalBody}>
                            <View style={styles.rootView}>
                                <FlatList style={styles.list}
                                    initialNumToRender={1}
                                    extraData={this.state}
                                    data={this.props.data}
                                    renderItem={this._renderItem.bind(this)}
                                    keyExtractor={item => item.id.toString() + Math.random()}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        //padding: 20,
        backgroundColor: '#00000090',
        alignItems:'center',
        justifyContent:'center'
    },
    modalHeader:{ 
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
    modalContent:{
        height: height/1.8,
        width: '90%',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden'
    },
    modalBody:{ 
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