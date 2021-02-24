/**
 * Created by sohobloo on 16/9/13.
 */

'use strict';

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ListView,
  FlatList,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal, Image,
  ActivityIndicator,
  ScrollView, Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import normalize from 'react-native-normalize';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { TextInput } from 'react-native-paper';
import Layout from '../../../constants/Layout';
import { postData, getUserDetail } from '../../api/service';
import { ToastMessage } from '../../components/ToastMessage';

import FloatingLabel from '../../components/FloatingLabel';
import Images from '../../../constants/Images';
import Styles from '../../styles/Styles';
import { SmallButton } from '../../components/Buttons/Button';
import PropTypes from 'prop-types';
import * as Analytics from 'expo-firebase-analytics';

const TOUCHABLE_ELEMENTS = [
  'TouchableHighlight',
  'TouchableOpacity',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback'
];


class MyListItem extends React.PureComponent {

  render() {
    return (
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <TouchableOpacity onPress={this.props.onPress.bind(this)} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9EBEE' }}>
          <Image source={(this.props.user.assign_groups.includes(this.props.item.id)) ? Images.checked : Images.unchecked}  style={{ height: normalize(20), width: normalize(20) }} /><Text style={this.props.style}>{this.props.item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class ModalDropdown extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,

    accessible: PropTypes.bool,
    animated: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.string,

    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

    adjustFrame: PropTypes.func,
    renderRow: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderButtonText: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    scrollEnabled: true,
    defaultIndex: -1,
    defaultValue: 'Please select...',
    options: null,
    animated: true,
    showsVerticalScrollIndicator: true,
    keyboardShouldPersistTaps: 'never'
  };

  constructor(props) {
    super(props);
    this.myLocalFlashMessage = React.createRef();

    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      accessible: !!props.accessible,
      //loading: !props.options,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex,
      saveBtn: 'Save',
      createGroupModalVisibility: false,
      groupName: '',
      dropDownText: 0,
      isDisableGroupBtn: false,
      dropDownLabel: 'Assign Group',
      dropDownEndStr: '',

      user: {}
    };
  }

  componentDidMount = async() => {

    let user = await getUserDetail();
    this.setState({user: user})

    this.setGroupSelectionLabel()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let { buttonText, selectedIndex } = this.state;
    const { defaultIndex, defaultValue, options } = nextProps;
    buttonText = this._nextValue == null ? buttonText : this._nextValue;
    selectedIndex = this._nextIndex == null ? selectedIndex : this._nextIndex;
    if (selectedIndex < 0) {
      selectedIndex = defaultIndex;
      if (selectedIndex < 0) {
        buttonText = defaultValue;
      }
    }
    this._nextValue = null;
    this._nextIndex = null;

    this.setState({
      //loading: !options,
      buttonText,
      selectedIndex
    });

  }

  render() {
    return (
      <View {...this.props}>
        
        {this._renderButton()}
        {this._renderModal()}
        {this._renderCreateGroup()}
      </View>
    );
  }

  _updatePosition(callback) {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = { x: px, y: py, w: width, h: height };
        callback && callback();
      });
    }
  }

  show() {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false
    });
  }

  select(idx) {
    const { defaultValue, options, defaultIndex, renderButtonText } = this.props;

    let value = defaultValue;
    if (idx == null || !options || idx >= options.length) {
      idx = defaultIndex;
    }

    if (idx >= 0) {
      value = renderButtonText ? renderButtonText(options[idx]) : options[idx].toString();
    }

    this._nextValue = value;
    this._nextIndex = idx;

    this.setState({
      buttonText: value,
      selectedIndex: idx
    });
  }

  _renderButton() {
    const { disabled, accessible, children, textStyle } = this.props;
    const { buttonText } = this.state;

    return (
      <TouchableOpacity 
        ref={button => this._button = button}
        disabled={disabled}
        accessible={accessible}
        onPress={this._onButtonPress}
        style={{ width: '90%', paddingTop:5, paddingBottom:5 }}
      >
        {
          children ||
          (
            <View style={styles.button}>
              <Text style={[styles.buttonText, textStyle, {width:'70%'}]}
                numberOfLines={1}
              >{this.state.dropDownLabel}</Text><Text style={[styles.buttonText, textStyle]}
                numberOfLines={1}>{this.state.dropDownEndStr}</Text>
              <Image source={Images.caretDownIcon} resizeMode="contain" style={styles.cartDown} />
            </View>
          )
        }
      </TouchableOpacity>
    );
  }

  _onButtonPress = () => {
    const { onDropdownWillShow } = this.props;
    if (!onDropdownWillShow ||
      onDropdownWillShow() !== false) {
      this.show();
    }
  };

  toggleCreateGroup() {
    const { user } = this.state;
    this._onModalPress()
    Analytics.logEvent('CreateGroup', {
      sender: 'player',
      user: user.id,
      screen: 'CreateGroup',
      purpose: 'Viewing create group',
    });
    this.setState({ createGroupModalVisibility: true })
  }

  _renderModal() {
    const { animated, accessible, dropdownStyle } = this.props;
    const { showDropdown, loading } = this.state;
    if (showDropdown && this._buttonFrame) {
      const frameStyle = this._calcPosition();
      const animationType = animated ? 'fade' : 'none';
      let height = 50;
      if (this.props.groups.length == 1) {
        height = (50 * this.props.groups.length) + 50;
      } else if (this.props.groups.length == 2) {
        height = (50 * this.props.groups.length) + 30;
      } else if (this.props.groups.length >= 3) {
        height = 170
      }
      var modalHeight = { height: normalize(height) }
      return (
        <Modal animationType={animationType}
          visible={true}
          transparent={true}
          onRequestClose={this._onRequestClose}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        >
          <TouchableWithoutFeedback accessible={accessible}
            disabled={!showDropdown}
            onPress={this._onModalPress}
          >
            <View style={styles.modal}>
              <View style={[styles.dropdown, dropdownStyle, frameStyle, modalHeight]}>
                {loading ? this._renderLoading() : this._renderDropdown()}
                <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                  <View style={[Styles.tbCol, Styles.centerText, { width: '100%', paddingBottom: normalize(10) }]}>
                    <SmallButton onPress={() => {
                      this.toggleCreateGroup();
                    }} label="Create Group" image={Images.plusIcon}
                      fontSize={12}
                      btnStyle={{ width: '100%', height: normalize(30) }}
                    />
                    {/* <SmallButton label="Done" fontSize={8} btnStyle={{ width: '30%' }} /> */}
                  </View>
                </View>
              </View>

            </View>
          </TouchableWithoutFeedback>
          <FlashMessage ref={this.myLocalFlashMessage} />
        </Modal>
      );
    }
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

    let c_top = normalize(26);
    let c_right = normalize(18)
    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h - c_top : Math.max(0, (this._buttonFrame.y - dropdownHeight) - c_top),
    };

    if (showInLeft) {
      positionStyle.left = this._buttonFrame.x;
    } else {
      const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) || -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = (rightSpace - this._buttonFrame.w) - c_right;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  }

  _onRequestClose = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide ||
      onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _onModalPress = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide ||
      onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _renderLoading() {
    return (
      <ActivityIndicator size='small' />
    );
  }

  onItemPressed(item) {
    if (this.props.user.phone_number !== '') {
      let type = 'add';
      if (this.props.user.assign_groups.includes(item.id)) {
        this.props.user.assign_groups = this.props.user.assign_groups.filter(id => id !== item.id)
        type = 'remove';
      } else {
        this.props.user.assign_groups.push(item.id)
      }
      this.updateGroupUser(item.id, this.props.user.id, type)


      this.setState({
        saveBtn: 'Save',
        dropDownText: this.props.user.assign_groups.length
      });
    } else {
      this.showLocalMessage('Please enter phone number first', 'error')
    }

  }

  updateGroupUser(group_id, user_id, type) {
    let params = { user_id: user_id, group_id: group_id, type: type, user: this.props.user };
    postData('group/update-user', params).then(async (res) => {
      if (res.status) {
        if (res.is_newuser) {
          this.props.user.id = res.user_id;
        }
        this.setGroupSelectionLabel()
        this.props.that.getGroupsData()
        this.showLocalMessage(res.message)
      } else {
        this.showLocalMessage(res.message, "error")
      }
    })

  }

  setGroupSelectionLabel() {

    if (this.props.user.assign_groups.length > 0) {
      let endStr = '';
      if (this.props.user.assign_groups.length > 1) {
        endStr = this.props.user.assign_groups.length - 1
        endStr = ' +' + endStr;
      }

      var group_index = this.props.groups.findIndex((value) => {
        return value.id === this.props.user.assign_groups[0];
      })
      if (group_index >= 0) {
        let group_name = this.props.groups[group_index].name;
        if (group_name.length > 12) {
          group_name = group_name.substring(0, 12)
          group_name = group_name + '...';
        }
        group_name = group_name;
        this.setState({ dropDownLabel: group_name, dropDownEndStr: endStr });
      }

    } else {
      this.setState({ dropDownLabel: 'Assign Group', dropDownEndStr: '' });
    }

  }


  getStyle(item) {
    try {
      return item.is_assigned ? styles.itemTextSelected : styles.itemText;
    } catch (e) {
      return styles.itemText;
    }
  }
  _renderItem = ({ item, index }) => {
    return (<MyListItem style={this.getStyle(item)} onPress={this.onItemPressed.bind(this, item, index)} user={this.props.user} item={item} />);
  }

  _renderDropdown() {
    const { scrollEnabled, renderSeparator, showsVerticalScrollIndicator, keyboardShouldPersistTaps } = this.props;
    return (
      <FlatList
        style={styles.list}
        data={this.props.groups}
        renderItem={this._renderItem.bind(this)}
        keyExtractor={item => Math.random().toString()}
      />
    );
  }

  get _dataSource() {
    const { options } = this.props;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(options);
  }

  _renderRow = (rowData, sectionID, rowID, highlightRow) => {
    const { renderRow, dropdownTextStyle, dropdownTextHighlightStyle, accessible } = this.props;
    const { selectedIndex } = this.state;
    const key = `row_${rowID}`;
    const highlighted = rowID == selectedIndex;
    const row = !renderRow ?
      (<Text style={[
        styles.rowText,
        dropdownTextStyle,
        highlighted && styles.highlightedRowText,
        highlighted && dropdownTextHighlightStyle
      ]}
      >
        {rowData}
      </Text>) :
      renderRow(rowData, rowID, highlighted);
    const preservedProps = {
      key,
      accessible,
      onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
    };
    if (TOUCHABLE_ELEMENTS.find(name => name == row.type.displayName)) {
      const props = { ...row.props };
      props.key = preservedProps.key;
      props.onPress = preservedProps.onPress;
      const { children } = row.props;
      switch (row.type.displayName) {
        case 'TouchableHighlight': {
          return (
            <TouchableHighlight {...props}>
              {children}
            </TouchableHighlight>
          );
        }
        case 'TouchableOpacity': {
          return (
            <TouchableOpacity {...props}>
              {children}
            </TouchableOpacity>
          );
        }
        case 'TouchableWithoutFeedback': {
          return (
            <TouchableWithoutFeedback {...props}>
              {children}
            </TouchableWithoutFeedback>
          );
        }
        case 'TouchableNativeFeedback': {
          return (
            <TouchableNativeFeedback {...props}>
              {children}
            </TouchableNativeFeedback>
          );
        }
        default:
          break;
      }
    }
    return (
      <TouchableHighlight {...preservedProps}>
        {row}
      </TouchableHighlight>
    );
  };

  _onRowPress(rowData, sectionID, rowID, highlightRow) {
    const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
    if (!onSelect || onSelect(rowID, rowData) !== false) {
      highlightRow(sectionID, rowID);
      const value = renderButtonText && renderButtonText(rowData) || rowData.toString();
      this._nextValue = value;
      this._nextIndex = rowID;
      this.setState({
        buttonText: value,
        selectedIndex: rowID
      });
    }
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.setState({
        showDropdown: false
      });
    }
  }

  _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    const key = `spr_${rowID}`;
    return (
      <View style={styles.separator}
        key={key}
      />
    );
  };

  createGroup() {
    console.log('==============================')
    if (this.checkValidGroupForm()) {
      let params = { name: this.state.groupName };
      this.setState({ saveBtn: 'Saving...', isDisableGroupBtn: true })
      postData('group/create', params).then(async (res) => {
        this.setState({ saveBtn: 'Save', isDisableGroupBtn: false })
        if (res.status) {
          if (this.props.user.name !== '' && this.props.user.phone_number !== '') {
            this.onItemPressed(res.data)
          }
          this.showLocalMessage(res.message)
          this.setState({ createGroupModalVisibility: false, groupName: '' })
          this.props.that.addNewGroup(res.data)


        } else {
          this.showLocalMessage(res.message, "error")
        }
      })
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

  checkValidGroupForm() {
    if (this.state.groupName === '') {
      this.showLocalMessage('Please enter group name', 'error')
      return false;
    }
    return true;
  }

  _renderCreateGroup() {
    const { loading } = this.state;
    if(this.state.createGroupModalVisibility){
      return (

        <Modal
          animationType='fade'
          transparent={true}
          visible={true}>
  
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
  
              <View style={styles.modalBody} >
              <ScrollView 
                keyboardShouldPersistTaps={'always'}>
                <View style={Styles.tbRow}>
                  <View style={[Styles.formGroup]}>
                  <TextInput
                      autoCapitalize='words'
                      maxLength={20}
                      style={Styles.inputBoxStyle}
                      label="Group - Name"
                      value={this.state.groupName}
                      theme={{ colors: Layout.inputBoxTheme}}
                      onChangeText={text =>  this.setState({ groupName: text })}
                  />
                  
                    {/* <FloatingLabel
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
                    //inputStyle={[this.isFieldInError('email') ? Styles.fieldError : null]}
                    //autoCapitalize='none'
                    >Group - Name</FloatingLabel> */}
                  </View>
                </View>
  
                <View style={[Styles.tbRow, { paddingTop: 10 }]}>
                  <View style={[Styles.tbCol, Styles.centerText, { width: '100%' }]} >
                    <SmallButton onPress={() => {
                      this.createGroup();
                    }} label={this.state.saveBtn}
                      fontSize={12}
                      btnStyle={{ width: '40%' }}
                      disabled={this.state.isDisableGroupBtn}
                    />
                    {/* <SmallButton label="Done" fontSize={8} btnStyle={{ width: '30%' }} /> */}
                  </View>
                </View>
                </ScrollView>
              </View>
            </View>
          </View>
          <FlashMessage ref={this.myLocalFlashMessage} />
        </Modal>
  
      );
    }else{
      return null;
    }
    
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    width: '100%',
  },
  buttonText: {
    fontSize: normalize(16)
  },
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loading: {
    alignSelf: 'center'
  },
  list: {
    //flexGrow: 1,
  },
  rowText: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 11,
    color: 'gray',
    backgroundColor: 'white',
    textAlignVertical: 'center'
  },
  highlightedRowText: {
    color: 'black'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray'
  },
  itemText: {
    padding: 8,
    color: "#77869E"
  },
  itemTextSelected: {
    padding: 8,
    color: "#1C2A48",
  },

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
  modalContent2: {
    height: normalize(200),
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
  cartDown: {
    height: normalize(7),
    width: normalize(10),
  }
});