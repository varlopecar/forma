import { render, fireEvent } from '@testing-library/react-native';
import { WorkoutAnalysisCard } from '~/components/dashboard/WorkoutAnalysisCard';
import { useMockWorkoutData } from '~/hooks/useMockWorkoutData';
import { useAppTranslation } from '~/hooks/useAppTranslation';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush
    })
}));

// Mock the hooks
jest.mock('~/hooks/useAppTranslation');
jest.mock('~/hooks/useMockWorkoutData');

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock the UI components
jest.mock('~/components/ui/card', () => ({
    Card: 'Card',
}));

jest.mock('~/components/ui/text', () => ({
    Text: 'Text',
}));

jest.mock('~/lib/icons/Dumbbell', () => ({
    Dumbbell: 'Dumbbell',
}));

describe('WorkoutAnalysisCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock translation hook
        (useAppTranslation as jest.Mock).mockImplementation((namespace) => ({
            t: jest.fn((key: string) => {
                if (namespace === 'businessLogic') {
                    return {
                        'workout.types.push': 'Push day - High strength',
                        'workout.types.pull': 'Pull day',
                        'workout.types.legs': 'Legs day',
                        'workout.types.cardio': 'Cardio',
                        'workout.types.rest': 'Rest',
                        'workout.intensity.high': 'High',
                        'workout.intensity.medium': 'Medium',
                        'workout.intensity.low': 'Low'
                    }[key] || key;
                } else {
                    return {
                        'title': 'Workout Analysis',
                        'aiRecommendation.title': 'AI Recommendation of the day',
                        'recentWorkouts.title': 'Recent Workouts',
                        'recentWorkouts.today': 'Today',
                        'recentWorkouts.yesterday': 'Yesterday',
                        'recentWorkouts.daysAgo': '{{count}} days ago',
                        'weeklyIntensity': 'Weekly Intensity'
                    }[key] || key;
                }
            }),
            i18n: { language: 'en' }
        }));

        // Setup mock workout data
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        (useMockWorkoutData as jest.Mock).mockReturnValue({
            recentSessions: [
                {
                    id: '1',
                    date: twoDaysAgo,
                    type: 'pull',
                    intensity: 'medium',
                    duration: 45,
                    effortPoints: [65, 70, 85, 75, 60]
                },
                {
                    id: '2',
                    date: yesterday,
                    type: 'legs',
                    intensity: 'high',
                    duration: 60,
                    effortPoints: [70, 85, 90, 95, 75]
                },
                {
                    id: '3',
                    date: today,
                    type: 'rest',
                    intensity: 'low',
                    duration: 0,
                    effortPoints: [0, 0, 0, 0, 0]
                }
            ],
            recommendation: {
                type: 'push',
                intensity: 'high'
            }
        });
    });

    it('renders the component correctly', () => {
        const { getByTestId } = render(<WorkoutAnalysisCard />);

        // Check main elements are rendered
        expect(getByTestId('workout-analysis-card')).toBeTruthy();
        expect(getByTestId('workout-analysis-title')).toBeTruthy();
        expect(getByTestId('workout-icon')).toBeTruthy();
        expect(getByTestId('ai-recommendation')).toBeTruthy();
        expect(getByTestId('recent-workouts-title')).toBeTruthy();
        expect(getByTestId('view-more-button')).toBeTruthy();
    });

    it('renders correct number of workout sessions', () => {
        const { getByTestId } = render(<WorkoutAnalysisCard />);

        // Check all sessions are rendered
        expect(getByTestId('workout-session-1')).toBeTruthy();
        expect(getByTestId('workout-session-2')).toBeTruthy();
        expect(getByTestId('workout-session-3')).toBeTruthy();
    });

    it('navigates to AI Analysis page when view more button is pressed', () => {
        const { getByTestId } = render(<WorkoutAnalysisCard />);

        // Press the button and check if navigation was triggered
        fireEvent.press(getByTestId('view-more-button'));
        expect(mockPush).toHaveBeenCalledWith('/ai-analysis');
    });

    it('passes className prop correctly', () => {
        const result = render(<WorkoutAnalysisCard className="custom-class" />);
        expect(result).toBeTruthy();
    });

    it('renders mini bar charts for each workout session', () => {
        const { getAllByTestId } = render(<WorkoutAnalysisCard />);
        const charts = getAllByTestId('mini-bar-chart');
        expect(charts.length).toBe(3);
    });
}); 