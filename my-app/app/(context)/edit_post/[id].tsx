import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import HostPost from '@/components/HostPost';
import { fetchGig } from '@/lib/supabase/gigs';

const EditPost = () => {
    const { id } = useLocalSearchParams();

    const [ showContent, setShowContent] = useState(false);
    const [ data, setData] = useState<any[] | null>(null);

    useEffect(() => {
        setShowContent(false)
        const loadData = async () => {
            const { data, error } = await fetchGig(id);
            if(error){
                Alert.alert(error.message)
            }else{
                setData(data?.[0]);
                console.log(data?.[0]);
                setShowContent(true)
            }
        }
        loadData()
    }, [id])

    if (!showContent) {
        return (
          <SafeAreaView style={{ flex: 1}}>
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
              <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                      <Ionicons name="arrow-back-outline" size={24} color="white"/>
              </TouchableOpacity>
              <Text className='text-2xl text-white font-bold'>Edit Your Post</Text>
              <View className='flex flex-row flex-wrap gap-7'>
                <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0"/>
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className='bg-primary'>
                <ActivityIndicator size="large" color="white" />
                <Text className='text-white'>Loading...</Text>
                </View>
          </SafeAreaView>
        );
      }
    return (
        <SafeAreaView style={{ flex: 1}}>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                  <Ionicons name="arrow-back-outline" size={24} color="white"/>
          </TouchableOpacity>
          <Text className='text-2xl text-white font-bold'>Edit Your Post</Text>
          <View className='flex flex-row flex-wrap gap-7'>
            <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0"/>
          </View>
        </View>
        <ScrollView className='bg-primary h-full'>
            <HostPost data={data} type='edit' />
        </ScrollView>
        </SafeAreaView>
    )
}

export default EditPost