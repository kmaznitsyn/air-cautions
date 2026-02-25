import { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { enableLayoutAnimations } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';

SplashScreen.preventAutoHideAsync();
enableLayoutAnimations(true);

function HeaderControls() {
  const { isDark, toggleTheme, C } = useTheme();
  const { locale, toggleLocale } = useLocale();

  return (
    <View style={styles.headerRight}>
      <Pressable onPress={toggleLocale} hitSlop={10} style={styles.langButton}>
        <Text style={[styles.langLabel, { color: C.textPrimary }]}>
          {locale === 'uk' ? 'EN' : 'UA'}
        </Text>
      </Pressable>

      <Pressable onPress={toggleTheme} hitSlop={10}>
        <Ionicons
          name={isDark ? 'sunny-outline' : 'moon-outline'}
          size={22}
          color={C.textPrimary}
        />
      </Pressable>
    </View>
  );
}

function LayoutInner() {
  const { isDark, C } = useTheme();

  const paperTheme = isDark
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          background: C.background,
          surface: C.surface,
          primary: C.primary,
          onPrimary: C.textPrimary,
        },
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          background: C.background,
          surface: C.surface,
          primary: C.primary,
          onPrimary: C.textPrimary,
        },
      };

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.surface },
          headerTintColor: C.textPrimary,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: C.background },
          headerRight: () => <HeaderControls />,
        }}
      />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <LayoutInner />
      </LocaleProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginRight: 4,
  },
  langButton: {
    paddingHorizontal: 2,
  },
  langLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
