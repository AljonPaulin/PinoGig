import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator } from 'react-native'
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
  const [ chatsName, setChatsName] = useState<any[] | null>(null);
  const [ showContent, setShowContent ] = useState(false)

  useFocusEffect(
    useCallback(()=> {
      setChatsName(null)
      setChatsData(null)

      if(!uid) return
      
      const loadNameMessages = async () => {

        const { data: msgSender, error: errSender} = await supabase
              .from('messages')
              .select(`*, users:receiver_id ( name )`)
              .eq('sender_id', uid)
              .order('created_at', { ascending: false })

        const { data: msgReceiver, error: errReceiver } = await supabase
              .from('messages')
              .select(`*, users:sender_id ( name )`)
              .eq('receiver_id', uid)
              .order('created_at', { ascending: false })

        if(errReceiver || errSender){
          if(errReceiver) Alert.alert(errReceiver.message)
          if(errSender) Alert.alert(errSender.message)
          console.log('loadNameMessages error');
          return;
        }

        if (!msgSender || msgSender.length === 0 && !msgReceiver || msgReceiver.length === 0) {
          console.log('wala');
          return
        };

        const allMessages = [...msgSender, ...msgReceiver];

        const seenNames = new Set();
        const tasks = [];
        
        for (const item of allMessages) {
          const name = item.users?.name;
          const conversationID = item.conversation_id;

          if (!name || !conversationID) continue;
      
          if (!seenNames.has(name)) {
            seenNames.add(name);
            setChatsName(prev => (prev ? [...prev, name] : [name]));
            
            // Queue loadLatestMessages in parallel
            const task = loadLatestMessages(conversationID);
            tasks.push(task);
          }
        }
        const results = await Promise.all(tasks);
        const validResults = results.filter(Boolean);
        setChatsData(validResults);
        
        setShowContent(true);
      }

      const loadLatestMessages = async (conversationID : string) => {
        const { data, error } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conversationID)
              .order('created_at', { ascending: false })
              .limit(1);
        if(error){
          console.log('loadLatestMessages error');
          Alert.alert(error.message)
        }

        return data?.[0] || null;

      }
      loadNameMessages();

  }, [uid]));

  const handleReadMsg = (sender_uid: string, receiver_uid: string) => {
    
    if(sender_uid === uid){
       router.push({
        pathname: `/(context)/message/[id]`,
        params: { id : receiver_uid , type: 'none', root : 'receiver'},
      })
    }else{
      router.push({
        pathname: `/(context)/message/[id]`,
        params: { id : sender_uid , type: 'none', root : 'sender'},
      })
    }
   
  }

  if (!showContent) {
    if (!showContent) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className='bg-primary'>
          <ActivityIndicator size="large" color="white" />
          <Text className='text-white'>Loading...</Text>
        </View>
      );
    }
  }

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
              renderItem={({item, index }) => 
                <TouchableOpacity className={`flex flex-row items-center rounded-lg mx-2 mt-2 ${item.is_read === false ? "bg-secondary" : ""}`} onPress={() => handleReadMsg(item.sender_id, item.receiver_id)}>
                <View className='w-[20%]'>
                    <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
                </View>
                <View className='w-3/4'>
                    <View className='wflex flex-row justify-between items-center'>
                        <Text className='text-white text-xl font-bold'>{chatsName ? chatsName[index] : 'Unknown'}</Text>
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