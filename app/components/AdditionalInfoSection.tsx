import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedButton from './AnimatedButton';
import { Typography, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function AdditionalInfoSection() {
  const router = useRouter();
  const { C } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.subMessage, { color: C.textSecondary }]}>
        For more detailed information, click the button below
      </Text>

      <AnimatedButton
        label="Additional Information"
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
