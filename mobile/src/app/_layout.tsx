import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="signIn"
          options={{ title: "Sign In", animation: "none" }}
        />
        <Stack.Screen
          name="signUp"
          options={{ title: "Sign Up", animation: "none" }}
        />

        <Stack.Screen
          name="forgotPassword"
          options={{ title: "Forgot Password", animation: "none" }}
        />
      </Stack>
    </AuthProvider>
  );
}
