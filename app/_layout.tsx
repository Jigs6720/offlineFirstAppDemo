import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { syncService } from "./store/syncService";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider } from "@/components/ui/ThemeProvider/ThemeProvider";
import "@/global.css";

export default function RootLayout() {
  useEffect(() => {
    // Initialize database and sync service
    // Sync pending products when app starts if online
    syncService.syncPendingProducts();
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider>
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
    </GluestackUIProvider>
  );
}
