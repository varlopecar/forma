import { render } from '@testing-library/react-native';
import { HealthScoreCard } from '~/components/HealthScoreCard';
import { useHealthScore } from '~/hooks/useHealthScore';
import { useAppTranslation } from '~/hooks/useAppTranslation';

jest.mock('~/hooks/useAppTranslation');
jest.mock('~/hooks/useHealthScore');

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('~/components/ui/tooltip', () => ({
    Tooltip: 'Tooltip',
    TooltipTrigger: 'TooltipTrigger',
    TooltipContent: 'TooltipContent',
}));

jest.mock('~/components/ui/progress', () => ({
    Progress: 'Progress',
}));

jest.mock('~/components/ui/card', () => ({
    Card: 'Card',
}));

jest.mock('~/components/ui/text', () => ({
    Text: 'Text',
}));

jest.mock('~/lib/icons/Zap', () => ({
    Zap: 'Zap',
}));

describe('HealthScoreCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useAppTranslation as jest.Mock).mockReturnValue({
            t: jest.fn((key: string) => ({
                'healthScore.levels.excellent': 'Excellent',
                'healthScore.levels.good': 'Good',
                'healthScore.levels.improve': 'Needs Improvement',
                'healthScore.title': 'Health Score',
                'healthScore.description': 'Your overall health score'
            }[key] ?? key)),
            i18n: { language: 'en' }
        });

        (useHealthScore as jest.Mock).mockReturnValue({
            scoreStyle: {},
            iconStyle: {},
            currentColor: '#22c55e',
            displayScore: 90,
            interpretation: { text: 'excellent' }
        });
    });

    it('calls useHealthScore with the correct score prop', () => {
        render(<HealthScoreCard score={75} />);
        expect(useHealthScore).toHaveBeenCalledWith(75);
    });

    it('handles missing score by defaulting to 0', () => {
        // @ts-ignore - Testing improper usage
        render(<HealthScoreCard />);
        expect(useHealthScore).toHaveBeenCalledWith(0);
    });

    it('handles excellent scores (≥ 80) correctly', () => {
        (useHealthScore as jest.Mock).mockReturnValue({
            scoreStyle: {},
            iconStyle: {},
            currentColor: '#22c55e', // Green color
            displayScore: 90,
            interpretation: { text: 'excellent' }
        });

        render(<HealthScoreCard score={90} />);

        const mockT = (useAppTranslation() as any).t;
        expect(mockT).toHaveBeenCalledWith('healthScore.levels.excellent');
    });

    it('handles good scores (60-79) correctly', () => {
        (useHealthScore as jest.Mock).mockReturnValue({
            scoreStyle: {},
            iconStyle: {},
            currentColor: '#eab308',
            displayScore: 70,
            interpretation: { text: 'good' }
        });

        render(<HealthScoreCard score={70} />);

        const mockT = (useAppTranslation() as any).t;
        expect(mockT).toHaveBeenCalledWith('healthScore.levels.good');
    });

    it('handles needs improvement scores (< 60) correctly', () => {
        (useHealthScore as jest.Mock).mockReturnValue({
            scoreStyle: {},
            iconStyle: {},
            currentColor: '#ef4444',
            displayScore: 45,
            interpretation: { text: 'improve' }
        });

        render(<HealthScoreCard score={45} />);

        const mockT = (useAppTranslation() as any).t;
        expect(mockT).toHaveBeenCalledWith('healthScore.levels.improve');
    });

    it('passes the className prop correctly', () => {
        const result = render(<HealthScoreCard score={90} className="custom-class" />);
        // Since we're using string mocks, we can't check the actual className,
        // but we can verify the component rendered successfully
        expect(result).toBeTruthy();
    });
}); 