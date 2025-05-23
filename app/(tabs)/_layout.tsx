import { Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { Settings } from '~/lib/icons/Settings';
import { Analysis } from '~/lib/icons/Analysis';
import { Home } from '~/lib/icons/Home';

export default function TabsLayout() {
    const { isDarkColorScheme } = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
                },
                headerStyle: {
                    backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
                },
                headerTintColor: isDarkColorScheme ? NAV_THEME.dark.text : NAV_THEME.light.text,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ai-analysis"
                options={{
                    title: 'AI Analysis',
                    tabBarIcon: ({ color }) => <Analysis size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                }}
            />
        </Tabs>
    );
} 