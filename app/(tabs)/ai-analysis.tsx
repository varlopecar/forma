import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { useMockWorkoutData } from '~/hooks/useMockWorkoutData';
import { useAppTranslation } from '~/hooks/useAppTranslation';
import { generateText } from 'ai';
import { Input } from '~/components/ui/input';
import { MessageCard } from '~/components/ai/MessageCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createOpenAI } from '@ai-sdk/openai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Configure OpenAI provider with proper settings
const ai = createOpenAI({
    compatibility: 'strict',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
});

export default function AIAnalysisScreen() {
    const { t } = useAppTranslation("businessLogic");
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I\'m your AI fitness assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { recommendation } = useMockWorkoutData();
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { text } = await generateText({
                model: ai('gpt-3.5-turbo'),
                messages: [...messages, userMessage].map(m => ({
                    role: m.role,
                    content: m.content
                })),
                temperature: 0.7,
            });

            const aiMessage = { role: 'assistant' as const, content: text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = { role: 'assistant' as const, content: 'I apologize, but I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View
                className="flex-1"
                style={{
                    paddingTop: insets.top > 0 ? 0 : 8,
                }}
            >
                <View className="flex-1">
                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1"
                        contentContainerStyle={{
                            padding: 16,
                            paddingLeft: Math.max(16, insets.left + 8),
                            paddingRight: Math.max(16, insets.right + 8)
                        }}
                        testID="messages-container"
                        keyboardShouldPersistTaps="handled"
                    >
                        {messages.map((message, index) => (
                            <MessageCard
                                key={index}
                                content={message.content}
                                isUser={message.role === 'user'}
                                testID={`message-${index}`}
                            />
                        ))}

                        {isLoading && (
                            <MessageCard
                                content="..."
                                isUser={false}
                                testID="loading-indicator"
                            />
                        )}
                    </ScrollView>
                </View>

                <View
                    className="border-t border-[#e5e5e5] bg-background"
                    style={{
                        paddingTop: 16,
                        paddingBottom: Math.max(insets.bottom, 16),
                        paddingLeft: Math.max(16, insets.left + 8),
                        paddingRight: Math.max(16, insets.right + 8)
                    }}
                >
                    <View className="flex-row items-center">
                        <Input
                            className="flex-1 min-h-[44px] mr-2"
                            placeholder="Ask me about your fitness..."
                            value={input}
                            onChangeText={setInput}
                            multiline
                            testID="message-input"
                        />
                        <Pressable
                            className={`p-3 rounded-lg ${input.trim() ? 'bg-[#0284c7] text-white' : 'bg-[#e5e5e5] text-[#71717a]'}`}
                            onPress={handleSend}
                            disabled={!input.trim() || isLoading}
                            testID="send-button"
                        >
                            <Text className={input.trim() ? 'text-white' : 'text-[#71717a]'}>Send</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
} 