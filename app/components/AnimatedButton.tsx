import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AnimatedButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
}: Props) {
  const { C } = useTheme();
  const scale = useSharedValue(1);

  const variantBg = {
    primary: C.primary,
    secondary: 'transparent',
    danger: C.alert,
  } as const;

  const variantTextColor = {
    primary: C.textPrimary,
    secondary: C.textSecondary,
    danger: C.textPrimary,
  } as const;

  const variantBorder = {
    primary: { borderWidth: 0, borderColor: 'transparent' as const },
    secondary: { borderWidth: 1.5, borderColor: C.border },
    danger: { borderWidth: 0, borderColor: 'transparent' as const },
  } as const;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const textColor = variantTextColor[variant];

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.45 : 1 }, style]}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: variantBg[variant] },
          variantBorder[variant],
          animatedStyle,
        ]}
      >
        {icon && (
          <Ionicons name={icon} size={18} color={textColor} style={styles.icon} />
        )}
        <Animated.Text style={[styles.label, { color: textColor }]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    ...Typography.bodyMd,
  },
});
