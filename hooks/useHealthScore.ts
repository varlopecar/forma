import { useEffect, useRef, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const interpolateColors = (
  color1: string,
  color2: string,
  factor: number
): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
};

export const getScoreInterpretation = (score: number): { text: string } => {
  if (score >= 80) return { text: "excellent" };
  if (score >= 60) return { text: "good" };
  return { text: "improve" };
};

export function useHealthScore(score: number) {
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  const iconScaleValue = useSharedValue(1);
  const scoreValue = useSharedValue(score);
  const prevScore = useRef(score);

  const redColor = "#ef4444";
  const yellowColor = "#eab308";
  const greenColor = "#22c55e";

  const getInterpolatedColor = (value: number): string => {
    if (value >= 80) return greenColor;
    if (value >= 60) {
      const factor = (value - 60) / 20;
      return interpolateColors(yellowColor, greenColor, factor);
    }
    const factor = value / 60;
    return interpolateColors(redColor, yellowColor, factor);
  };

  const [currentColor, setCurrentColor] = useState(getInterpolatedColor(score));
  const [displayScore, setDisplayScore] = useState(score);

  const scoreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScaleValue.value },
        { rotate: `${rotateValue.value * 360}deg` },
      ],
    };
  });

  useEffect(() => {
    scoreValue.value = withTiming(score, { duration: 500 });

    scaleValue.value = withSequence(
      withTiming(1.05, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    if (score > prevScore.current) {
      iconScaleValue.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );

      rotateValue.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 0 })
      );
    } else if (score < prevScore.current) {
      iconScaleValue.value = withSequence(
        withTiming(0.7, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );

      rotateValue.value = withSequence(
        withTiming(-1, { duration: 300 }),
        withTiming(0, { duration: 0 })
      );
    }

    setCurrentColor(getInterpolatedColor(score));
    setDisplayScore(score);

    prevScore.current = score;
  }, [score]);

  return {
    scoreStyle,
    iconStyle,
    currentColor,
    displayScore,
    interpretation: getScoreInterpretation(score),
  };
}
