import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const PostBox = (props : any) => {
    const router = useRouter();

    return (
      <TouchableOpacity className="w-full bg-secondary p-4 mb-3 rounded-xl" onPress={() => router.push(`/(context)/post/${props.data.id}`)}>
       
        <View className='bg-gray-600 rounded-md items-center justify-center h-60 m-2'>
                <Text className='font-semibold text-white'>Venue Photo</Text>
        </View>
        <View className="flex flex-row justify-between items-center p-2 ml-2">
            <View>
                <View className='w-full flex flex-row items-center justify-between'>
                    <View>
                        <Text numberOfLines={1} className='w-60 font-bold text-xl text-white'>{props.data.title}</Text>
                        <View className='w-full flex flex-row flex-wrap gap-3 items-start'>
                            <Text numberOfLines={1} className='w-auto max-w-36 text-ellipsis font-semibold text-md text-gray-400'>{props.data.place}</Text>
                            <Text className='font-semibold text-md text-gray-400'>{props.data.endTime}</Text>
                        </View>
                    </View>
                    <View className="flex flex-row items-center px-2 bg-tertiary rounded-xl">
                        <Text className='font-semibold text-lg text-white'>$</Text>
                        <Text className='font-semibold text-lg text-white'>{props.data.rate}</Text>
                    </View>
                </View>
                <View className='flex flex-row flex-wrap gap-5 my-2'>
                    <View className='flex flex-row items-center'>
                        <Ionicons name="musical-notes" size={16} color="#1d7fe0" />
                        <Text className='text-gray-300'> {props.data.tags}</Text>
                    </View>
                    <View className='flex flex-row items-center'>
                        <Ionicons name="time" size={16} color="#1d7fe0" />
                        <Text className='text-gray-300'> {props.data.hours} hours</Text>
                    </View>
                    <View  className='flex flex-row items-center'>
                        <Ionicons name="people" size={16} color="#1d7fe0" />
                        <Text className='text-gray-300'> {props.data.people} people</Text>
                    </View>
                </View>
            </View>
        </View>
      </TouchableOpacity>
    )
}

export default PostBox