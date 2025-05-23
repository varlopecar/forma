import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/lib/auth/AuthContext';
import { LanguageSelector } from '~/components/LanguageSelector';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function SettingsScreen() {
    const { t } = useTranslation("settings");
    const { logout } = useAuth();

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

                {/* Logout Button */}
                <Button
                    variant="destructive"
                    onPress={logout}
                    className="mt-8"
                >
                    <Text className="text-destructive-foreground">{t('logout')}</Text>
                </Button>
            </View>
        </View>
    );
} 