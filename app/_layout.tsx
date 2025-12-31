import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { syncService } from "./store/syncService";

export default function RootLayout() {
  useEffect(() => {
    // Initialize database and sync service
    // Sync pending products when app starts if online
    syncService.syncPendingProducts();
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <Stack initialRouteName="(auth)">
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
}
