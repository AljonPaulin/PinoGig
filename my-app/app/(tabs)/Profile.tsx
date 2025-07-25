import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo';
import ArtistProfile from '@/components/ArtistProfile';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getUID, getUser } from '@/lib/supabase/auth';
import { getProfile } from '@/lib/supabase/profile';


const Profile = () => {
  const router = useRouter();
  const [ dataProfile, setDataProfile ] = useState<any[] | null>(null);
  const [ email, setEmail ] = useState<string | undefined>(undefined);
  const [ showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadEmail = async () => {
        const { data: { user } } = await getUser();
        if(user !== null){
          setEmail(user.email)
        }else{
          setEmail('not found')
        }
    }
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

    loadEmail();
    loadData();

  }, []));

  if (!showContent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className='bg-primary'>
        <ActivityIndicator size="large" color="white" />
        <Text className='text-white'>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='w-full'>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-xl text-white'>Profile</Text>
            <Entypo name="dots-three-vertical" size={18} color="white" />
        </View>

        { dataProfile && dataProfile.length > 0 ? (
          <ArtistProfile profile={dataProfile[0]} email={email} />
        ) : (
          <View className='flex items-center p-3'>
            <View className='size-24 bg-gray-500 rounded-full m-3 flex justify-center items-center'>
              <FontAwesome name="user" size={60} color="black" />
            </View>
            <Text className='text-2xl'>Anonymous</Text>
            <View className='flex flex-row flex-wrap gap-1 items-center mb-2'>
              <MaterialIcons name="email" size={17} color="#6b7280" />
              <Text className='text-md text-gray-500 font-semibold'>{email}</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()} className='bg-black py-2 px-8 rounded-lg' onPressIn={() => router.push('/(context)/CreateArtistProfile')}>
                <Text className='text-white text-sm font-bold'>Create Profile</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  )
}

export default Profile