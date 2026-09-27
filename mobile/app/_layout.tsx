import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0d9488",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "600",
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
          name="capture"
          options={{
            title: "Capture Quadrat",
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            title: "Field Map",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
