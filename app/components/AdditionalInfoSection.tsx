import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedButton from './AnimatedButton';
import { Typography, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export default function AdditionalInfoSection() {
  const router = useRouter();
  const { C } = useTheme();
  const { t } = useLocale();

  return (
    <View style={styles.section}>
      <Text style={[styles.subMessage, { color: C.textSecondary }]}>
        {t.moreInfoPrompt}
      </Text>

      <AnimatedButton
        label={t.additionalInfo}
        icon="information-circle-outline"
        variant="secondary"
        onPress={() => router.navigate('/additional-information')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  subMessage: {
    ...Typography.label,
    textAlign: 'center',
    marginBottom: Spacing.sm + 4,
  },
  button: {
    alignSelf: 'stretch',
  },
});
