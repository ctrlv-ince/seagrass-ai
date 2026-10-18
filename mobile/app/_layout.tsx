import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { AuthProvider } from "@/context/AuthContext";
import { colors } from "@/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
      StatusBar.setBarStyle("dark-content");
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 220,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          {/* Main Tab Screens — NO transition animation so bottom tab switching is instant and seamless */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="survey/index"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="map"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="more"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />

          {/* Sub-screens — Smooth native slide-from-right animation */}
          <Stack.Screen
            name="capture"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="species"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="wave-calc"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="survey/[id]"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="survey/new"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* Modal Screens */}
          <Stack.Screen
            name="auth/login"
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
