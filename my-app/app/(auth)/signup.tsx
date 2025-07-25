import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { signUpUser } from '@/lib/supabase/auth';

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [ isFocused, setIsFocused ] = useState<string | null>(null);

    const handleSignUp = async () => {
      setLoading(true)
      const { error } = await signUpUser(email, password);

      if(error){
        Alert.alert(error.message);
      } else {
        router.push('/(auth)/signin');
      }
      setLoading(false);
    }
  
  return (
    <View className="flex-1 items-center justify-center bg-primary p-10">
      <Text className="text-2xl font-bold m-4 text-white">Create your account</Text>
      <Text className="w-full font-semibold m-2 text-white">Email address</Text>
      <TextInput
        className={`w-full border rounded-md px-4 mb-2 bg-secondary text-white ${ isFocused === 'email' ? "border-tertiary" :  "border-secondary"}`}
        value={email}
        onChangeText={setEmail}
        onFocus={() => setIsFocused('email')}
        onBlur={() => setIsFocused(null)}
        placeholderTextColor={'gray'}
        placeholder="example@gmail.com" 
      />
      <View className="w-full flex flex-row justify-between m-2">
          <Text className="font-semibold text-white">Password</Text>
      </View>
      
      <TextInput
        className={`w-full border rounded-md px-4 mb-2 bg-secondary text-white ${ isFocused === 'password' ? "border-tertiary" :  "border-secondary"}`}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={'gray'}
        onFocus={() => setIsFocused('password')}
        onBlur={() => setIsFocused(null)}
        placeholder="enter your password" 
      />
      <TouchableOpacity disabled={loading} className=" w-full p-2 bg-tertiary rounded-md items-center m-2" onPress={()=> handleSignUp()}>
          <Text className="text-white font-bold text-lg">Sign up</Text>
      </TouchableOpacity>
      <View className="w-full flex flex-row justify-center items-center">
        <Text className='text-white'>Already had an account?</Text>
        <Text className="ml-2 font-semibold text-tertiary" onPress={() => router.push("/signin")}>Sign up Here</Text>
      </View>
    </View>
  )
}

export default Signup