import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { router } from "expo-router";
import FormField from "@/components/FormField";
import LoginButton from "@/components/LoginButton";
import { Colors, Spacing, Typography } from "@/constants/Theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import api from "@/services/api";
import { formatDateToISO, isValidDateFormat } from "@/utils/dateUtils";

// Schema de validação para cada etapa
const step1Schema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  birthDate: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine(
      (date) => isValidDateFormat(date),
      "Data deve estar no formato DD/MM/AAAA"
    ),
  supportLevel: z.string().min(1, "Nível de suporte é obrigatório"),
  communication: z.string().min(1, "Forma de comunicação é obrigatória"),
});

const step2Schema = z.object({
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  preferences: z.string().optional(),
  otherInfo: z.string().optional(),
});

type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;
type FormData = Step1FormData & Step2FormData & { avatar?: string };

const supportLevels = [
  { label: "Nível 1", value: "1" },
  { label: "Nível 2", value: "2" },
  { label: "Nível 3", value: "3" },
];

const communicationTypes = [
  { label: "Verbal", value: "verbal" },
  { label: "Não verbal", value: "nao_verbal" },
  { label: "Pictogramas", value: "pictogramas" },
  { label: "LIBRAS", value: "libras" },
];

const bloodTypes = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export default function AddChild() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [hasAvatar, setHasAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control: control1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData as Step1FormData,
  });

  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData as Step2FormData,
  });

  const onSubmitStep1 = (data: Step1FormData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const onSubmitStep2 = (data: Step2FormData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const onSubmitStep3 = () => {
    setCurrentStep(4);
  };

  const onSubmitStep4 = async () => {
    try {
      setIsLoading(true);

      // Formata os dados para enviar ao backend
      const notes = [
        formData.allergies && `Alergias: ${formData.allergies}`,
        formData.preferences && `Preferências: ${formData.preferences}`,
        formData.bloodType && `Tipo Sanguíneo: ${formData.bloodType}`,
        formData.communication && `Comunicação: ${formData.communication}`,
        formData.otherInfo && `Outras informações: ${formData.otherInfo}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const payload = {
        name: formData.name,
        birthDate: formatDateToISO(formData.birthDate!),
        supportLevel: formData.supportLevel,
        notes: notes || undefined,
        avatarUrl: formData.avatar || undefined,
      };

      await api.post("/child", payload);

      Alert.alert("Sucesso", "Dependente cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao cadastrar dependente:", error);
      const message =
        error.response?.data?.error ||
        "Não foi possível cadastrar o dependente";
      Alert.alert("Erro", message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.light.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dependentes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cadastrar novo dependente autista</Text>

        {/* Indicador de progresso */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View
              key={step}
              style={[
                styles.progressBar,
                currentStep >= step && styles.progressBarActive,
              ]}
            />
          ))}
        </View>

        {/* Etapa 1: Dados principais */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subtitle}>
              Preencha os dados principais do dependente autista.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Nome</Text>
              <FormField
                control={control1}
                name="name"
                placeholder="Nome do dependente"
              />

              <Text style={styles.label}>Data de nascimento</Text>
              <FormField
                control={control1}
                name="birthDate"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Suporte</Text>
              <FormField
                control={control1}
                name="supportLevel"
                placeholder="Selecione o nível de suporte"
              />

              <Text style={styles.label}>Comunicação</Text>
              <FormField
                control={control1}
                name="communication"
                placeholder="Como o dependente se comunica?"
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
              <LoginButton
                title="Continuar →"
                onPress={handleSubmit1(onSubmitStep1)}
                variant="primary"
              />
            </View>
          </View>
        )}

        {/* Etapa 2: Informações adicionais */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subtitle}>
              Informe características que garantem conforto, segurança e
              adaptação adequada nas atividades.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Tipo sanguíneo</Text>
              <FormField
                control={control2}
                name="bloodType"
                placeholder="Selecione o tipo sanguíneo"
              />

              <Text style={styles.label}>Alergias</Text>
              <FormField
                control={control2}
                name="allergies"
                placeholder="Ex: glúten, leite, poeira, medicamentos..."
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Preferências</Text>
              <FormField
                control={control2}
                name="preferences"
                placeholder="Ex: cores favoritas, músicas, brinquedos, alimentos que gosta..."
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Outras informações</Text>
              <FormField
                control={control2}
                name="otherInfo"
                placeholder="Use este espaço para qualquer informação relevante."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={goBack} style={styles.iconButton}>
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={Colors.light.primary}
                />
              </TouchableOpacity>
              <LoginButton
                title="Continuar →"
                onPress={handleSubmit2(onSubmitStep2)}
                variant="primary"
              />
            </View>
          </View>
        )}

        {/* Etapa 3: Foto de perfil */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subtitle}>
              Adicione uma foto do dependente autista para facilitar a
              identificação.
            </Text>

            <View style={styles.avatarContainer}>
              <Text style={styles.label}>Foto de perfil</Text>
              <View style={styles.avatarCircle}>
                <MaterialIcons
                  name="person"
                  size={80}
                  color={Colors.light.border}
                />
              </View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => {
                  // Implementar upload de foto depois
                  Alert.alert(
                    "Info",
                    "Funcionalidade de foto será implementada"
                  );
                }}
              >
                <MaterialIcons
                  name="file-upload"
                  size={20}
                  color={Colors.light.primary}
                />
                <Text style={styles.uploadButtonText}>Enviar foto</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helperText}>
              Se preferir não adicionar agora, tudo bem, isso pode ser feito
              depois.
            </Text>

            <View style={styles.footer}>
              <TouchableOpacity onPress={goBack} style={styles.iconButton}>
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={Colors.light.primary}
                />
              </TouchableOpacity>
              <LoginButton
                title="Finalizar"
                onPress={onSubmitStep3}
                variant="primary"
              />
            </View>
          </View>
        )}

        {/* Etapa 4: Confirmação */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subtitle}>
              Adicione uma foto do dependente autista para facilitar a
              identificação.
            </Text>

            <View style={styles.avatarContainer}>
              <Text style={styles.label}>Foto de perfil</Text>
              {hasAvatar ? (
                <>
                  <View style={styles.avatarCircle}>
                    {/* Aqui ficaria a imagem */}
                    <MaterialIcons
                      name="person"
                      size={80}
                      color={Colors.light.border}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => {
                      Alert.alert(
                        "Info",
                        "Funcionalidade de foto será implementada"
                      );
                    }}
                  >
                    <MaterialIcons
                      name="file-upload"
                      size={20}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.uploadButtonText}>Enviar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setHasAvatar(false)}>
                    <Text style={styles.removePhotoText}>Remover foto</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.avatarCircle}>
                    <MaterialIcons
                      name="person"
                      size={80}
                      color={Colors.light.border}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => {
                      Alert.alert(
                        "Info",
                        "Funcionalidade de foto será implementada"
                      );
                    }}
                  >
                    <MaterialIcons
                      name="file-upload"
                      size={20}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.uploadButtonText}>Enviar foto</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Text style={styles.helperText}>
              Se preferir não adicionar agora, tudo bem, isso pode ser feito
              depois.
            </Text>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={goBack}
                style={styles.iconButton}
                disabled={isLoading}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={Colors.light.primary}
                />
              </TouchableOpacity>
              <LoginButton
                title={isLoading ? "Salvando..." : "Finalizar"}
                onPress={onSubmitStep4}
                variant="primary"
                disabled={isLoading}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    paddingTop: Spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.light.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: Colors.light.primary,
  },
  stepContainer: {
    flex: 1,
  },
  form: {
    gap: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  cancelButton: {
    color: Colors.light.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  uploadButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  removePhotoText: {
    color: Colors.light.error,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.md,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
