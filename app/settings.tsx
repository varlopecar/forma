import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/ui/text';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '~/components/LanguageSelector';

export default function SettingsScreen() {
    const { t } = useTranslation("settings");

    return (
        <View className="flex-1 p-4 bg-background">
            <View className="space-y-6 gap-6">
                {/* Language Select */}
                <LanguageSelector />

                {/* Theme Toggle */}
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg">{t('theme')}</Text>
                    <ThemeToggle />
                </View>
            </View>
        </View>
    );
} 