import { View, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

type FormProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export default function Form({ children, style }: FormProps) {
  return <View style={[styles.form, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
});
