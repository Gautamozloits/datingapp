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
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ActivityIndicator, FlatList
} from 'react-native';
import normalize from 'react-native-normalize';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Images from '../../constants/Images';
import { HeaderButton } from '../components/Buttons/Button';
import PropTypes from 'prop-types';
import Styles from '../styles/Styles';

const TOUCHABLE_ELEMENTS = [
  'TouchableHighlight',
  'TouchableOpacity',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback'
];

export default class FilterDropdown extends Component {
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
    defaultValue: 'Current Week',
    options: null,
    animated: true,
    showsVerticalScrollIndicator: true,
    keyboardShouldPersistTaps: 'never'
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      accessible: !!props.accessible,
      loading: !props.options,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex
    };
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
      loading: !options,
      buttonText,
      selectedIndex
    });
  }

  render() {
    return (
      <View {...this.props}>
        {this._renderButton()}
        {this._renderModal()}
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
    const { disabled, accessible, children, textStyle, buttonView } = this.props;
    const { buttonText } = this.state;

    return (
      <TouchableOpacity ref={button => this._button = button}
        disabled={disabled}
        accessible={accessible}
        onPress={this._onButtonPress}
      >
        {
          children ||
          (
            <View style={styles.button}>
              {/* <HeaderButton image={Images.FilterIcon} label="Current Week" fontSize={10}/> */}

              {/* <IconButton  name="md-trash" fontSize={20} color={'#77869E'}/> */}
              <LinearGradient colors={['#2A395B', '#2A395B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', alignItems: 'center', paddingLeft: normalize(10), paddingRight: normalize(10), paddingTop: normalize(7), paddingBottom: normalize(7), borderRadius: 15, flexDirection: 'row' }}>
                <Text style={[styles.buttonText, textStyle, Styles.textWhite, { fontSize: normalize(12) }]}
                  numberOfLines={1}
                >
                  <FontAwesome
                    name={'filter'}
                    size={normalize(14)}
                    style={{ marginBottom: -3, paddingRight: 3 }}
                    color={'#FFF'}
                  />   {buttonText}
                </Text>
              </LinearGradient>
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

  _renderModal() {
    const { animated, accessible, dropdownStyle } = this.props;
    const { showDropdown, loading } = this.state;
    if (showDropdown && this._buttonFrame) {
      const frameStyle = this._calcPosition();
      const animationType = animated ? 'fade' : 'none';
      let height = 45;
      if (this.props.options.length > 1) {
        height = (27 * this.props.options.length);
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
              </View>
            </View>
          </TouchableWithoutFeedback>
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

    let c_top = normalize(30);
    let c_right = normalize(0)
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

  _renderDropdown() {
    const { scrollEnabled, renderSeparator, showsVerticalScrollIndicator, keyboardShouldPersistTaps } = this.props;
    return (
      <FlatList
        style={styles.list}
        data={this.props.options}
        renderItem={this._renderItem.bind(this)}
        keyExtractor={item => Math.random().toString()}
      />
    );
  }

  _onRowPress2(rowData, rowID) {
    const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
    if (!onSelect || onSelect(rowID, rowData) !== false) {
      //highlightRow(sectionID, rowID);
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

  _renderItem = ({ item, index }) => {
    let rowData = item;
    let rowID = index;
    const { renderRow, dropdownTextStyle, dropdownTextHighlightStyle, accessible } = this.props;
    const key = `row_${rowID}`;
    const highlighted = false;
    const row = !renderRow ?
      (<Text style={[
        styles.rowText,
        dropdownTextStyle,
        highlighted && styles.highlightedRowText,
        highlighted && dropdownTextHighlightStyle,
      ]}
      >
        {rowData}
      </Text>) :
      renderRow(rowData, rowID, highlighted);

    const preservedProps = {
      key,
      accessible,
      onPress: () => this._onRowPress2(rowData, rowID),
    };
    const props = { ...row.props };
    props.key = preservedProps.key;
    props.onPress = preservedProps.onPress;

    return (<TouchableOpacity {...props}><Text style={[
      styles.rowText,
      //styles.borderBottom,
      dropdownTextStyle,
      { padding: 5 }
      //highlighted && styles.highlightedRowText,
      //highlighted && dropdownTextHighlightStyle
    ]}>{rowData}</Text>{this.getSeprator(index)}</TouchableOpacity>);
  }

  //   _renderDropdown_old() {
  //     const {scrollEnabled, renderSeparator, showsVerticalScrollIndicator, keyboardShouldPersistTaps} = this.props;
  //     return (
  //       <ListView scrollEnabled={scrollEnabled}
  //                 style={styles.list}
  //                 dataSource={this._dataSource}
  //                 renderRow={this._renderRow}
  //                 renderSeparator={renderSeparator || this._renderSeparator}
  //                 automaticallyAdjustContentInsets={false}
  //                 showsVerticalScrollIndicator={showsVerticalScrollIndicator}
  //                 keyboardShouldPersistTaps={keyboardShouldPersistTaps}
  //       />
  //     );
  //   }

  getSeprator(index) {
    if (this.props.options.length - 1 > index) {
      return (<View style={styles.separator} />)
    } else {
      return null;
    }


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
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 12
  },
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    //height: (33 + StyleSheet.hairlineWidth) * 5,
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
    fontSize: normalize(12),
    color: '#2A395B',
    fontFamily: 'Regular',
    backgroundColor: 'white',
    textAlignVertical: 'center',
  },
  borderBottom: {
    borderBottomColor: '#DFE7F5',
    borderBottomWidth: 1,
    padding: normalize(10)
  },
  highlightedRowText: {
    color: 'black'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray',
  }
});