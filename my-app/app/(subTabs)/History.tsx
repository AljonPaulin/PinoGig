import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

const History = () => {
  return (
    <View>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-2xl text-white font-bold'>History</Text>
            <View className='flex flex-row flex-wrap gap-7'>
              <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
        </View>
        <View className='bg-primary h-full'>
            <View className='flex flex-row items-center rounded-lg mx-2 mt-2'>
                <View className='w-[20%]'>
                    <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
                </View>
                <View className='w-[69%]'>
                    <View className='wflex flex-row justify-between items-center'>
                        <Text className='text-white text-xl font-bold'>Alfred Paul</Text>
                        <Text className='text-tertiary font-bold'>11 min ago</Text>
                    </View>
                    <Text numberOfLines={1} className='text-gray-400 font-bold pb-2 text-ellipsis'>Alfred Paula Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus dolor unde quo pariatur blanditiis quasi est, iure facere, praesentium perspiciatis voluptates. Repellendus labore eum quis, possimus voluptas quisquam harum aspernatur.</Text>
                </View>
                <View className='w-[10%] items-center'>
                    <TouchableOpacity>
                        <MaterialIcons name="cancel" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className='flex flex-row items-center rounded-lg mx-2 mt-2'>
                <View className='w-[20%]'>
                    <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
                </View>
                <View className='w-[69%]'>
                    <View className='wflex flex-row justify-between items-center'>
                        <Text className='text-white text-xl font-bold'>Alfred Paul</Text>
                        <Text className='text-tertiary font-bold'>11 min ago</Text>
                    </View>
                    <TouchableOpacity className='py-1 mt-1 bg-primary border border-gray-400 rounded-md'>
                        <Text className='text-white text-center font-bold '>Cancelled</Text>
                    </TouchableOpacity>
                </View>
                <View className='w-[10%] items-center'>
                    <TouchableOpacity>
                        <MaterialIcons name="cancel" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
    </View>
  )
}

export default History