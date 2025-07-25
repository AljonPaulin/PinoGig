import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const Books = () => {
  return (
    <View>
      <View className='flex flex-row items-center bg-secondary rounded-lg m-2'>
            <Image source={require('../../assets/images/react-logo.png')} className='size-24 bg-gray-500 rounded-full m-3'/>
            <View>
                <Text className='text-white text-2xl font-bold'>Alfred Paul</Text>
                <Text className='text-gray-400 font-bold pb-2'>Alfred Paul</Text>
            <View className='flex flex-row flex-wrap gap-4'>
                <TouchableOpacity className='py-1 bg-tertiary rounded-md'>
                    <Text className='text-white text-center font-bold w-28'>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity className='py-1 bg-tertiary rounded-md'>
                    <Text className='text-white text-center font-bold w-20'>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity className='py-1 bg-primary border border-gray-400 rounded-md'>
                    <Text className='text-white text-center font-bold w-20'>Cancel</Text>
                </TouchableOpacity>
            </View>
            </View>
            <View></View>
        </View>
    </View>
  )
}

export default Books