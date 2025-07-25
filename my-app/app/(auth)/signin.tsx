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
    const [ isFocused, setIsFocused ] = useState<string | null>(null);

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
    <View className="flex-1 items-center justify-center bg-primary p-10">
      <Text className="text-2xl font-bold m-4 text-white">Sign in to your account</Text>
      <Text className="w-full font-semibold m-2 text-white">Email address</Text>
      <TextInput
        className={`w-full border rounded-md px-4 mb-2 bg-secondary text-white ${isFocused === "email" ? 'border-tertiary' : 'border-secondary' }`}
        value={email}
        onChangeText={setEmail}
        placeholder="example@gmail.com" 
        onFocus={() => setIsFocused('email')}
        placeholderTextColor={'gray'}
        onBlur={() => setIsFocused(null)}
      />
      <View className="w-full flex flex-row justify-between m-2">
          <Text className="font-semibold text-white">Password</Text>
          <Text className="ml-2 font-semibold text-tertiary">Forgot password?</Text>
      </View>
      
      <TextInput
        className={`w-full border rounded-md px-4 mb-2 bg-secondary text-white ${isFocused === "password" ? 'border-tertiary' : 'border-secondary' }`}
        value={password}
        onChangeText={setPassword}
        placeholder="enter your password"
        onFocus={() => setIsFocused('password')}
        placeholderTextColor={'gray'}
        onBlur={() => setIsFocused(null)} 
      />
      <TouchableOpacity disabled={loading} className=" w-full p-2 bg-tertiary rounded-md items-center m-2" onPress={() => handleSignIn()}>
          <Text className="text-white font-bold text-lg">Sign in</Text>
      </TouchableOpacity>
      <View className="w-full flex flex-row justify-center items-center">
        <Text className='text-white'>New to our app?</Text>
        <Text className="ml-2 font-semibold text-tertiary" onPress={() => router.push("/signup")}>Sign up Here</Text>
      </View>
    
    </View>
  )
}

export default Signin