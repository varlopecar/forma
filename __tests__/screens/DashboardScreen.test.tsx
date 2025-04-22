import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text as RNText, ViewProps, TextProps } from 'react-native';
import DashboardScreen from '~/app/index';
import { useAppTranslation } from '~/hooks/useAppTranslation';
import { useMockWorkoutData } from '~/hooks/useMockWorkoutData';
import { useHealthScore } from '~/hooks/useHealthScore';

// Mock hooks
jest.mock('~/hooks/useAppTranslation');
jest.mock('~/hooks/useMockWorkoutData');
jest.mock('~/hooks/useHealthScore');

// Mock components
jest.mock('~/components/HealthScoreCard', () => ({
    HealthScoreCard: ({ score, testID }: { score: number; testID?: string }) => (
        <View testID={testID || 'health-score-card'}>
            <RNText>Health Score: {score}</RNText>
        </View>
    ),
}));

jest.mock('~/components/dashboard/WorkoutAnalysisCard', () => ({
    WorkoutAnalysisCard: ({ testID }: { testID?: string }) => (
        <View testID={testID || 'workout-analysis-card'}>
            <RNText>Workout Analysis</RNText>
        </View>
    ),
}));

jest.mock('~/components/ui/MetricCard', () => ({
    MetricCard: ({ icon, title, value, subtitle, testID }: { icon: React.ReactNode; title: string; value: string; subtitle?: string; testID?: string }) => (
        <View testID={testID}>
            <View data-testid={`${testID}-icon`}>{icon}</View>
            <RNText data-testid={`${testID}-title`}>{title}</RNText>
            <RNText data-testid={`${testID}-value`}>{value}</RNText>
            {subtitle && <RNText data-testid={`${testID}-subtitle`}>{subtitle}</RNText>}
        </View>
    ),
}));

// Mock icon utility
jest.mock('~/lib/icons/iconWithClassName', () => ({
    iconWithClassName: jest.fn()
}));

// Mock icons
jest.mock('~/lib/icons/Activity', () => {
    const MockActivity = () => <View testID="activity-icon" />;
    return { Activity: MockActivity };
});

jest.mock('~/lib/icons/Brain', () => {
    const MockBrain = () => <View testID="brain-icon" />;
    return { Brain: MockBrain };
});

jest.mock('~/lib/icons/Coffee', () => {
    const MockCoffee = () => <View testID="coffee-icon" />;
    return { Coffee: MockCoffee };
});

jest.mock('~/lib/icons/Moon', () => {
    const MockMoon = () => <View testID="moon-icon" />;
    return { Moon: MockMoon };
});

// Mock UI components
jest.mock('~/components/ui/text', () => ({
    Text: (props: TextProps) => <RNText {...props} />,
}));

describe('DashboardScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock translation hook
        (useAppTranslation as jest.Mock).mockReturnValue({
            t: jest.fn((key: string) => key),
            i18n: { language: 'en' }
        });

        // Mock workout data
        (useMockWorkoutData as jest.Mock).mockReturnValue({
            recentSessions: [],
            recommendation: {
                type: 'push',
                intensity: 'high'
            }
        });

        // Mock health score
        (useHealthScore as jest.Mock).mockReturnValue({
            scoreStyle: {},
            iconStyle: {},
            currentColor: '#4CAF50',
            displayScore: '45',
            interpretation: { text: 'low', color: '#4CAF50' }
        });
    });

    it('renders the Dashboard screen correctly', () => {
        const { getByTestId } = render(<DashboardScreen />);

        // Check health score card
        expect(getByTestId('health-score-card')).toBeTruthy();

        // Check workout analysis card
        expect(getByTestId('workout-analysis-card')).toBeTruthy();

        // Check for all metric cards
        expect(getByTestId('workout-metric')).toBeTruthy();
        expect(getByTestId('sleep-metric')).toBeTruthy();
        expect(getByTestId('nutrition-metric')).toBeTruthy();
        expect(getByTestId('ai-analysis-metric')).toBeTruthy();
    });

    it('displays correct information in metric cards', () => {
        const { getByTestId } = render(<DashboardScreen />);

        // Check Workout MetricCard content
        expect(getByTestId('workout-metric-title').props.children).toBe('Workout');
        expect(getByTestId('workout-metric-value').props.children).toBe('45 min');
        expect(getByTestId('workout-metric-subtitle').props.children).toBe('Today\'s Activity');

        // Check Sleep MetricCard content
        expect(getByTestId('sleep-metric-title').props.children).toBe('Sleep');
        expect(getByTestId('sleep-metric-value').props.children).toBe('7.5 hrs');
        expect(getByTestId('sleep-metric-subtitle').props.children).toBe('Last Night');

        // Check Nutrition MetricCard content
        expect(getByTestId('nutrition-metric-title').props.children).toBe('Nutrition');
        expect(getByTestId('nutrition-metric-value').props.children).toBe('1,850');
        expect(getByTestId('nutrition-metric-subtitle').props.children).toBe('Calories Today');

        // Check AI Analysis MetricCard content
        expect(getByTestId('ai-analysis-metric-title').props.children).toBe('AI Analysis');
        expect(getByTestId('ai-analysis-metric-value').props.children).toBe('92%');
        expect(getByTestId('ai-analysis-metric-subtitle').props.children).toBe('Recovery Score');
    });
}); 