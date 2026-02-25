import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { predictAirRaid, PredictionLevel } from './utils/air-raid-utils';
import { Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, Radius } from './constants/theme';
import { useTheme } from './context/ThemeContext';
import { useLocale } from './context/LocaleContext';

function PulsingRing() {
  const { C } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.35, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={pulseStyles.container}>
      <Animated.View style={[pulseStyles.ring, { borderColor: C.primary }, ringStyle]} />
      <View style={pulseStyles.iconWrapper}>
        <Ionicons name="shield" size={40} color={C.primary} />
      </View>
    </View>
  );
}

const pulseStyles = StyleSheet.create({
  container: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 90, height: 90, borderRadius: 45, borderWidth: 2 },
  iconWrapper: { alignItems: 'center', justifyContent: 'center' },
});

export default function AirRaidPrediction() {
  const { C } = useTheme();
  const { t } = useLocale();
  const { uid, name } = useLocalSearchParams();
  const [level, setLevel] = useState<PredictionLevel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState(false);

  const { width } = useWindowDimensions();

  const levelColor: Record<PredictionLevel, string> = {
    high: C.alert,
    medium: '#F97316',
    low: C.safe,
  };

  const levelText: Record<PredictionLevel, string> = {
    high: t.predictionHigh,
    medium: t.predictionMedium,
    low: t.predictionLow,
  };

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!uid) return;
      try {
        const result = await predictAirRaid(parseInt(uid as string));
        setLevel(result ?? 'low');
      } catch {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [uid, name]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ title: t.titlePrediction }} />

      <Snackbar visible={isError} onDismiss={() => setIsError(false)}>
        {t.errorGeneric}
      </Snackbar>

      {loading ? (
        <PulsingRing />
      ) : (
        <Animated.View
          entering={FadeInDown.springify().damping(20)}
          style={[styles.card, { width: width * 0.88, backgroundColor: C.surface, borderColor: C.border }]}
        >
          <Ionicons name="analytics" size={40} color={C.primary} style={styles.cardIcon} />
          <Text style={[styles.title, { color: C.textSecondary }]}>{t.predictionFor}</Text>
          <Text style={[styles.region, { color: C.textPrimary }]}>{name}</Text>
          <Text style={[styles.probability, { color: C.textSecondary }]}>
            {t.probabilityLabel}{'\n '}
            <Text style={[styles.highlight, { color: level ? levelColor[level] : C.textPrimary }]}>
              {level ? levelText[level] : ''}
            </Text>
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  card: { padding: 28, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center' },
  cardIcon: { marginBottom: Spacing.md },
  title: { ...Typography.title, marginBottom: 4 },
  region: { ...Typography.heading, marginBottom: Spacing.md },
  probability: { ...Typography.body, textAlign: 'center' },
  highlight: { fontFamily: 'Inter_700Bold', fontSize: 18 },
});
