import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { View, TextInput, Text as RNText, ViewProps, TextInputProps, TextProps } from 'react-native';
import AIAnalysisScreen from '~/app/ai-analysis';
import { useMockWorkoutData } from '~/hooks/useMockWorkoutData';
import { useAppTranslation } from '~/hooks/useAppTranslation';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    Stack: {
        Screen: jest.fn().mockReturnValue(null)
    }
}));

// Mock hooks
jest.mock('~/hooks/useAppTranslation');
jest.mock('~/hooks/useMockWorkoutData');

// Mock UI components
jest.mock('~/components/ui/card', () => ({
    Card: (props: ViewProps) => <View {...props} />,
}));

jest.mock('~/components/ui/text', () => ({
    Text: (props: TextProps) => <RNText {...props} />,
}));

jest.mock('~/components/ui/input', () => ({
    Input: ({ onChangeText, value, testID, ...props }: TextInputProps) => (
        <TextInput
            testID={testID}
            onChangeText={onChangeText}
            value={value}
            {...props}
        />
    ),
}));

jest.mock('~/components/ai/MessageCard', () => ({
    MessageCard: ({ content, isUser, testID }: { content: string; isUser: boolean; testID?: string }) => (
        <View testID={testID} accessibilityState={{ checked: isUser }}>
            <RNText>{content}</RNText>
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
jest.mock('~/lib/icons/Dumbbell', () => {
    const MockDumbbell = () => <View testID="dumbbell-icon" />;
    return { Dumbbell: MockDumbbell };
});

jest.mock('~/lib/icons/Coffee', () => {
    const MockCoffee = () => <View testID="coffee-icon" />;
    return { Coffee: MockCoffee };
});

jest.mock('~/lib/icons/Moon', () => {
    const MockMoon = () => <View testID="moon-icon" />;
    return { Moon: MockMoon };
});

jest.mock('~/lib/icons/Zap', () => {
    const MockZap = () => <View testID="zap-icon" />;
    return { Zap: MockZap };
});

// Mock AI SDK
jest.mock('ai', () => ({
    streamText: jest.fn()
}));

jest.mock('@ai-sdk/openai', () => ({
    openai: jest.fn()
}));

describe('AIAnalysisScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Mock translation hook
        (useAppTranslation as jest.Mock).mockReturnValue({
            t: jest.fn((key: string) => 'Translated: ' + key),
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
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the screen correctly', () => {
        const { getByTestId } = render(<AIAnalysisScreen />);

        // Check for metric cards
        expect(getByTestId('workout-metric')).toBeTruthy();
        expect(getByTestId('sleep-metric')).toBeTruthy();
        expect(getByTestId('nutrition-metric')).toBeTruthy();
        expect(getByTestId('health-metric')).toBeTruthy();

        // Check welcome message using message card
        expect(getByTestId('message-0')).toBeTruthy();

        // Check input field and send button
        expect(getByTestId('message-input')).toBeTruthy();
        expect(getByTestId('send-button')).toBeTruthy();
    });

    it('allows sending messages and shows responses', async () => {
        const { getByTestId, getAllByTestId } = render(<AIAnalysisScreen />);

        // Find input and button
        const input = getByTestId('message-input');
        const sendButton = getByTestId('send-button');

        // Enter text and send
        fireEvent.changeText(input, 'What workout should I do today?');
        fireEvent.press(sendButton);

        // Check if user message appears immediately
        expect(getAllByTestId(/message-\d+/).length).toBe(2); // Initial message + user message

        // Check if loading indicator appears
        expect(getByTestId('loading-indicator')).toBeTruthy();

        // Fast-forward the timer to complete the response
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        // Check if AI response was added
        expect(getAllByTestId(/message-\d+/).length).toBe(3); // Initial + user + AI response
    });

    it('disables send button when input is empty', () => {
        const { getByTestId } = render(<AIAnalysisScreen />);
        const sendButton = getByTestId('send-button');

        // Initially the button should have muted colors (disabled)
        const buttonClasses = sendButton.props.className;
        expect(buttonClasses).toContain('bg-muted');

        // Enter text
        fireEvent.changeText(getByTestId('message-input'), 'Hello AI');

        // Now the button should have primary colors (enabled)
        const updatedButtonClasses = sendButton.props.className;
        expect(updatedButtonClasses).toContain('bg-primary');
    });

    it('clears input field after sending a message', () => {
        const { getByTestId } = render(<AIAnalysisScreen />);
        const input = getByTestId('message-input');
        const sendButton = getByTestId('send-button');

        // Enter text and send
        fireEvent.changeText(input, 'What workout should I do today?');
        fireEvent.press(sendButton);

        // Check input was cleared
        expect(input.props.value).toBe('');
    });
}); 