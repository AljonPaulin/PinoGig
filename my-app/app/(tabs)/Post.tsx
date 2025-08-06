import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ArtistPost from '@/components/ArtistPost';
import HostPost from '@/components/HostPost';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import CustomAlert from '@/components/CustomAlert';
import { getUserType } from '@/lib/supabase/users';

const Post = () => {
  const router = useRouter();
  const [ isArtist , setIsArtist ] = useState(false);
  const [ showErrorProfile , setShowErrorProfile ] = useState(false);
  const [ showErrorHost , setShowErrorHost ] = useState(false);
  const { uid, loading } = useCurrentUser();
  const [ type , setType ] = useState("host")

  useFocusEffect(
    useCallback(() => {
        if (loading || !uid) return;

        const loadTab = async () => {
               const { data, error} = await getUserType(uid)
               if(error){
                 Alert.alert(error.message)
               }else{
                  if(data !== null ){
                    if(data.length === 0){
                      setShowErrorProfile(true)
                    }else{
                      data[0].type === 'artist' && setType('artist') 
                    }
                  }
               }
        }

        loadTab();
    }, [uid, loading])
  );


  const gigTypeChange = (filter: string, type : string) => {
    if(filter === "host") {
      setIsArtist(false)
    }else{
      if(type === 'host'){
        setShowErrorHost(true)
      }else{
        setIsArtist(true);
      }
    }
  };

  return (
    <View>
       <CustomAlert
            visible={showErrorProfile}
            type={'profile'}
            message="Create your profile first"
            onClose={() => setShowErrorProfile(false)}
        />
        <CustomAlert
            visible={showErrorHost}
            type={'host'}
            message="You need to be an Artist to use these feature"
            onClose={() => setShowErrorHost(false)}
        />
      <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
          <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-white'>Post Gig</Text>
          <Entypo name="dots-three-vertical" size={18} color="white" />
      </View>
      <View className='flex flex-row justify-evenly items-center p-4 bg-primary '>
        <TouchableOpacity style={{borderColor: isArtist ? "#374151" : "#1d7fe0", backgroundColor: isArtist ? "#374151" : "#082644" }} className='w-44 flex items-center justify-center border-2 rounded-xl h-24' onPress={() => gigTypeChange('host', type)}>
          <Feather name="calendar" size={24} color={isArtist ? "white" : "#1d7fe0"} />
          <Text style={{color: isArtist ? "white" : "#1d7fe0"}} className='font-semibold' >Looking for Gigs </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{borderColor: isArtist ? "#1d7fe0" : "#374151", backgroundColor: isArtist ? "#082644" : "#374151" }} className='w-44 flex items-center justify-center border-2 rounded-xl h-24' onPress={() => gigTypeChange('artist', type)}>
          <FontAwesome name="microphone" size={24} color={isArtist ? "#1d7fe0" : "white"} />
          <Text style={{color: isArtist ? "#1d7fe0" : "white"}} className='font-semibold' >Offering Gig</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className='bg-primary mb-[160px]' showsVerticalScrollIndicator={false}>
        {isArtist ? (
          <ArtistPost />
        ) : (
          <HostPost />
        )}
      </ScrollView>
    </View>
  )
}

export default Post;