import * as React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { HealthScoreCard } from '~/components/HealthScoreCard';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Activity } from '~/lib/icons/Activity';
import { Brain } from '~/lib/icons/Brain';
import { Moon } from '~/lib/icons/Moon';
import { Coffee } from '~/lib/icons/Coffee';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';

export default function Screen() {
  const [healthScore, setHealthScore] = React.useState(45);
  const router = useRouter();

  const increaseScore = () => {
    setHealthScore(prev => Math.min(100, prev + 5));
  };

  const decreaseScore = () => {
    setHealthScore(prev => Math.max(0, prev - 5));
  };

  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='p-4 gap-4'>
        <View className='flex-row justify-between items-center'>
          <Button onPress={decreaseScore} variant="outline">
            <Text>Decrease Score</Text>
          </Button>
          <Button onPress={increaseScore} variant="outline">
            <Text>Increase Score</Text>
          </Button>
        </View>

        <HealthScoreCard score={healthScore} />

        <View className='flex-row flex-wrap gap-4'>
          <Card className='flex-1 min-w-[150px]'>
            <CardHeader className='flex-row items-center gap-2'>
              <Activity size={20} className='text-blue-500' />
              <CardTitle className='text-lg'>Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className='text-2xl font-bold'>45 min</Text>
              <Text className='text-muted-foreground'>Today's Activity</Text>
            </CardContent>
          </Card>

          <Card className='flex-1 min-w-[150px]'>
            <CardHeader className='flex-row items-center gap-2'>
              <Moon size={20} className='text-purple-500' />
              <CardTitle className='text-lg'>Sleep</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className='text-2xl font-bold'>7.5 hrs</Text>
              <Text className='text-muted-foreground'>Last Night</Text>
            </CardContent>
          </Card>

          <Card className='flex-1 min-w-[150px]'>
            <CardHeader className='flex-row items-center gap-2'>
              <Coffee size={20} className='text-orange-500' />
              <CardTitle className='text-lg'>Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className='text-2xl font-bold'>1,850</Text>
              <Text className='text-muted-foreground'>Calories Today</Text>
            </CardContent>
          </Card>

          <Card className='flex-1 min-w-[150px]'>
            <CardHeader className='flex-row items-center gap-2'>
              <Brain size={20} className='text-green-500' />
              <CardTitle className='text-lg'>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className='text-2xl font-bold'>92%</Text>
              <Text className='text-muted-foreground'>Recovery Score</Text>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
