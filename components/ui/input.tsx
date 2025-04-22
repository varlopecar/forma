import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { cn } from '~/lib/utils';

export interface InputProps extends TextInputProps {
    error?: boolean;
    className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <TextInput
                ref={ref}
                className={cn(
                    'px-3 py-2 bg-card border border-input rounded-lg text-foreground',
                    'placeholder:text-muted-foreground focus:outline-none',
                    error ? 'border-red-500' : 'focus:border-primary',
                    className
                )}
                placeholderTextColor="#9CA3AF"
                testID="ui-input"
                {...props}
            />
        );
    }
);

Input.displayName = 'Input'; 