import { View, Text, TextInput, TouchableOpacity, AppState, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { signInWithEmail } from '@/lib/supabase/auth';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const Signin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
      setLoading(true)
      const { error } = await signInWithEmail(email, password)
      if (error){
        Alert.alert(error.message)
      } else{
        router.push('/(tabs)/Home')
      }
      setLoading(false)
    }

  
  return (
    <View className="flex-1 items-center justify-center bg-white p-10">
      <Text className="text-2xl font-bold m-4">Sign in to your account</Text>
      <Text className="w-full font-semibold m-2">Email address</Text>
      <TextInput
        className="w-full border border-gray-500 rounded-md px-4 mb-2"
        value={email}
        onChangeText={setEmail}
        placeholder="example@gmail.com" 
      />
      <View className="w-full flex flex-row justify-between m-2">
          <Text className="font-semibold">Password</Text>
          <Text className="ml-2 font-semibold text-purple-700">Forgot password?</Text>
      </View>
      
      <TextInput
        className="w-full border border-gray-500 rounded-md px-4 mb-2"
        value={password}
        onChangeText={setPassword}
        placeholder="enter your password" 
      />
      <TouchableOpacity disabled={loading} className=" w-full p-2 bg-purple-700 rounded-md items-center m-2" onPress={() => handleSignIn()}>
          <Text className="text-white font-bold text-lg">Sign in</Text>
      </TouchableOpacity>
      <View className="w-full flex flex-row justify-center items-center">
        <Text>New to our app?</Text>
        <Text className="ml-2 font-semibold text-purple-700" onPress={() => router.push("/signup")}>Sign up Here</Text>
      </View>
    
    </View>
  )
}

export default Signin