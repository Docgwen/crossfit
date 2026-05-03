import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';

import { AppProvider } from './src/AppContext';
import { T } from './src/theme';

import WodScreen from './src/screens/WodScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PRScreen from './src/screens/PRScreen';
import StatsScreen from './src/screens/StatsScreen';
import FlipCoverScreen from './src/screens/FlipCoverScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function TabNavigator({ navigation: rootNav }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: T.bg0 },
        headerTintColor: T.textPrimary,
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => rootNav.navigate('FlipCover')}
            style={{
              marginRight: 16,
              backgroundColor: T.bg2,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 11, fontFamily: 'DMMono_400Regular', color: T.textSecondary }}>
              🔒 Couverture Flip
            </Text>
          </TouchableOpacity>
        ),
        headerTitle: '',
        tabBarStyle: {
          backgroundColor: T.bg1,
          borderTopColor: T.bg3,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: T.accentColor,
        tabBarInactiveTintColor: T.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'DMMono_400Regular',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused }) => {
          const icons = { WOD: '⚡', Histo: '🕐', PR: '🏆', Stats: '📊' };
          return (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
              {icons[route.name]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="WOD" component={WodScreen} options={{ tabBarLabel: 'WOD' }} />
      <Tab.Screen name="Histo" component={HistoryScreen} options={{ tabBarLabel: 'HISTO' }} />
      <Tab.Screen name="PR" component={PRScreen} options={{ tabBarLabel: 'PR' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: 'STATS' }} />
    </Tab.Navigator>
  );
}

const navTheme = {
  dark: true,
  colors: {
    primary: T.accentColor,
    background: T.bg0,
    card: T.bg1,
    text: T.textPrimary,
    border: T.bg3,
    notification: T.accentColor,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg0, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: T.accentColor, fontSize: 32 }}>⚡</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Main" component={TabNavigator} />
            <RootStack.Screen
              name="FlipCover"
              component={FlipCoverScreen}
              options={{ presentation: 'modal' }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
