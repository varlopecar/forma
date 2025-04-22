import React, { useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Card } from '../ui/card';
import { Text } from '../ui/text';
import { Dumbbell } from '~/lib/icons/Dumbbell';
import { useAppTranslation } from "~/hooks/useAppTranslation";
import { useMockWorkoutData } from '~/hooks/useMockWorkoutData';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface WorkoutAnalysisCardProps {
    className?: string;
}

export function WorkoutAnalysisCard({ className = '' }: WorkoutAnalysisCardProps) {
    const { t } = useAppTranslation("businessLogic");
    const { t: tWorkout } = useAppTranslation("workoutAnalysis");
    const { recentSessions, recommendation } = useMockWorkoutData();
    const router = useRouter();

    // Animation values for the recommendation
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const prevRecommendation = useRef(recommendation);

    // Animate when recommendation changes
    useEffect(() => {
        if (
            prevRecommendation.current.type !== recommendation.type ||
            prevRecommendation.current.intensity !== recommendation.intensity
        ) {
            // Fade out, then in
            opacity.value = withSequence(
                withTiming(0, { duration: 300 }),
                withTiming(1, { duration: 300 })
            );

            // Slight scale effect
            scale.value = withSequence(
                withTiming(0.95, { duration: 250 }),
                withTiming(1.05, { duration: 200 }),
                withTiming(1, { duration: 150 })
            );

            prevRecommendation.current = recommendation;
        }
    }, [recommendation]);

    const recommendationStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }]
        };
    });

    const getWorkoutTypeColor = (type: string) => {
        switch (type) {
            case 'push': return 'text-blue-500';
            case 'pull': return 'text-purple-500';
            case 'legs': return 'text-green-500';
            case 'cardio': return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    const getWorkoutIntensityColor = (intensity: string) => {
        switch (intensity) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-amber-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const getRelativeDateLabel = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return tWorkout('recentWorkouts.today');
        } else if (date.toDateString() === yesterday.toDateString()) {
            return tWorkout('recentWorkouts.yesterday');
        } else {
            const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            return tWorkout('recentWorkouts.daysAgo', { count: diffDays });
        }
    };

    const handleViewMore = () => {
        router.push('/ai-analysis');
    };

    // Mini bar chart component
    const renderMiniChart = (points: number[]) => {
        const maxHeight = 24; // maximum height of the bars in pixels
        const maxValue = Math.max(...points, 1); // avoid division by zero

        return (
            <View className="flex-row items-end h-6 gap-1" testID="mini-bar-chart">
                {points.map((point, index) => {
                    const height = (point / maxValue) * maxHeight;
                    return (
                        <View
                            key={index}
                            style={{ height: Math.max(2, height) }}
                            className="w-2 bg-primary rounded-sm"
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <Card className={`p-4 ${className}`} testID="workout-analysis-card">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold" testID="workout-analysis-title">
                    {tWorkout('title')}
                </Text>
                <Dumbbell size={24} className="text-primary" testID="workout-icon" />
            </View>

            {/* AI Recommendation */}
            <Animated.View
                style={recommendationStyle}
                className="bg-primary/10 p-3 rounded-md mb-4"
                testID="ai-recommendation"
            >
                <Text className="text-xs text-muted-foreground mb-1">
                    {tWorkout('aiRecommendation.title')}
                </Text>
                <Text className="text-base font-medium">
                    {t(`workout.types.${recommendation.type}`)} - {t(`workout.intensity.${recommendation.intensity}`)}
                </Text>
            </Animated.View>

            {/* Recent Workout Sessions */}
            <Text className="font-medium mb-2" testID="recent-workouts-title">
                {tWorkout('recentWorkouts.title')}
            </Text>

            <View className="space-y-3 mb-4">
                {recentSessions.map((session) => (
                    <View key={session.id} className="flex-row items-center justify-between" testID={`workout-session-${session.id}`}>
                        <View className="flex-1">
                            <Text className="text-sm font-medium">
                                {getRelativeDateLabel(session.date)}
                            </Text>
                            <View className="flex-row items-center">
                                <Text className={`text-sm font-medium ${getWorkoutTypeColor(session.type)}`}>
                                    {t(`workout.types.${session.type}`)}
                                </Text>
                                <Text className="text-sm mx-1">•</Text>
                                <Text className={`text-sm ${getWorkoutIntensityColor(session.intensity)}`}>
                                    {t(`workout.intensity.${session.intensity}`)}
                                </Text>
                            </View>
                        </View>

                        {/* Mini effort chart */}
                        <View className="ml-2">
                            {renderMiniChart(session.effortPoints)}
                        </View>
                    </View>
                ))}
            </View>

            {/* View More Button */}
            <Pressable
                onPress={handleViewMore}
                className="bg-primary py-2 rounded-md items-center"
                testID="view-more-button"
            >
                <Text className="text-primary-foreground font-medium">
                    {tWorkout('weeklyIntensity')}
                </Text>
            </Pressable>
        </Card>
    );
} 