import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface LottieAnimationProps {
  source: any;
  autoPlay?: boolean;
  loop?: boolean;
  style?: any;
  size?: number;
  color?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  autoPlay = true,
  loop = true,
  style,
  size = 100,
  color,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={styles.lottie}
        colorFilters={color ? [{ keypath: '**', color }] : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default LottieAnimation;
