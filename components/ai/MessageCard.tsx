import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

export interface MessageCardProps {
    content: string;
    isUser: boolean;
    className?: string;
    testID?: string;
}

export function MessageCard({ content, isUser, className, testID }: MessageCardProps) {
    return (
        <View
            className={cn(
                'mb-2 max-w-[85%] p-3 rounded-xl',
                isUser
                    ? 'bg-primary self-end rounded-tr-none'
                    : 'bg-secondary self-start rounded-tl-none',
                className
            )}
            testID={testID || 'message-card'}
        >
            <Text
                className={cn(
                    'text-sm',
                    isUser ? 'text-primary-foreground' : 'text-secondary-foreground'
                )}
            >
                {content}
            </Text>
        </View>
    );
} 