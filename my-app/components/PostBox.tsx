import { supabase } from '@/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const PostBox = (props : any) => {
    const router = useRouter();
    const [ gigPic, setGigPic ] = useState<string | null>(null)


    useEffect(()=>{
        const loadPic = async ( item : any) => {
            const { data, error } = await supabase
                .storage
                .from('assets')
                .createSignedUrl(`gig/${item.img}`, 60)
            
                if(error) { Alert.alert(error.message) }

                if(data){
                    setGigPic(data.signedUrl)
                    console.log("Success Bucket");
                }
        }
        loadPic(props.data)
    }, [])

    return (
      <TouchableOpacity className="w-full bg-secondary p-4 mb-3 rounded-xl" onPress={() => router.push(`/(context)/post/${props.data.id}`)}>
        {gigPic !== null && gigPic !== undefined ? (
            <Image src={gigPic} className='w-full h-60 rounded-md'/>
        ) : (
            <View className='bg-gray-600 rounded-md items-center justify-center h-60 m-2'>
                <Text className='font-semibold text-white'>Venue Photo</Text>
            </View>
        )}
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
                        <Text className='text-gray-300'> {props.data.tags[0]}</Text>
                    </View>
                    <View className='flex flex-row items-center'>
                        <Ionicons name="time" size={16} color="#1d7fe0" />
                        <Text className='text-gray-300'>{Math.round(props.data.hours)} hours</Text>
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