import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text as RNText } from 'react-native';
import { MetricCard } from '~/components/ui/MetricCard';

// Mock dependencies
jest.mock('~/components/ui/card', () => ({
    Card: ({ className, children, testID }: any) => (
        <View testID={testID} className={className}>{children}</View>
    ),
}));

jest.mock('~/components/ui/text', () => ({
    Text: ({ className, children }: any) => (
        <RNText className={className}>{children}</RNText>
    ),
}));

jest.mock('~/lib/utils', () => ({
    cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

// Create a mock icon component for testing
const MockIcon = () => <View testID="mock-icon" />;

describe('MetricCard', () => {
    it('renders correctly with minimal props', () => {
        const { getByText, getByTestId } = render(
            <MetricCard
                icon={<MockIcon />}
                title="Test Title"
                value="Test Value"
            />
        );

        expect(getByTestId('metric-card')).toBeTruthy();
        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Test Value')).toBeTruthy();
    });

    it('renders correctly with all props', () => {
        const { getByText, getByTestId } = render(
            <MetricCard
                icon={<MockIcon />}
                title="Test Title"
                value="Test Value"
                subtitle="Test Subtitle"
                iconColor="text-red-500"
                className="extra-class"
                testID="custom-metric-card"
            />
        );

        expect(getByTestId('custom-metric-card')).toBeTruthy();
        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Test Value')).toBeTruthy();
        expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('uses default iconColor when not provided', () => {
        const { UNSAFE_getAllByType } = render(
            <MetricCard
                icon={<MockIcon />}
                title="Test Title"
                value="Test Value"
                testID="default-icon-color-card"
            />
        );

        // Since we can't directly check className in RN testing library,
        // we need to use implementation details
        const views = UNSAFE_getAllByType(View);
        const iconView = views.find(view =>
            view.props.className && view.props.className.includes('text-primary')
        );

        expect(iconView).toBeTruthy();
    });

    it('applies custom iconColor when provided', () => {
        const { UNSAFE_getAllByType } = render(
            <MetricCard
                icon={<MockIcon />}
                title="Test Title"
                value="Test Value"
                iconColor="text-purple-500"
                testID="custom-icon-color-card"
            />
        );

        // Find the view that contains the icon
        const views = UNSAFE_getAllByType(View);
        const iconView = views.find(view =>
            view.props.className && view.props.className.includes('text-purple-500')
        );

        expect(iconView).toBeTruthy();
    });

    it('applies custom className to Card', () => {
        const { getByTestId } = render(
            <MetricCard
                icon={<MockIcon />}
                title="Test Title"
                value="Test Value"
                className="custom-test-class"
                testID="custom-class-card"
            />
        );

        const card = getByTestId('custom-class-card');
        expect(card.props.className).toContain('custom-test-class');
    });
}); 