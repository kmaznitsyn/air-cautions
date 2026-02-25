import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Snackbar } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
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

import OutsideUkraineMessage from './components/OutsideUkraineMessage';
import AdditionalInfoSection from './components/AdditionalInfoSection';
import AnimatedButton from './components/AnimatedButton';
import { getUserRegionMatch } from './utils/location-utils';
import { Spacing } from './constants/theme';
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

export default function Index() {
  const { C } = useTheme();
  const { t } = useLocale();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Location.LocationGeocodedAddress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInUkraine, setIsInUkraine] = useState(false);

  const router = useRouter();

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t.errorLocationDenied);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const country = geocoded?.[0]?.country;
      const insideUkraine = country === 'Ukraine';

      setIsInUkraine(insideUkraine);
      if (insideUkraine) {
        setAddresses(geocoded);
        const userRegion = getUserRegionMatch(geocoded);
        router.push({ pathname: '/air-raid-state', params: { ...userRegion } });
      }
    } catch {
      setErrorMsg(t.errorLocationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: C.background }]}>
        <PulsingRing />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ title: t.titleHome }} />
      <Snackbar visible={!!errorMsg} onDismiss={() => setErrorMsg('')}>
        {errorMsg}
      </Snackbar>

      <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.logoContainer}>
        <Ionicons name="shield" size={56} color={C.primary} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.mainContent}>
        {!isInUkraine && <OutsideUkraineMessage />}
        {isInUkraine && addresses !== null && (
          <AnimatedButton
            label={t.getAlertState}
            icon="shield-checkmark-outline"
            variant="primary"
            onPress={() =>
              router.push({
                pathname: '/air-raid-state',
                params: { ...getUserRegionMatch(addresses) },
              })
            }
            style={styles.button}
          />
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <AdditionalInfoSection />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: Spacing.lg, flex: 1, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: Spacing.lg },
  mainContent: { marginBottom: Spacing.md },
  button: { borderRadius: 12, width: '80%', alignSelf: 'center', marginVertical: Spacing.sm },
});
