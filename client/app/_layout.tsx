import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useThemeStore } from "@/store/themeStore";
import { useStreakStore } from "@/store/streakStore";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  const { updateSystemTheme } = useThemeStore();
  const { checkInToday } = useStreakStore();

  useEffect(() => {
    // Update theme based on system preference
    updateSystemTheme(colorScheme === 'dark');
  }, [colorScheme]);

  useEffect(() => {
    // Check in for streak tracking when app starts
    checkInToday();
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <ErrorBoundary>
        <RootLayoutNav />
      </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { colors } = useThemeStore();

  return (
      <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen
            name="timer/[id]"
            options={{
              headerShown: true,
              title: "Таймер",
              headerBackTitle: "Назад",
            }}
        />
        <Stack.Screen
            name="task/[id]"
            options={{
              headerShown: true,
              title: "Задача",
              headerBackTitle: "Назад",
            }}
        />
      </Stack>
  );
}