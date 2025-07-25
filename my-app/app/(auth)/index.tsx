import { useRouter } from "expo-router";
import {Text, TouchableOpacity, View } from "react-native";

export default function ndex() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white p-10">
      <TouchableOpacity className=" w-full p-2 bg-purple-700 rounded-md items-center m-2" onPress={() => router.push('/(auth)/signin')}>
          <Text className="text-white font-bold text-lg">Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity className=" w-full p-2 bg-purple-700 rounded-md items-center m-2" onPress={() => router.push('/(auth)/signup')}>
          <Text className="text-white font-bold text-lg">Sign up</Text>
      </TouchableOpacity>
  </View>
  );
}

