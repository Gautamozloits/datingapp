import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

 import Swipeable from 'react-native-gesture-handler/Swipeable';
//const { Swipeable } = GestureHandler;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: '#4a4a4a',
    fontSize: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e4e4',
    marginLeft: 10,
  },
  leftAction: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    flex: 1,
  },
  rightAction: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 10,
  },
  deleteBox: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    //width: 100,
    //height: '100%',
    flex:1
  },
});

export const Separator = () => <View style={styles.separator} />;

const LeftActions = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.leftAction}>
      <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
        Add to Cart
      </Animated.Text>
    </View>
  );
};

const RightActions = ( {progress, dragX, icon} ) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  return (
    // <View style={styles.rightAction}>
    //     <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
    //     Delete
    //     </Animated.Text>
    // </View>
      <View style={styles.rightAction}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          {icon}
        </Animated.Text>
      </View>
  );
};

const ListItem = (props) => {
    const rightSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        });
        return (
          <TouchableOpacity onPress={props.onRightPress} activeOpacity={0.6}>
            <View style={styles.deleteBox}>
              <Animated.View style={{transform: [{scale}]}}>
                {props.leftIcon}
              </Animated.View>
            </View>
          </TouchableOpacity>
        );
      };
      
    return (
    <Swipeable
        key={props.data.id}
        //renderLeftActions={LeftActions}
        //onSwipeableLeftOpen={onSwipeFromLeft}
        renderRightActions={rightSwipe}
        onSwipeableRightOpen={props.onRightPress}
        // renderRightActions={(progress, dragX, leftIcon) => (
        // <RightActions progress={progress} dragX={dragX} leftIcon={props.leftIcon} onPress={props.onRightPress} />
        // )}
    >
    {props.children}
    </Swipeable>
    );
}

export default ListItem;