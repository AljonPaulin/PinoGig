import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getProfile } from '@/lib/supabase/profile'
import ProfileBox from '@/components/ProfileBox'

const ProfileDetails = () => {
    const { id } = useLocalSearchParams();
    const [ profileData, setProfileData] = useState<any[] | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const { data, error } = await getProfile(id);
            if(error){
                Alert.alert(error.message)
            }else{
                console.log("Success in Profile");
                setProfileData(data);
            }
        }
        loadData();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: 20}}>
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                <Text className='text-xl text-white'>Profile Details</Text>
                <Entypo name="dots-three-vertical" size={18} color="white" />
            </View>
            {profileData ? (
                <ProfileBox profile={profileData[0]} />
              ) : (
                <View className='w-full flex items-center justify-center bg-primary h-full' >
                    <Text className='text-xl text-white'>No Data</Text>
                </View>
              )
              }
        </SafeAreaView>
    )
}

export default ProfileDetails