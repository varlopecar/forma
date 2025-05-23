import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { HealthScoreCard } from '~/components/HealthScoreCard';
import { WorkoutAnalysisCard } from '~/components/dashboard/WorkoutAnalysisCard';
import { MetricCard } from '~/components/MetricCard';
import { Activity } from '~/lib/icons/Activity';
import { Brain } from '~/lib/icons/Brain';
import { Moon } from '~/lib/icons/Moon';
import { Coffee } from '~/lib/icons/Coffee';
import { useEffect, useState } from 'react';

export default function DashboardScreen() {
    const [healthScore, setHealthScore] = useState(45);

    useEffect(() => {
        const interval = setInterval(() => {
            setHealthScore(Math.floor(Math.random() * 100));
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ScrollView className='flex-1 bg-background'>
            <View className='p-4 gap-4'>
                <HealthScoreCard score={healthScore} />

                <View className='flex-row flex-wrap gap-4'>
                    <MetricCard
                        icon={<Activity size={20} />}
                        title="Workout"
                        value="45 min"
                        subtitle="Today's Activity"
                        iconColor="text-blue-500"
                        className="flex-1 min-w-[150px]"
                        testID="workout-metric"
                    />

                    <MetricCard
                        icon={<Moon size={20} />}
                        title="Sleep"
                        value="7.5 hrs"
                        subtitle="Last Night"
                        iconColor="text-purple-500"
                        className="flex-1 min-w-[150px]"
                        testID="sleep-metric"
                    />

                    <MetricCard
                        icon={<Coffee size={20} />}
                        title="Nutrition"
                        value="1,850"
                        subtitle="Calories Today"
                        iconColor="text-orange-500"
                        className="flex-1 min-w-[150px]"
                        testID="nutrition-metric"
                    />

                    <MetricCard
                        icon={<Brain size={20} />}
                        title="AI Analysis"
                        value="92%"
                        subtitle="Recovery Score"
                        iconColor="text-green-500"
                        className="flex-1 min-w-[150px]"
                        testID="ai-analysis-metric"
                    />
                </View>

                <WorkoutAnalysisCard />
            </View>
        </ScrollView>
    );
} 