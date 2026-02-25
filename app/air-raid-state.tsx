import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { regionData } from './constants/regionsData';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import {
  getCurrentStatus,
  defineAlertFromStatus,
} from './utils/air-raid-utils';
import AnimatedButton from './components/AnimatedButton';
import UkraineAlertStatus from './components/UkraineAlertStatus';
import { Typography, Spacing, Radius } from './constants/theme';
import { useTheme } from './context/ThemeContext';

function PulsingRing() {
  const { C } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
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
  container: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function AirRaidState() {
  const { C } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    uid: number;
  } | null>(null);
  const [isAlert, setIsAlert] = useState(false);
  const [alertStatusText, setAlertStatusText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

  const { width } = useWindowDimensions();
  const dropdownWidth = width * 0.85;

  useEffect(() => {
    setAlertStatusText('');
    setIsAlert(false);
  }, [selectedRegion]);

  const params = useLocalSearchParams();

  const initialSelectedRegion = useMemo(() => {
    if (params.name && params.uid) {
      return {
        name: String(params.name),
        uid: Number(params.uid),
      };
    }
    return null;
  }, [params.name, params.uid]);

  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    if (isError) {
      setDisableButtons(true);
      const timeout = setTimeout(() => {
        setDisableButtons(false);
      }, 2 * 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isError]);

  useEffect(() => {
    if (
      initialSelectedRegion &&
      (!selectedRegion || selectedRegion.uid !== initialSelectedRegion.uid)
    ) {
      setSelectedRegion(initialSelectedRegion);

      const index = regionData.findIndex(
        (region) => region.uid === initialSelectedRegion.uid
      );
      if (index !== -1) {
        dropdownRef.current?.selectIndex(index);
      }
    }
  }, [initialSelectedRegion]);

  const stateHandler = async () => {
    setIsFetching(true);

    try {
      const status = await getCurrentStatus(selectedRegion?.uid!);
      const alert = defineAlertFromStatus(status);
      setIsAlert(alert);

      if (status === 'A') {
        setAlertStatusText(
          `There is an existing alert in ${selectedRegion?.name}, be careful`
        );
      } else if (status === 'P') {
        setAlertStatusText(
          `There is partial alert in ${selectedRegion?.name}, it is better to stay at home today`
        );
      } else {
        setAlertStatusText(
          `Currently there is no existing alert in ${selectedRegion?.name}`
        );
      }

      Haptics.notificationAsync(
        alert
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success
      );
    } catch (e) {
      setIsError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsFetching(false);
    }
  };

  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ title: 'Air Raid State' }} />

      <Snackbar visible={isError} onDismiss={() => setIsError(false)}>
        There was occured an error. Please try later.
      </Snackbar>

      {isFetching && <PulsingRing />}

      <Animated.View entering={FadeInDown.delay(0).duration(400)}>
        <Text style={[styles.title, { color: C.textPrimary }]}>Choose your region</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(400)}>
        <SelectDropdown
          ref={dropdownRef}
          data={regionData}
          onSelect={(selectedItem) => {
            setSelectedRegion(selectedItem);
          }}
          defaultValue={selectedRegion}
          renderButton={(selectedItem) => (
            <View
              style={[
                styles.dropdownButtonStyle,
                { width: dropdownWidth, backgroundColor: C.surface, borderColor: C.border },
              ]}
            >
              <Text style={[styles.dropdownButtonTxtStyle, { color: C.textPrimary }]}>
                {(selectedItem && selectedItem.name) || 'Please select region'}
              </Text>
            </View>
          )}
          renderItem={(item, _index, isSelected) => (
            <View
              style={[
                styles.dropdownItemStyle,
                { backgroundColor: C.surface },
                isSelected && { backgroundColor: C.border },
              ]}
            >
              <Text style={[styles.dropdownItemTxtStyle, { color: C.textPrimary }]}>
                {item.name}
              </Text>
            </View>
          )}
          dropdownStyle={[
            styles.dropdownMenuStyle,
            { width: dropdownWidth, backgroundColor: C.surface, borderColor: C.border },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(160).duration(400)}
        style={styles.buttonsContainer}
      >
        <AnimatedButton
          disabled={disableButtons}
          label="Get the state"
          icon="radio-outline"
          variant="primary"
          onPress={stateHandler}
          style={styles.button}
        />

        {!isAlert && (
          <AnimatedButton
            disabled={disableButtons}
            label="Predict"
            icon="analytics-outline"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/air-raid-prediction',
                params: { ...selectedRegion },
              })
            }
            style={styles.button}
          />
        )}
      </Animated.View>

      {alertStatusText && selectedRegion && (
        <Animated.View entering={SlideInDown.springify().damping(18)}>
          <UkraineAlertStatus
            regionName={selectedRegion.name}
            hasAlert={isAlert}
          />
          <Text style={[styles.alertMessage, { color: C.textSecondary }]}>
            {alertStatusText}
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    marginBottom: 12,
  },
  dropdownButtonStyle: {
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: Spacing.md,
  },
  dropdownButtonTxtStyle: {
    ...Typography.bodyMd,
    textAlign: 'center',
  },
  dropdownMenuStyle: {
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  dropdownItemStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownItemTxtStyle: {
    ...Typography.body,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    justifyContent: 'center',
  },
  button: {
    borderRadius: Radius.sm,
  },
  alertMessage: {
    ...Typography.bodyMd,
    fontSize: 18,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
});
