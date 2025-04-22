import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Coffee } from '~/lib/icons/Coffee';
import { Moon } from '~/lib/icons/Moon';
import { Zap } from '~/lib/icons/Zap';
import { useMockWorkoutData } from '~/hooks/useMockWorkoutData';
import { useAppTranslation } from '~/hooks/useAppTranslation';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Dumbbell } from '~/lib/icons/Dumbbell';
import { Input } from '~/components/ui/input';
import { MessageCard } from '~/components/ai/MessageCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MetricCard } from '~/components/ui/MetricCard';

const mockAIResponses = [
    "Based on your recent workout history, I recommend focusing on recovery today. Your high-intensity leg workout yesterday needs proper recovery time.",
    "Your sleep patterns show improvement! You're averaging 7.5 hours, which is optimal for muscle recovery and cognitive function.",
    "I notice your nutrition has been consistent. Consider adding more protein on workout days to support muscle growth.",
    "Your health score is improving steadily. Keep up the consistent workout schedule and balanced nutrition.",
    "Looking at your data, I suggest a moderate cardio session today to complement your strength training routine."
];

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Adjusted layout structure
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

        const userMessage = { role: 'user' as const, content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // For React Native, we're using mock responses
        // In a production app, you would call an API route that handles the OpenAI integration
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * mockAIResponses.length);
            const aiResponse = {
                role: 'assistant' as const,
                content: mockAIResponses[randomIndex]
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    // This would be the actual OpenAI implementation in a server environment
    const processMessageWithOpenAI = async (messages: Message[]) => {
        // With AI SDK 4.x, we would use streamText instead of direct OpenAI API calls
        const result = await streamText({
            model: openai('o3-mini'),
            messages: messages.map(m => ({
                role: m.role,
                content: [{ type: 'text', text: m.content }]
            })),
            providerOptions: {
                openai: {
                    reasoningEffort: 'low',
                },
            },
        });

        return result;
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    title: 'AI Analysis',
                    headerTitleStyle: { fontWeight: 'bold' }
                }}
            />

            {/* Add top safe area padding if needed */}
            <View
                className="flex-1"
                style={{
                    paddingTop: insets.top > 0 ? 0 : 8, // Only add padding if not in a safe area
                }}
            >
                {/* Context Cards - Fixed height */}
                <View className="max-h-[110px]">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-4 pt-2 pb-2"
                        style={{
                            marginLeft: insets.left, // Respect left safe area
                            marginRight: insets.right // Respect right safe area
                        }}
                    >
                        <MetricCard
                            icon={<Dumbbell size={20} />}
                            title="Workout"
                            value={t(`workout.types.${recommendation.type}`.split(' ')[0])}
                            iconColor="text-blue-500"
                            className="mr-3 p-2 h-[90px] w-[130px]"
                            testID="workout-metric"
                        />

                        <MetricCard
                            icon={<Moon size={20} />}
                            title="Sleep"
                            value="7.5 hrs"
                            subtitle="Last Night"
                            iconColor="text-purple-500"
                            className="mr-3 p-2 h-[90px] w-[130px]"
                            testID="sleep-metric"
                        />

                        <MetricCard
                            icon={<Coffee size={20} />}
                            title="Nutrition"
                            value="1,850 cal"
                            subtitle="Today"
                            iconColor="text-orange-500"
                            className="mr-3 p-2 h-[90px] w-[130px]"
                            testID="nutrition-metric"
                        />

                        <MetricCard
                            icon={<Zap size={20} />}
                            title="Health"
                            value="75/100"
                            subtitle="Score"
                            iconColor="text-green-500"
                            className="p-2 h-[90px] w-[130px]"
                            testID="health-metric"
                        />
                    </ScrollView>
                </View>

                {/* Chat Messages - Flex grow to take available space */}
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

                {/* Input Area - Fixed at bottom with safe area considerations */}
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