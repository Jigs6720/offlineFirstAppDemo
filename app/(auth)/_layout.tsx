import React from "react";

import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {},
        headerTitleStyle: {
          fontSize: 22,
        },
        headerBackButtonDisplayMode: "minimal",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="signUp/index"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
