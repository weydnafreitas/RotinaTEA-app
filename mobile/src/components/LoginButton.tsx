import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, GlobalStyles } from '@/constants/Theme';

type LoginButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
};

export default function LoginButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: LoginButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'outline' && styles.buttonOutline,
        disabled && styles.buttonDisabled,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.textOutline,
          disabled && styles.textDisabled,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    ...GlobalStyles.buttonBase,
    ...GlobalStyles.shadowMd,
    width: '100%',
    paddingVertical: Spacing.md,
  },
  buttonPrimary: {
    backgroundColor: Colors.light.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.light.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
  },
  textOutline: {
    color: Colors.light.primary,
  },
  textDisabled: {
    color: Colors.light.textSecondary,
  },
});