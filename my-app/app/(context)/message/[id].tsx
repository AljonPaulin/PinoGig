import { View, Text, Alert, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, FlatList, Image, TouchableWithoutFeedback, Keyboard, StyleSheet, Button, BackHandler, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Chats } from '@/types/chat';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getTimeAgo } from '@/utils/timeAgo';

const Chatting = () => {
    const { id, type, root} = useLocalSearchParams();
    const { uid } = useCurrentUser();
    const [ receiverUser , setReceiverUser ] = useState<string | null>(null)
    const [ conversationData , setConversationData ] = useState<any[] | null>(null)
    const [ isFocused , setIsFocused ] = useState(false)
    const [ showContent , setShowContent ] = useState(false)
    const [ msg , setMsg ] = useState("")
    const [ conversationID , setConversationID ] = useState<string | null>(null)
    const [ refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsFocused(false)
        })
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsFocused(true)
        })
    
        return () => {
          keyboardHideListener.remove()
          keyboardShowListener.remove()
        }
      }, [])

    useFocusEffect(
        useCallback(()=> {
            setConversationID(null)

            let isActive = true

            if(!uid) return

            const loadConversationID = async (root: any) => {
                let srcUID, srcID = ""

                if(root === 'sender'){
                  srcUID = 'receiver_id'
                  srcID = 'sender_id'
                }else{
                  srcID = 'receiver_id'
                  srcUID = 'sender_id'
                }
                
                const { data, error } = await supabase.from('messages').select('conversation_id').eq(srcUID, uid).eq(srcID, id)

                if (isActive) {
                    if (error) {
                        console.log('loadloadConversationID error');
                        Alert.alert(error.message);
                    } else if(data?.length > 0) {
                        const conversationId = data[0].conversation_id
                        setConversationID(conversationId)
                        await loadChats(conversationId)
                    }else{
                        console.log(data);
                        return
                    }
                }
            }

            const loadReceiver = async () => {
                const { data, error } = await supabase.from('users').select('name').eq('uuid', id)

                if (isActive) {
                    if (error) {
                        console.log('loadReceiver error');                       
                        Alert.alert(error.message);
                    } else {
                        setReceiverUser(data[0].name)
                    }
                }
            }
            const loadChats = async (conversationId : string) => {
                const { data, error } = await supabase.from('messages').select().eq('conversation_id', conversationId).order('id', { ascending: false })
                if (isActive) {
                    if (error) {
                      console.log('loadChats error');
                      Alert.alert(error.message);
                    } else {
                        if(data.length !== 0) {
                            setConversationData(data);
                            setShowContent(true)

                            const tasks = []

                            for (const item of data) {
                              if (!item.is_read && item.receiver_id === uid) {
                                const task = readChats(item.conversation_id);
                                tasks.push(task);
                              }
                            }
                            await Promise.all(tasks);
                        }
                    }
                }
            }

            const readChats = async (id: string) => {
              const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', id)

              if(error) Alert.alert(error.message)
            }
            
            if(type !== 'first') {
                loadConversationID(root) 
            }else{
                setShowContent(true)
            }
            loadReceiver()
           

            return () => {
                isActive = false;
            };
    },[uid, refreshKey]))

    const handleSend = async () => {
        if(msg === ""){
          ToastAndroid.show('Please fill a messsage first!', ToastAndroid.SHORT);
        }else{
           const chats: Chats = {
            sender_id: uid,
            receiver_id: id.toString(),
            message: msg,
            conversation_id: conversationID || undefined,
            is_read: false
          }
          const { error } = await supabase.from('messages').insert(chats)
          if(error){
              Alert.alert(error.message)
          }else{
              if(type === 'first'){
                router.push('/(subTabs)/Chats')
              }else{
                setRefreshKey(prev => prev + 1)
                setMsg('')
              }
             
          }
        }
    }

    if (!showContent) {
      return (
        <SafeAreaView style={{ flex: 1}}>
           <View className="w-full flex flex-row items-center justify-between p-4 bg-secondary">
              <TouchableOpacity onPress={() => router.push('/(subTabs)/Chats')}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-2xl text-white font-bold">{receiverUser || '...'}</Text>
              <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
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
        <KeyboardAvoidingView
            enabled={isFocused}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            <View className="w-full flex flex-row items-center justify-between p-4 bg-secondary">
              <TouchableOpacity onPress={() => router.push('/(subTabs)/Chats')}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-2xl text-white font-bold">{receiverUser}</Text>
              <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
                <FlatList
                data={conversationData}
                contentContainerStyle={{padding: 10, flexGrow: 1}}
                className="bg-primary"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                inverted={true}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                     item.sender_id === id ? (
                        <View className="flex flex-row flex-wrap gap-1">
                        <Image
                            source={require('../../../assets/images/react-logo.png')}
                            className="size-10 bg-gray-500 rounded-full my-3 mr-3"
                        />
                        <View>
                            <Text className="w-auto max-w-72 text-white text-lg p-2 bg-secondary mt-2 rounded-md">
                            {item.message}
                            </Text>
                            <Text className="text-white text-sm p-1">
                            {getTimeAgo(item.created_at)}
                            </Text>
                        </View>
                        </View>
                    ) : (
                        <View className='flex items-end'>
                            <Text className="w-auto max-w-72 text-white text-lg p-2 px-4 bg-secondary mt-2 rounded-md">
                            {item.message}
                            </Text>
                            <Text className="text-white text-sm p-1">
                            {getTimeAgo(item.created_at)}
                            </Text>
                        </View>
                    )
                )}
             />
           <View className="w-full flex flex-row items-center justify-between p-4 bg-secondary">
              <TouchableOpacity >
                  <MaterialIcons name="attach-file" size={24} color="white" />
              </TouchableOpacity>
              <TextInput
                className={`border-2 w-80 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused ? 'border-tertiary text-tertiary' : 'border-gray-400 text-gray-400'}`}
                value={msg}
                onChangeText={setMsg}
                multiline={true}
                placeholder="message....."
                placeholderTextColor={'gray'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <TouchableOpacity onPress={()=> handleSend()}>
                <FontAwesome name="send" size={24} color="#1d7fe0" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
    
}

