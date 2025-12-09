import { forwardRef, useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants/Theme";
import Entypo from "@expo/vector-icons/Entypo";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
};

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      style,
      secureTextEntry,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholder={placeholder || label}
            placeholderTextColor={Colors.light.textSecondary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            {...props}
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.passwordButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isPasswordVisible ? (
                <Entypo
                  name="eye-with-line"
                  size={24}
                  color={Colors.light.textSecondary}
                />
              ) : (
                <Entypo
                  name="eye"
                  size={24}
                  color={Colors.light.textSecondary}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {helperText && !error && (
          <Text style={styles.helperText}>{helperText}</Text>
        )}
      </View>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    minHeight: 56,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: "transparent",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputFocused: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  leftIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  passwordButton: {
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.error,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
});
