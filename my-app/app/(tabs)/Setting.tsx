import CustomAlert from '@/components/CustomAlert';
import { signOutUser } from '@/lib/supabase/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Setting = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ showDevelopment , setShowDevelopment ] = useState(false);


  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await signOutUser();
    if (error){
      Alert.alert(error.message)
    } else{
      router.push('/(auth)/signin')
    }
    setLoading(false)
  }

  return (
    <View>
        <CustomAlert
            visible={showDevelopment}
            type={'settings'}
            message="This feature is underdevelopment "
            onClose={() => setShowDevelopment(false)}
        />
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-xl text-white'>Setting</Text>
            <Text className='text-xl text-transparent'>.</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className='mb-14 bg-primary'>
          <View className='p-3'>
            <Text className='font-semibold mb-4 text-xl text-white'>PREFERENCES</Text>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <Ionicons name="notifications" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md' />
                <Text className='font-semibold text-xl text-gray-400'>Notifications</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <Ionicons name="moon" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md'/>
                <Text className='font-semibold text-xl text-gray-400'>Dark Mode</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <FontAwesome6 name="location-dot" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md' />
                <Text className='font-semibold text-xl text-gray-400'>Location Preferences</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View className='p-3'>
            <Text className='font-semibold text-white mb-4 text-xl'>SUPPORT</Text>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <AntDesign name="questioncircle" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md' />
                <Text className='font-semibold text-xl text-gray-400'>Help Center</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <FontAwesome5 name="headset" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md' />
                <Text className='font-semibold text-xl text-gray-400'>Contact Support</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <AntDesign name="star" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md'/>
                <Text className='font-semibold text-xl text-gray-400'>Rate PinoGig</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View className='p-3'>
            <Text className='font-semibold text-white mb-4 text-xl'>LEGAL</Text>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <Ionicons name="document-text" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md' />
                <Text className='font-semibold text-xl text-gray-400'>Terms of Services</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row justify-between items-center mb-4' onPress={() => setShowDevelopment(true)}>
              <View className='flex flex-row flex-wrap gap-3 items-center'>
                <FontAwesome5 name="shield-alt" size={24} color="#1d7fe0" className='bg-secondary p-2 size-11 text-center rounded-md'/>
                <Text className='font-semibold text-xl text-gray-400'>Privacy Policy</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome5 name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <TouchableOpacity disabled={loading} className='flex flex-row items-center justify-center flex-wrap gap-3 bg-tertiary p-4 rounded-md m-1 mt-4' onPress={() => handleSignOut()}>
                      <FontAwesome name="sign-out" size={24} color="white" />
                      <Text className='text-white text-center font-bold'>Sign Out</Text>
          </TouchableOpacity>
          <Text className='text-center font-bold text-sm p-4 text-gray-400'>PinoGig v1.0</Text>
        </ScrollView>
        
    </View>
  )
}

export default Setting;