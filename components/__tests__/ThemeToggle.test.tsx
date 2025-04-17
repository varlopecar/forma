import { render, fireEvent } from '@testing-library/react-native';
import { ThemeToggle } from '../ThemeToggle';
import { useColorScheme } from '~/lib/useColorScheme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';

jest.mock('~/lib/useColorScheme');
jest.mock('~/lib/android-navigation-bar');

describe('ThemeToggle', () => {
    const mockSetColorScheme = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useColorScheme as jest.Mock).mockReturnValue({
            isDarkColorScheme: false,
            setColorScheme: mockSetColorScheme,
        });
    });

    it('renders sun icon when in light mode', () => {
        const { getAllByTestId } = render(<ThemeToggle />);
        const sunIcons = getAllByTestId('sun-icon');
        expect(sunIcons.length).toBeGreaterThan(0);
    });

    it('renders moon icon when in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue({
            isDarkColorScheme: true,
            setColorScheme: mockSetColorScheme,
        });

        const { getAllByTestId } = render(<ThemeToggle />);
        const moonIcons = getAllByTestId('moon-star-icon');
        expect(moonIcons.length).toBeGreaterThan(0);
    });

    it('toggles theme from light to dark when pressed', () => {
        const { getByTestId } = render(<ThemeToggle />);
        fireEvent.press(getByTestId('theme-toggle'));
        expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
        expect(setAndroidNavigationBar).toHaveBeenCalledWith('dark');
    });

    it('toggles theme from dark to light when pressed in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue({
            isDarkColorScheme: true,
            setColorScheme: mockSetColorScheme,
        });

        const { getByTestId } = render(<ThemeToggle />);
        fireEvent.press(getByTestId('theme-toggle'));
        expect(mockSetColorScheme).toHaveBeenCalledWith('light');
        expect(setAndroidNavigationBar).toHaveBeenCalledWith('light');
    });

    it('shows sun icon in light mode', () => {
        const { getAllByTestId, queryAllByTestId } = render(<ThemeToggle />);
        const sunIcons = getAllByTestId('sun-icon');
        const moonIcons = queryAllByTestId('moon-star-icon');
        expect(sunIcons.length).toBeGreaterThan(0);
        expect(moonIcons.length).toBe(0);
    });

    it('shows moon icon in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue({
            isDarkColorScheme: true,
            setColorScheme: mockSetColorScheme,
        });

        const { getAllByTestId, queryAllByTestId } = render(<ThemeToggle />);
        const moonIcons = getAllByTestId('moon-star-icon');
        const sunIcons = queryAllByTestId('sun-icon');
        expect(moonIcons.length).toBeGreaterThan(0);
        expect(sunIcons.length).toBe(0);
    });

    it('handles undefined color scheme gracefully', () => {
        (useColorScheme as jest.Mock).mockReturnValue({
            isDarkColorScheme: undefined,
            setColorScheme: mockSetColorScheme,
        });

        expect(() => render(<ThemeToggle />)).not.toThrow();
        const { getAllByTestId } = render(<ThemeToggle />);
        const sunIcons = getAllByTestId('sun-icon');
        expect(sunIcons.length).toBeGreaterThan(0);
    });

    it('is interactive', () => {
        const { getByTestId } = render(<ThemeToggle />);
        const toggleButton = getByTestId('theme-toggle');
        fireEvent.press(toggleButton);
        expect(mockSetColorScheme).toHaveBeenCalled();
    });
}); 