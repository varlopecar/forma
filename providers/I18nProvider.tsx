import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/lib/i18n';
import { View, ActivityIndicator } from 'react-native';

interface I18nProviderProps {
    children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initI18n = async () => {
            try {
                await i18n.init();
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing i18n:', error);
            }
        };

        initI18n();
    }, []);

    if (!isInitialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 