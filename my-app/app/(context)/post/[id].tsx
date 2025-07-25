import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Gig } from '@/types/gig';
import { fetchGig } from '@/lib/supabase/gigs';
import { getBucket, getGigPic } from '@/lib/supabase/storage';
import { supabase } from '@/lib/supabase';
const GigDetails = () => {
    const {id} = useLocalSearchParams();
    const [gigData, setGigData] = useState<Gig |null>(null)
    const [gigPic, setGigPic] = useState("")
    

    useEffect(() => {
        const loadData = async () => {
            const { data, error } = await fetchGig(id);
            if(error){
                Alert.alert(error.message)
            }else{
                console.log("Success in Box");
                setGigData(data?.[0]);
            }
        }

        if (gigPic) return; // use cached
       
        const loadPic = async () => {
            const { data, error } = await getBucket();
            if(error){
                Alert.alert(error.message)
            }else{
                if(data){
                    const urls = (await supabase.storage.from('assets').createSignedUrl(`gig/${data[0].name}`, 60)).data?.signedUrl
                    setGigPic(urls ?? '');
                    console.log(gigPic);
                    console.log("Success Bucket");
                }
            }
        }
        loadData();
        loadPic();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1}}>
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                <Text className='text-xl text-white font-bold'>Gig Details</Text>
                <Ionicons name="bookmark-sharp" size={24} color="#1d7fe0" />
            </View>
            {gigData ? (
            <ScrollView showsVerticalScrollIndicator={false}  className='bg-primary'>
                <Image
                className='w-full size-56 bg-slate-600' src={gigPic} />
                <View className='w-full p-4'>
                    <View className='w-full flex flex-row justify-between mb-3'>
                        <View>
                            <Text className="text-2xl font-bold overflow-ellipsis text-white">{gigData.title}</Text>
                            <Text className="text-md text-gray-300 font-semibold">The Blue Note Cafe</Text>
                        </View>
                        <View className='flex items-center'>
                            <Text className="text-3xl font-bold text-tertiary">${gigData.rate}</Text>
                            <Text className="text-sm text-gray-300 font-semibold">per night</Text>
                        </View>
                    </View>
                    <View className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                        <Ionicons name="calendar-clear" size={24} color="#1d7fe0" />
                        <Text className='text-gray-300 font-semibold'>{gigData.date.toString()}</Text>
                    </View>
                    <View className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                        <Ionicons name="time" size={24} color="#1d7fe0" />
                        <Text className='text-gray-300 font-semibold'>{gigData.startTime} - {gigData.endTime}</Text>
                    </View>
                    <View className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                        <FontAwesome6 name="location-dot" size={24} color="#1d7fe0" />
                        <Text className='text-gray-300 font-semibold'>{gigData.location}</Text>
                    </View>
                    <View className='w-full flex flex-row flex-wrap gap-4'>
                        {gigData.tags.map((tag, index) => (
                             <Text key={index} className='bg-tertiary px-3 py-1 rounded-xl text-sm font-semibold'>{tag}</Text>
                        ))}
                    </View>
                    <Text className='text-lg font-medium pt-3 text-white'>Description</Text>
                    <Text className='text-sm font-medium text-gray-300 leading-6'>
                    {gigData.description}
                        </Text>
                    <Text className='text-lg font-medium py-3 text-white'>Requirements</Text>
                    {gigData.requirements.map((item, index) => (
                        <View key={index} className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                            <AntDesign name="check" size={15} color="#1d7fe0" />
                            <Text className='text-gray-300 font-semibold text-md'>{item}</Text>
                        </View>
                    ))}
                
                    
                    <View className='w-full border-y border-y-gray-300 py-3'>
                        <Text className='text-lg font-medium py-1 text-white'>Venue Host</Text>
                        <View className='w-full flex flex-row justify-between items-center'>
                            <Image
                            className='size-14 bg-slate-600 rounded-full'
                            source={require('../../../assets/images/react-logo.png')} />
                            <View>
                                <Text className='font-bold text-white'>Sarah Jonhson</Text>
                                <Text className='font-semibold text-sm text-gray-300'>Venue Manager</Text>
                                <View className='flex flex-row items-center gap-1 flex-wrap' >
                                    <View className='flex flex-row flex-wrap gap-1'>
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    </View>
                                    <Text className='font-semibold text-gray-300' >4.9 (29 reviews)</Text>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity className='border border-tertiary bg-tertiary px-3 py-1 rounded-md'>
                                    <Text className='text-center'>Message</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text className='text-lg font-medium py-3 text-white'>Similar Gigs</Text>
                    <TouchableOpacity className='w-full flex flex-row flex-wrap gap-2 mb-3'>
                        <Image
                            className='size-20 bg-slate-600 rounded-md'
                            source={require('../../../assets/images/react-logo.png')} />
                        <View>
                            <Text className='text-xl font-semibold text-white'>Acoustic Night</Text>
                            <Text className='text-md text-gray-400 font-semibold'>Coffee House Downtown</Text>
                            <Text className='text-xl text-tertiary'>$180/night</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className='w-full flex flex-row flex-wrap gap-2 mb-3'>
                        <Image
                            className='size-20 bg-slate-600 rounded-md'
                            source={require('../../../assets/images/react-logo.png')} />
                        <View>
                            <Text className='text-xl font-semibold text-white'>Acoustic Night</Text>
                            <Text className='text-md text-gray-400 font-semibold'>Coffee House Downtown</Text>
                            <Text className='text-xl text-tertiary'>$180/night</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            ):(
                <View className='w-full justify-center items-center h-full bg-primary'>
                    <ActivityIndicator size="large" color="white" />
                    <Text className='text-white'>Loading...</Text>
                </View>
              )
            }
            <View className='w-full flex flex-row items-center justify-between p-4 bg-primary'>
                <TouchableOpacity onPress={() => router.back()} className=' w-full bg-tertiary py-2 rounded-lg'>
                    <Text className='text-white text-center font-semibold text-xl '>Appy for Gig</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GigDetails;