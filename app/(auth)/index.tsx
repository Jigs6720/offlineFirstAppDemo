import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import React from "react";

const SignIn = () => {
  const toast = useToast();
  const [toastId, setToastId] = React.useState(0);

  const handleToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast();
    }
  };

  const showNewToast = () => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId.toString(),
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="solid">
            <ToastTitle>Hello!</ToastTitle>
            <ToastDescription>
              This is a customized toast message.
            </ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <VStack
      space="lg"
      className="p-4 mt-12 border border-outline-500 rounded-lg mx-5"
    >
      <Box>
        <Text size="xs" className="font-bold text-blue-600">
          HEALTH
        </Text>
        <Text size="sm" className="mt-1.5 text-primary">
          Oranges are a great source of vitamin C, which is essential for a
          healthy immune system.
        </Text>
        <HStack space="sm" className="mt-3 h-5">
          <Text size="xs" className="text-primary">
            Wade Warrem
          </Text>
          <Divider orientation="vertical" className="bg-gray-300" />
          <Text size="xs" className="text-primary">
            6th Oct, 2019
          </Text>
          <Divider orientation="vertical" className="bg-gray-300" />
          <Text size="xs" className="text-primary">
            5 mins read
          </Text>
        </HStack>
      </Box>
      <Divider className="bg-gray-300" />
      <Box>
        <Text size="xs" className="font-bold text-blue-600">
          TECHNOLOGY
        </Text>
        <Text size="sm" className="mt-1.5 text-primary">
          AI can automate tasks and processes, allowing for increasing
          efficiency and productivity.
        </Text>
        <HStack space="sm" className="mt-3 h-5">
          <Text size="xs" className="text-primary">
            Wade Warrem
          </Text>
          <Divider orientation="vertical" className="bg-gray-300" />
          <Text size="xs" className="text-primary">
            6th Oct, 2019
          </Text>
          <Divider orientation="vertical" className="bg-gray-300" />
          <Text size="xs" className="text-primary">
            5 mins read
          </Text>
        </HStack>
      </Box>
      <HStack space="md" reversed={false}>
        <Box className="h-5 w-5 bg-primary-100" />
        <Box className="h-5 w-5 bg-primary-200" />
        <Box className="h-5 w-5 bg-primary-300" />
      </HStack>
      <Button onPress={handleToast}>
        <ButtonText>Press Me</ButtonText>
      </Button>
    </VStack>
  );
};

export default SignIn;
