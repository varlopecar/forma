jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
}));

jest.mock('expo-linking', () => ({
    createURL: jest.fn(),
    useURL: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
    const mockAsyncStorage = {
        getItem: jest.fn(() => Promise.resolve(null)),
        setItem: jest.fn(() => Promise.resolve(null)),
        removeItem: jest.fn(() => Promise.resolve(null)),
        clear: jest.fn(() => Promise.resolve(null)),
        getAllKeys: jest.fn(() => Promise.resolve([])),
        multiGet: jest.fn(() => Promise.resolve([])),
        multiSet: jest.fn(() => Promise.resolve(null)),
        multiRemove: jest.fn(() => Promise.resolve(null)),
    };
    return mockAsyncStorage;
});

jest.mock('nativewind', () => ({
    cssInterop: jest.fn(),
    useColorScheme: jest.fn(() => ({
        colorScheme: 'light',
        setColorScheme: jest.fn(),
        toggleColorScheme: jest.fn(),
    })),
})); 