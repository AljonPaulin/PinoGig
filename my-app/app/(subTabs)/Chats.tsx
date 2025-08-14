import { useCurrentUser } from '@/hooks/useCurrentUser'
import { supabase } from '@/lib/supabase'
import { getLatestChat, getMessageFromCurrentUser, getMessageToCurrentUser } from '@/lib/supabase/chats'
import { getProfileArtist, getProfileHost } from '@/lib/supabase/profile'
import { getTimeAgo } from '@/utils/timeAgo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

const Chats = () => {
  const { uid } = useCurrentUser();
  const [ chatsData, setChatsData] = useState<any[] | null>(null);
  const [ chatsName, setChatsName] = useState<any[] | null>(null);
  const [ chatsImg, setChatsImg] = useState<any[] | null>(null);
  const [ showContent, setShowContent ] = useState(false)

  useFocusEffect(
    useCallback(()=> {
      setChatsName(null)
      setChatsData(null)

      if(!uid) return
      
      const loadNameMessages = async () => {

        const { msgSender, errSender} = await getMessageFromCurrentUser(uid)
        const { msgReceiver, errReceiver } = await getMessageToCurrentUser(uid)

        if(errReceiver || errSender){
          errReceiver && Alert.alert(errReceiver.message)
          errSender && Alert.alert(errSender.message)
          console.log('loadNameMessages error');
          return;
        }

        if (!msgSender || msgSender.length === 0 || !msgReceiver || msgReceiver.length === 0) {
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
            loadProfile(name)
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
        const { data, error } = await getLatestChat(conversationID)
        if(error){
          console.log('loadLatestMessages error');
          Alert.alert(error.message)
        }
        return data?.[0] || null;
      }

      const loadProfile = async ( name : any) => {

        const { data: userData , error: errUser } = await supabase
            .from('users')
            .select()
            .eq('name', name)

        if(errUser){ Alert.alert(errUser.message) }

        if(userData){
          if(userData[0].type === 'artist'){
            const { artistData, artistError } = await getProfileArtist(userData[0].uuid)
            if(artistError){
              Alert.alert(artistError.message)
            }
            if(artistData){
              if(artistData[0].img !== null){
                loadPic(artistData[0].img)
              }
            }
          }else{
            const { hostData, hostError } = await getProfileHost(userData[0].uuid)
            if(hostError){
              Alert.alert(hostError.message)
            }
            if(hostData){
              if(hostData[0].img !== null){
                loadPic(hostData[0].img)
              }
            }
          }
        }
      }

      const loadPic = async (img: any) => {
          const { data, error } = await supabase
            .storage
            .from('assets')
            .createSignedUrl(`profile/artist/${img}`, 60)
        
            if(error) { Alert.alert(error.message) }

            if(data){
                setChatsImg(prev => (prev ? [...prev, data.signedUrl] : [data.signedUrl]));
          }
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
                    {chatsImg && chatsImg[index] !== undefined ?  (
                            <Image src={chatsImg[index]} className='size-16 rounded-full m-3'/>
                        ) : (
                            <Image source={require('../../assets/images/react-logo.png')} className='size-16 bg-gray-500 rounded-full m-3'/>
                        )
                    }
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