export default Chatting 
{/*<SafeAreaView style={{ flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            <View className="w-full flex flex-row items-center justify-between px-4 py-2 bg-secondary">
              <TouchableOpacity onPress={() => router.push('/(subTabs)/Chats')}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-2xl text-white font-bold">{receiverUser}</Text>
              <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
                <KeyboardAwareFlatList
                data={othersChat}
                contentContainerStyle={{padding: 10, flexGrow: 1}}
                className="bg-primary"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.coversation_id}
                renderItem={({ item }) => (
                    <View className="flex flex-row flex-wrap gap-1">
                    <Image
                        source={require('../../../assets/images/react-logo.png')}
                        className="size-10 bg-gray-500 rounded-full my-3 mr-3"
                    />
                    <View>
                        <Text className="text-white text-lg p-2 bg-secondary mt-2 rounded-md">
                        {item.message}
                        </Text>
                        <Text className="text-white text-sm p-1">
                        {getTimeAgo(item.created_at)}
                        </Text>
                    </View>
                    </View>
                )}
             />
           <View className="w-full flex flex-row items-center justify-between p-4 bg-secondary">
              <TouchableOpacity >
                  <MaterialIcons name="attach-file" size={24} color="white" />
              </TouchableOpacity>
              <TextInput
                className={`border-2 w-80 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused ? 'border-tertiary text-tertiary' : 'border-gray-400 text-gray-400'}`}
                value={msg}
                onChangeText={setMsg}
                multiline={true}
                placeholder="message....."
                placeholderTextColor={'gray'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <TouchableOpacity onPress={()=> handleSend()}>
                <FontAwesome name="send" size={24} color="#1d7fe0" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>*/}