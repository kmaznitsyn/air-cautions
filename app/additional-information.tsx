import { Text, View, Linking, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, Radius } from './constants/theme';
import { useTheme } from './context/ThemeContext';

export default function AdditionalInformation() {
  const { C } = useTheme();

  const openLink = () => {
    Linking.openURL('https://alerts.in.ua/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ title: 'Additional Information' }} />

      <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.iconRow}>
          <Ionicons name="warning" size={40} color={C.alert} />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(80).duration(400)}
          style={[styles.title, { color: C.textPrimary }]}
        >
          Air Raid Risk Insight
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(160).duration(400)}
          style={[styles.description, { color: C.textSecondary }]}
        >
          This app helps users assess the current level of danger in specific
          regions based on official alert data.
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(240).duration(400)}
          style={[styles.description, { color: C.textSecondary }]}
        >
          For a complete overview of alerts across all regions and sources, visit{' '}
          <Text style={[styles.link, { color: C.primary }]} onPress={openLink}>
            this page
          </Text>
          .
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.heading,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  link: {
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
});
