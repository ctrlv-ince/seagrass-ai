import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTintColor: "#0f172a",
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 17,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: "#f8fafc",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Seagrass Surveys",
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              title: "Sign In",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              title: "Create Account",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="capture"
            options={{
              title: "Scan Quadrat",
            }}
          />
          <Stack.Screen
            name="survey/[id]"
            options={{
              title: "Survey Details",
            }}
          />
          <Stack.Screen
            name="survey/new"
            options={{
              title: "New Survey",
            }}
          />
          <Stack.Screen
            name="map"
            options={{
              title: "Field Map",
            }}
          />
          <Stack.Screen
            name="wave-calc"
            options={{
              title: "Wave Calculator",
            }}
          />
          <Stack.Screen
            name="species"
            options={{
              title: "Species Guide",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
