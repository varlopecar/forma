import React from 'react';
import { View, Animated } from 'react-native';
import { Card } from './ui/card';
import { Text } from './ui/text';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Zap } from '~/lib/icons/Zap';
import { useAppTranslation } from "~/hooks/useAppTranslation";

interface HealthScoreCardProps {
    score: number;
    className?: string;
}

const getScoreInterpretation = (score: number): { text: string } => {
    if (score >= 80) return { text: 'excellent' };
    if (score >= 60) return { text: 'good' };
    return { text: 'improve' };
};

// Función para convertir RGB a hexadecimal
const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

// Función para convertir hexadecimal a RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

// Función para interpolar entre dos colores
const interpolateColors = (color1: string, color2: string, factor: number): string => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

    return rgbToHex(r, g, b);
};

export function HealthScoreCard({ score, className = '' }: HealthScoreCardProps) {
    const { t } = useAppTranslation("businessLogic");
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;
    const iconScaleAnim = React.useRef(new Animated.Value(1)).current;
    const scoreAnim = React.useRef(new Animated.Value(score)).current;
    const interpretation = getScoreInterpretation(score);
    const prevScore = React.useRef(score);

    // Definir los colores base
    const redColor = '#ef4444';    // red-500
    const yellowColor = '#eab308'; // yellow-500
    const greenColor = '#22c55e';  // green-500

    // Calcular el color interpolado
    const getInterpolatedColor = (value: number): string => {
        if (value >= 80) return greenColor;
        if (value >= 60) {
            const factor = (value - 60) / 20; // 60-80 range
            return interpolateColors(yellowColor, greenColor, factor);
        }
        const factor = value / 60; // 0-60 range
        return interpolateColors(redColor, yellowColor, factor);
    };

    // Estado para el color actual
    const [currentColor, setCurrentColor] = React.useState(getInterpolatedColor(score));

    React.useEffect(() => {
        // Animar el valor del score
        Animated.timing(scoreAnim, {
            toValue: score,
            duration: 500,
            useNativeDriver: false,
        }).start();

        // Animate score number
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // Animate icon if score increased
        if (score > prevScore.current) {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(iconScaleAnim, {
                        toValue: 1.3,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(iconScaleAnim, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        }

        // Usar addListener para obtener actualizaciones del valor animado
        const listener = scoreAnim.addListener(({ value }) => {
            setCurrentColor(getInterpolatedColor(value));
        });

        prevScore.current = score;

        return () => {
            scoreAnim.removeListener(listener);
        };
    }, [score]);

    const iconRotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Card className={`p-6 ${className}`}>
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold">{t("healthScore.title")}</Text>
                <Tooltip>
                    <TooltipTrigger>
                        <Animated.View
                            style={{
                                transform: [
                                    { scale: iconScaleAnim },
                                    { rotate: iconRotation },
                                ],
                            }}
                        >
                            <Zap
                                size={24}
                                color={currentColor}
                            />
                        </Animated.View>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Text>{t("healthScore.description")}</Text>
                    </TooltipContent>
                </Tooltip>
            </View>

            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                }}
                className="items-center mb-4"
            >
                <Text className="text-5xl font-bold mb-2" style={{ color: currentColor }}>
                    {score}
                </Text>
                <Text className="text-lg" style={{ color: currentColor }}>
                    {t(`healthScore.levels.${interpretation.text}`)}
                </Text>
            </Animated.View>

            <Progress
                value={score}
                max={100}
                className="h-2 bg-gray-200 dark:bg-gray-700"
                indicatorColor={currentColor}
            />
        </Card>
    );
} 