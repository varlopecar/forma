import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/ui/text';
import { useLanguageSwitcher } from '~/hooks/useLanguageSwitcher';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from '~/components/ui/select';

interface LanguageSelectorProps {
    className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
    const { t } = useTranslation("settings");
    const { currentLanguage, changeLanguage, supportedLanguages, isLoading } = useLanguageSwitcher();
    const insets = useSafeAreaInsets();

    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    const handleLanguageChange = (option: { value: string, label: string } | undefined) => {
        if (!option) return;
        changeLanguage(option.value);
    };

    if (isLoading) {
        return (
            <View className={`space-y-2 ${className || ''}`}>
                <Text className="text-lg">{t('language')}</Text>
                <View className="h-10 native:h-12 items-center justify-center">
                    <ActivityIndicator size="small" />
                </View>
            </View>
        );
    }

    return (
        <View className={`space-y-2 ${className || ''}`}>
            <Text className="text-lg">
                {t('language')}
            </Text>
            <Select
                defaultValue={{
                    value: currentLanguage.code,
                    label: currentLanguage.name
                }}
                onValueChange={handleLanguageChange}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        className="text-foreground text-sm native:text-lg"
                        placeholder={t('language')}
                    />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className="w-full">
                    <SelectGroup>
                        <SelectLabel>{t('language')}</SelectLabel>
                        {supportedLanguages.map((language) => (
                            <SelectItem
                                key={language.code}
                                label={language.name}
                                value={language.code}
                            >
                                {language.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </View>
    );
} 