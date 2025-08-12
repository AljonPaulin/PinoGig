import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const GigBox = (props: any) => {
  const router = useRouter();
  return (
    <TouchableOpacity className="w-full bg-[#082644] p-4 mb-3 rounded-xl" onPress={() => router.push(`/(context)/post/${props.data.id}`)}>
      <View className="w-full flex flex-row justify-between items-center">
        <Text numberOfLines={1} className='w-64 text-ellipsis font-bold text-2xl text-white'>{props.data.title}</Text>
        <View className="flex flex-row items-center px-2 bg-[#1d7fe0] rounded-xl border">
            <Text className='font-semibold text-lg text-[#00172D]'>$</Text>
            <Text className='font-semibold textlg text-[#00172D]'>{props.data.rate}</Text>
        </View>
      </View>
      <View className='w-full flex flex-row flex-wrap gap-3 items-start'>
            <Text numberOfLines={1} className='w-auto max-w-40 text-ellipsis text-center text-md text-gray-300 font-bold'>{props.data.place}</Text>
            <Text className='text-md text-gray-300 font-bold'>{props.data.endTime}</Text>
      </View>
      <View className='flex flex-row flex-wrap gap-5 my-2'>
        <View className='flex flex-row items-center'>
            <Ionicons name="musical-notes" size={16} color="#1d7fe0" />
            <Text className='text-[#1d7fe0] font-bold'> {props.data.tags[0]}</Text>
        </View>
        <View className='flex flex-row items-center'>
            <Ionicons name="time" size={16} color="#1d7fe0" />
            <Text className='text-[#1d7fe0] font-bold'>{Math.round(props.data.hours)} hours</Text>
        </View>
        <View className='flex flex-row items-center'>
            <Ionicons name="people" size={16} color="#1d7fe0"/>
            <Text className='text-[#1d7fe0] font-bold'>{props.data.people} people</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default GigBox;