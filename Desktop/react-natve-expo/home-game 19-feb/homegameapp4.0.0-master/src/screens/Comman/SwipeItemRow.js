import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeItemRow = (props) => {
    const { children } = props;
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={props.handleDelete} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.View style={{transform: [{scale}]}}>
            {props.leftIcon}
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable  key={props.data.id} renderRightActions={leftSwipe} onSwipeableRightOpen={props.handleDelete}>
      {children}
    </Swipeable>
  );
};

export default SwipeItemRow;

const styles = StyleSheet.create({
 
  deleteBox: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    //width: 100,
    //height: '100%',
    flex:1
  },
});