// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
    createURL: jest.fn(),
    useURL: jest.fn(),
})); 