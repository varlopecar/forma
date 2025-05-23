import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../lib/auth/AuthContext';
import { Link } from 'expo-router';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card';
import { useAppTranslation } from '~/hooks/useAppTranslation';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();
    const { t } = useAppTranslation('auth');

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (err) {
            // Error is handled by the auth context
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-background">
            <Card>
                <CardHeader>
                    <Text className="text-2xl font-bold text-center text-foreground">
                        {t('login.title')}
                    </Text>
                    {error && (
                        <Text className="text-destructive text-center">
                            {t(`errors.${error === 'Invalid credentials' ? 'invalidCredentials' : 'generic'}`)}
                        </Text>
                    )}
                </CardHeader>

                <CardContent>
                    <View style={{ gap: 16 }}>
                        <Input
                            placeholder={t('login.email')}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            testID="email-input"
                        />

                        <Input
                            placeholder={t('login.password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            testID="password-input"
                        />
                    </View>
                </CardContent>

                <CardFooter className="flex-col space-y-4">
                    <Button
                        onPress={handleLogin}
                        disabled={isLoading}
                        testID="login-button"
                        className="w-full"
                    >
                        {isLoading ? (
                            <Text className="text-primary-foreground">{t('status.loading', { ns: 'generic' })}</Text>
                        ) : (
                            <Text className="text-primary-foreground">{t('login.submit')}</Text>
                        )}
                    </Button>

                    <View className="flex-row justify-center">
                        <Text className="text-muted-foreground">{t('login.noAccount')} </Text>
                        <Link href="/register" className="text-primary">
                            {t('login.register')}
                        </Link>
                    </View>
                </CardFooter>
            </Card>
        </View>
    );
} 