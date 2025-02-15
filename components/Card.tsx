import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface CardProps {
  frontText: string;
  backText: string;
  isFlipped: boolean;
  onPress: () => void;
  isAnimating: boolean;
  onAnimationEnd: () => void;
  themeColors: {
    frontBackground: string;
    backBackground: string;
    textColor: string;
  };
}

export default function Card(
  {
    frontText,
    backText,
    isFlipped,
    onPress,
    isAnimating,
    onAnimationEnd,
    themeColors,
  }: CardProps,
) {
  const rotateY = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Анимация переворота
  useEffect(() => {
    rotateY.value = withTiming(isFlipped ? 180 : 0, { duration: 500 });
  }, [isFlipped]);

  // Анимация улёта и появления
  useEffect(() => {
    if (isAnimating) {
      // Анимация "улёта" карточки
      translateY.value = withTiming(-500, { duration: 500 });
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationEnd)();
        }
      });
    } else {
      // Сбрасываем позиции для новой карточки
      translateY.value = withTiming(0, { duration: 500 });
      opacity.value = withTiming(1, { duration: 500 });
    }
  }, [isAnimating]);

  // Анимированные стили для фронтальной и обратной сторон
  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateY.value}deg` },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  }) as ViewStyle);

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateY.value + 180}deg` },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  }) as ViewStyle);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: themeColors.frontBackground },
            frontAnimatedStyle,
          ]}
        >
          <Text style={[styles.cardText, { color: themeColors.textColor }]}>
            {frontText}
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: themeColors.backBackground },
            backAnimatedStyle,
          ]}
        >
          <Text style={[styles.cardText, { color: themeColors.textColor }]}>
            {backText}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 300,
    minHeight: 200,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 1,
    backfaceVisibility: 'hidden',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
