import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Form from "@/components/Form";
import FormField from "@/components/FormField";
import LoginButton from "@/components/LoginButton";
import useAuth from "@/hooks/useAuth";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/constants/Colors";
import { Spacing, Typography } from "@/constants/Theme";
import Logo from "../../assets/images/lg-abraco-azul.svg";
import { Link } from "expo-router";

// Schema de validação com Zod
const signInSchema = z.object({
  email: z
    .string("Email é obrigatório")
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  password: z
    .string("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      await signIn(data);
    } catch (error: any) {
      Alert.alert("Erro no login", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Logo width={150} height={100} />
        <Text style={styles.title}>Boas-vindas novamente!</Text>
        <View style={styles.formContainer}>
          <Form>
            <FormField
              control={control}
              name="email"
              label="Seu Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              leftIcon={
                <FontAwesome5
                  name="envelope"
                  size={24}
                  color={Colors.light.text}
                />
              }
            />

            <FormField
              control={control}
              name="password"
              label="Sua Senha"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Colors.light.text}
                />
              }
            />

            <Link
              style={[
                styles.linkText,
                { textAlign: "right", marginBottom: Spacing.md },
              ]}
              href="/forgotPassword"
            >
              Esqueci minha senha
            </Link>

            <LoginButton
              title={isLoading ? "Entrando..." : "Entrar"}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              disabled={isLoading}
            />
          </Form>
        </View>
        <Text style={{ fontSize: 16 }}>
          Ainda não tenho uma conta.{" "}
          <Link style={styles.linkText} href="/signUp">
            Criar
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: Typography.fontWeight.bold,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  linkText: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
  },
});
