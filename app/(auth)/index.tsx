import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        SignIn
      </Text>
    </View>
  );
};

export default SignIn;
