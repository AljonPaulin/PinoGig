import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const HostProfile = (props : any) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className='mb-14 bg-primary h-full'>
    <View className='flex items-center p-3'>
    <Image source={require('../assets/images/react-logo.png')} className='size-24 bg-gray-500 rounded-full m-3'/>
    <Text className='text-2xl text-white'>{props.profile.name}</Text>
    <View className='flex flex-row flex-wrap gap-1 items-center mb-2'>
        <FontAwesome6 name="location-dot" size={17} color="#6b7280" />
        <Text className='text-md text-gray-400 font-semibold'>{props.profile.location}</Text>
    </View>
    <TouchableOpacity onPress={() => router.push({pathname : '/(context)/edit_profile/host'})}
     className='bg-tertiary py-2 px-8 rounded-lg'>
        <Text className='text-white text-sm font-bold'>Edit Profile</Text>
    </TouchableOpacity>
    </View>
    <View className='p-4'>
        <View className='w-full'>
            <Text className='font-semibold text-xl mb-2 text-white'>Contact</Text>
            <View className='flex flex-row flex-wrap gap-3 mb-2'>
            <MaterialIcons name="email" size={20} color="#4b5563" />
            <Text className='font-medium text-md text-gray-400'>{props.email}</Text>
            </View>
            <View className='flex flex-row flex-wrap gap-3'>
            <FontAwesome name="phone" size={20} color="#4b5563" />
            <Text className='font-medium text-md text-gray-400'>{props.profile.phone}</Text>
            </View>
        </View>
    </View>
</ScrollView>
  )
}

export default HostProfile