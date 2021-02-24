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

const SwipeItemRowRight = (props) => {
    const { children } = props;
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={props.handleAction} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.View style={{transform: [{scale}]}}>
            <Text></Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable  key={props.data.id} renderLeftActions={leftSwipe} onSwipeableLeftOpen={props.handleAction}>
      {children}
    </Swipeable>
  );
};

export default SwipeItemRowRight;

const styles = StyleSheet.create({
 
  deleteBox: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
});