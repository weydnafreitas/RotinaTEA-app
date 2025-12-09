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
const signUpSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "Confirmação de senha deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);

      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        gender: "Não informado",
        birthDate: new Date().toISOString(),
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro no cadastro", error.message);
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
        <Text style={styles.title}>Crie uma nova conta</Text>
        <View style={styles.formContainer}>
          <Form>
            <FormField
              control={control}
              name="name"
              label="Digite seu Nome"
              autoCapitalize="words"
              returnKeyType="next"
              leftIcon={
                <FontAwesome5 name="user" size={24} color={Colors.light.text} />
              }
            />

            <FormField
              control={control}
              name="email"
              label="Digite seu Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              leftIcon={
                <MaterialIcons
                  name="email"
                  size={24}
                  color={Colors.light.text}
                />
              }
            />

            <FormField
              control={control}
              name="password"
              label="Sua senha"
              secureTextEntry
              returnKeyType="next"
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Colors.light.text}
                />
              }
            />

            <FormField
              control={control}
              name="confirmPassword"
              label="Confirme sua Senha"
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

            <Text style={styles.termsText}>
              Ao clicar no botão{" "}
              <Text style={styles.linkInline}>Criar conta</Text>, você concorda
              com os termos do aplicativo.
            </Text>

            <LoginButton
              title={isLoading ? "Criando..." : "Criar conta"}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              disabled={isLoading}
            />
          </Form>
        </View>
        <Text style={styles.footerText}>
          Já tenho uma conta.{" "}
          <Link href="/signIn" style={styles.linkText}>
            Entrar
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
  termsText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    textAlign: "left",
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  linkInline: {
    color: Colors.light.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  footerText: {
    fontSize: Typography.fontSize.md,
    color: Colors.light.text,
  },
  linkText: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
  },
});
