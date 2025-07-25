import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import HostInputProfile from '@/components/HostInputProfile'
import ArtistInputProfile from '@/components/ArtistInputProfile'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { getUID } from '@/lib/supabase/auth'
import { getProfile } from '@/lib/supabase/profile'

const EditProfile = () => {
    const { type } = useLocalSearchParams();
    const [ dataProfile, setDataProfile ] = useState<any[] | null>(null);
    const [ showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setShowContent(true);
        }, 2000); // 1 seconds

        return () => clearTimeout(timer); // cleanup
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const { UID } = await getUID();
        
            if(UID !== undefined){
                const { data, error } = await getProfile(UID);
                if(error === null){
                    setDataProfile(data)
                }else{
                    Alert.alert(error.message)
                }
            }
        }
        loadData();

    }, [])

    if (!showContent) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000" />
            <Text>Loading...</Text>
        </View>
        );
    }

    
    
    return (
        <SafeAreaView style={{ flex: 1}}>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-white'>
            <TouchableOpacity onPress={() => router.push('/Profile')}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text className='text-xl'>Edit Profile</Text>
            <Entypo name="dots-three-vertical" size={18} color="black" />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
        {type === 'artist' ? (
            <ArtistInputProfile data={dataProfile?.[0]} mode='edit' />
            ) : (
            <HostInputProfile />
        )}
        </ScrollView>
    </SafeAreaView>
    )
}

export default EditProfile