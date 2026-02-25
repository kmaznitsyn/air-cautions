import { Text, View, Linking, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, Radius } from './constants/theme';
import { useTheme } from './context/ThemeContext';
import { useLocale } from './context/LocaleContext';

export default function AdditionalInformation() {
  const { C } = useTheme();
  const { t } = useLocale();

  const openLink = () => {
    Linking.openURL('https://alerts.in.ua/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ title: t.titleInfo }} />

      <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.iconRow}>
          <Ionicons name="warning" size={40} color={C.alert} />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(80).duration(400)}
          style={[styles.title, { color: C.textPrimary }]}
        >
          {t.infoTitle}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(160).duration(400)}
          style={[styles.description, { color: C.textSecondary }]}
        >
          {t.infoBody1}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(240).duration(400)}
          style={[styles.description, { color: C.textSecondary }]}
        >
          {t.infoBody2}{' '}
          <Text style={[styles.link, { color: C.primary }]} onPress={openLink}>
            {t.infoLink}
          </Text>
          .
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
  card: { borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1 },
  iconRow: { alignItems: 'center', marginBottom: Spacing.md },
  title: { ...Typography.heading, textAlign: 'center', marginBottom: Spacing.md },
  description: { ...Typography.body, textAlign: 'center', marginBottom: 12, lineHeight: 24 },
  link: { fontFamily: 'Inter_600SemiBold', textDecorationLine: 'underline' },
});
