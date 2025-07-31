import { View, Text, TouchableOpacity, Image, Alert, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { supabase } from '@/lib/supabase'
import { getTimeAgo } from'@/utils/timeAgo';

const Chats = () => {
  const { uid } = useCurrentUser();
  const [ chatsData, setChatsData] = useState<any[] | null>(null);

  useFocusEffect(
    useCallback(()=> {
      const loadMessages = async () => {
        const { data, error } = await supabase
              .from('messages')
              .select(`*, users:sender_id ( name )`)
              .eq('receiver_id', uid)
              .order('created_at', { ascending: false })
              .limit(1)
        if(error){
          Alert.alert(error.message)
        }else{
          if(data.length !== 0){
            setChatsData(data)
          }
        }
      }
      loadMessages();

  }, [uid]));

  return (
    <View>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-2xl text-white font-bold'>Chats</Text>
            <View className='flex flex-row flex-wrap gap-7'>
              <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
        </View>
        <View className='bg-primary h-full'>
            {chatsData !== null && (
              <FlatList
              className='bg-primary'
              showsVerticalScrollIndicator={false}
              data={chatsData}
              renderItem={({item}) => 
                <TouchableOpacity className='flex flex-row items-center bg-secondary rounded-lg mx-2 mt-2' onPress={()=>  router.push({
                  pathname: `/(context)/message/[id]`,
                  params: { id : item.sender_id , type: 'none'},
                })}>
                <View className='w-[20%]'>
                    <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
                </View>
                <View className='w-3/4'>
                    <View className='wflex flex-row justify-between items-center'>
                        <Text className='text-white text-xl font-bold'>{item.users.name}</Text>
                        <Text className='text-tertiary font-bold'>{getTimeAgo(item.created_at)}</Text>
                    </View>
                    <Text numberOfLines={1} className='text-gray-400 font-bold pb-2 text-ellipsis'>{item.message}</Text>
                </View>
                </TouchableOpacity>
              }
              keyExtractor={item => item.id}
              />
            )}
        </View>
    </View>
  )
}

export default Chats