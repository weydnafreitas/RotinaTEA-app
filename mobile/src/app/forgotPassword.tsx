import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Form from "@/components/Form";
import FormField from "@/components/FormField";
import LoginButton from "@/components/LoginButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/constants/Colors";
import { Spacing, Typography } from "@/constants/Theme";
import { router } from "expo-router";

// Schema de validação com Zod
const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log("Forgot password data:", data);
      // Aqui você faria a chamada para enviar o email
      // await sendPasswordResetEmail(data.email);
      alert("Email enviado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.light.text}
          />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Esqueceu sua senha?</Text>

          <View style={styles.formContainer}>
            <Form>
              <FormField
                control={control}
                name="email"
                label="Digite seu Email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                leftIcon={
                  <MaterialIcons
                    name="email"
                    size={24}
                    color={Colors.light.text}
                  />
                }
              />

              <Text style={styles.helperText}>
                * Vamos te enviar uma mensagem para ajudar você a criar ou
                redefinir sua senha com segurança.
              </Text>

              <LoginButton
                title={isSubmitting ? "Enviando..." : "Enviar"}
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                disabled={isSubmitting}
              />
            </Form>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: Spacing.lg,
    padding: Spacing.sm,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: Spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
});
