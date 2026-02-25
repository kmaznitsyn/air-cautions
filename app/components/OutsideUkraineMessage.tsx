import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AnimatedButton from './AnimatedButton';
import { Typography, Spacing, Radius } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export default function OutsideUkraineMessage() {
  const router = useRouter();
  const { C } = useTheme();
  const { t } = useLocale();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: C.surface, borderColor: C.border },
      ]}
    >
      <View style={styles.iconRow}>
        <Ionicons name="earth" size={28} color={C.textSecondary} />
      </View>
      <Text style={[styles.message, { color: C.textPrimary }]}>
        {t.outsideUkraine}
      </Text>

      <AnimatedButton
        label={t.getAlertState}
        icon="shield-checkmark-outline"
        variant="primary"
        onPress={() => router.navigate('/air-raid-state')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.bodyMd,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  button: {
    alignSelf: 'stretch',
  },
});
