import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Card } from './ui/card';
import { Text } from './ui/text';
import { cn } from '~/lib/utils';

export interface MetricCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    iconColor?: string;
    className?: string;
    testID?: string;
}

export function MetricCard({
    icon,
    title,
    value,
    subtitle,
    iconColor = 'text-primary',
    className,
    testID
}: MetricCardProps) {
    // Create a copy of the icon with the color class applied
    const styledIcon = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: iconColor
        })
        : icon;

    return (
        <Card
            className={cn('p-4 min-w-[150px]', className)}
            testID={testID || 'metric-card'}
        >
            <View className="flex-row items-center gap-2 mb-3">
                {styledIcon}
                <Text className="text-lg font-medium">{title}</Text>
            </View>
            <View>
                <Text className="text-2xl font-bold">{value}</Text>
                {subtitle && (
                    <Text className="text-muted-foreground">{subtitle}</Text>
                )}
            </View>
        </Card>
    );
} 