// mobile/src/app/(protected)/_layout.tsx
import useAuth from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!signed) {
    return <Redirect href="/signIn" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Início" }} />
      <Stack.Screen name="addChild" options={{ title: "Adicionar Filho" }} />
      <Stack.Screen name="editDependents" options={{ title: "Editar Dependentes" }} />
      <Stack.Screen name="createTask" options={{ title: "Criar Atividade" }} />
    </Stack>
  );
}
