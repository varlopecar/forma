import React from 'react';
import { View } from 'react-native';
import { Card } from './ui/card';
import { Text } from './ui/text';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Zap } from '~/lib/icons/Zap';
import { useAppTranslation } from "~/hooks/useAppTranslation";
import Animated from 'react-native-reanimated';
import { useHealthScore } from '~/hooks/useHealthScore';

interface HealthScoreCardProps {
    score: number;
    className?: string;
}

export function HealthScoreCard({ score = 0, className = '' }: HealthScoreCardProps) {
    const { t } = useAppTranslation("businessLogic");
    const { scoreStyle, iconStyle, currentColor, displayScore, interpretation } = useHealthScore(score);

    return (
        <Card className={`p-6 ${className}`} testID="health-score-card">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold" testID="health-score-title">{t("healthScore.title")}</Text>
                <Tooltip>
                    <TooltipTrigger testID="health-score-tooltip-trigger">
                        <Animated.View style={iconStyle}>
                            <Zap
                                size={24}
                                color={currentColor}
                                testID="health-score-icon"
                            />
                        </Animated.View>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Text testID="health-score-description">{t("healthScore.description")}</Text>
                    </TooltipContent>
                </Tooltip>
            </View>

            <Animated.View
                style={scoreStyle}
                className="items-center mb-4"
                testID="health-score-value-container"
            >
                <Text
                    className="text-5xl font-bold mb-2"
                    style={{ color: currentColor }}
                    testID="health-score-value"
                >
                    {displayScore}
                </Text>
                <Text
                    className="text-lg"
                    style={{ color: currentColor }}
                    testID="health-score-level"
                >
                    {t(`healthScore.levels.${interpretation.text}`)}
                </Text>
            </Animated.View>

            <Progress
                value={score}
                max={100}
                className="h-2 bg-gray-200 dark:bg-gray-700"
                indicatorColor={currentColor}
                testID="health-score-progress"
            />
        </Card>
    );
} 