import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

const Chats = () => {
  return (
    <View>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-2xl text-white font-bold'>Chats</Text>
            <View className='flex flex-row flex-wrap gap-7'>
              <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
        </View>
        <View className='bg-primary h-full'>
            <TouchableOpacity className='flex flex-row items-center bg-secondary rounded-lg mx-2 mt-2'>
            <View className='w-[20%]'>
                <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
            </View>
            <View className='w-3/4'>
                <View className='wflex flex-row justify-between items-center'>
                    <Text className='text-white text-xl font-bold'>Alfred Paul</Text>
                    <Text className='text-tertiary font-bold'>11 min ago</Text>
                </View>
                <Text numberOfLines={1} className='text-gray-400 font-bold pb-2 text-ellipsis'>Alfred Paula Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus dolor unde quo pariatur blanditiis quasi est, iure facere, praesentium perspiciatis voluptates. Repellendus labore eum quis, possimus voluptas quisquam harum aspernatur.</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row items-center bg-secondary rounded-lg mx-2 mt-2'>
                <View className='w-[20%]'>
                    <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
                </View>
                <View className='w-3/4'>
                    <View className='wflex flex-row justify-between items-center'>
                        <Text className='text-white text-xl font-bold'>Alfred Paul</Text>
                        <Text className='text-tertiary font-bold'>11 min ago</Text>
                    </View>
                    <Text numberOfLines={1} className='text-gray-400 font-bold pb-2 text-ellipsis'>Alfred Paula Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus dolor unde quo pariatur blanditiis quasi est, iure facere, praesentium perspiciatis voluptates. Repellendus labore eum quis, possimus voluptas quisquam harum aspernatur.</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Chats