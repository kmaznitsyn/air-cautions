import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';

type Props = {
  regionName: string;
  hasAlert: boolean;
};

export default function UkraineAlertStatus({ regionName, hasAlert }: Props) {
  const { C } = useTheme();
  const { t } = useLocale();
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (hasAlert) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 700 }),
          withTiming(1, { duration: 700 })
        ),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [hasAlert]);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: hasAlert
      ? `rgba(239,68,68,${pulseOpacity.value})`
      : C.safe,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: hasAlert ? C.alertBg : C.safeBg },
        animatedBorderStyle,
      ]}
    >
      <View style={styles.row}>
        <Ionicons
          name={hasAlert ? 'warning' : 'checkmark-circle'}
          size={22}
          color={hasAlert ? C.alert : C.safe}
          style={styles.icon}
        />
        <Text style={[styles.title, { color: C.textPrimary }]}>
          {t.regionLabel}{' '}
          <Text style={[styles.region, { color: C.primary }]}>{regionName}</Text>
        </Text>
      </View>
      <Text style={[styles.status, { color: hasAlert ? C.alert : C.safe }]}>
        {hasAlert ? t.statusAlert : t.statusSafe}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    ...Typography.title,
  },
  region: {
    ...Typography.heading,
  },
  status: {
    ...Typography.bodyMd,
    textAlign: 'center',
  },
});
