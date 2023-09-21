import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { GlobalStyles, TextStyles } from '../../styles/Styles';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const Skeleton = (props: {
  loading: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const opacity = useSharedValue(1);


  opacity.value = withRepeat(
    withSequence(
      withTiming(0.5, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
    ),
    -1,
  );

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);

  if(!props.loading) {   
    return <>{props.children}</>
  }

  return (
    <Animated.View
      style={[
        props.style,
        style,
        {
          backgroundColor: 'rgb(35, 35, 35)',
        },
      ]}>
      <View style={{ opacity: 0.0 }}>{props.children}</View>
    </Animated.View>
  );
};

export default Skeleton;
