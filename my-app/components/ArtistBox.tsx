import { supabase } from '@/lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const ArtistBox = (props: any) => {
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
                    setGigPic(data.signedUrl);
                    console.log("Success Bucket");
                }
        }
    })
    return (
        <View className="w-full px-4 mb-4">
            <View className="w-full bg-secondary p-4 mb-3 rounded-xl">
                <View className="w-full flex flex-row justify-evenly items-center">
                    <Image source={require('../assets/images/react-logo.png')} className='size-24 bg-gray-500 rounded-full m-3'/>
                    <View>
                        <Text numberOfLines={1} className='w-64 text-ellipsis font-semibold text-xl text-white'>{props.data.stageName}</Text>
                        <Text numberOfLines={1} className='font-semibold text-lg text-gray-400'>{props.data.category}</Text>
                        <View className='flex flex-row items-center gap-1 flex-wrap' >
                            <View className='flex flex-row flex-wrap gap-1'>
                                <FontAwesome name="star" size={15} color="yellow" />
                                <FontAwesome name="star" size={15} color="yellow" />
                                <FontAwesome name="star" size={15} color="yellow" />
                                <FontAwesome name="star" size={15} color="yellow" />
                                <FontAwesome name="star" size={15} color="yellow" />
                            </View>
                            <Text className='font-semibold text-gray-300' >4.9 (29 reviews)</Text>
                        </View>
                    </View>
                </View>
                <View className='flex flex-row justify-evenly my-2'>
                    <TouchableOpacity  className='w-40 bg-tertiary p-2 rounded-md'>
                        <Text className='text-white text-center'>Book Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='w-40 bg-tertiary p-2 rounded-md' onPress={() => router.push(`/(context)/profile/${props.data.uuid}`)}>
                        <Text className='text-white text-center'> See Profile</Text>
                    </TouchableOpacity>
                </View>
                <View className='flex flex-row justify-evenly gap-5 mb-3 mx-5'>
                    <View className='flex items-center'>
                        <Text className='text-gray-300 text-2xl font-bold '>${props.data.rate}</Text>
                        <Text className='text-gray-400 font-bold'>Per rate</Text>
                    </View>
                    <View className='flex items-center'>
                        <Text className='text-gray-300 text-2xl font-bold'>{props.data.travel}</Text>
                        <Text className='text-gray-400 font-bold'>Travel</Text>
                    </View>
                    <View className='flex items-center'>
                        <Text className='text-gray-300 text-2xl font-bold'>{props.data.rate}</Text>
                        <Text className='text-gray-400 font-bold'>Followers</Text>
                    </View>

                </View>
                <View className='w-full flex flex-row flex-wrap gap-4 pl-4'>
                    {props.data.available.map((tag : string, index : any) => (
                        <Text key={index} className='bg-tertiary px-3 py-1 rounded-md text-sm font-semibold'>{tag}</Text>
                    ))}
                </View>
            </View>
        </View>
        
    )
}

export default ArtistBox