import { View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { supabase } from '@/lib/supabase'
import { getTimeAgo } from '@/utils/timeAgo'
import Entypo from '@expo/vector-icons/Entypo'

const Notification = () => {
  const { uid } = useCurrentUser();
  const [ filter , setFilter ] = useState('All');
  const [ showContent , setShowContent ] = useState(false);
  const [ notificationData, setNotificationData] = useState<any[] | null>(null)
  useFocusEffect(
    useCallback(()=>{
        if(!uid) return
        setShowContent(false)
        
        const loadContent = async () => {
          const { data, error } = await supabase.from('notifications').select().eq('uuid', uid).order('id', { ascending: false })
          if(error) {
            Alert.alert(error.message)
          }else if(data.length !== 0){
            setNotificationData(data)
            setShowContent(true)
          }else{
            Alert.alert('No data found')
          }
        }
        loadContent()
    }, [uid])
  )

  const filteredNotifications = notificationData?.filter(item => {
    if (filter === 'All') return true;
    return item.type === filter;
  });

  const readNotification = async (id : number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if(error) Alert.alert(error.message)
  }

  const handleNotificationRoute = (type: string, id: number) => {
    readNotification(id)
    switch (type) {
      case 'Gigs':
        router.push('/(subTabs)/Chats')
        break;
      case 'Requests':
        router.push('/(subTabs)/Books')
        break;
      case 'Updates':
        router.push('/(tabs)/Setting')
        break;
    }
  }

  if (!showContent) {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                  <Ionicons name="arrow-back-outline" size={24} color="white"/>
          </TouchableOpacity>
          <Text className='text-2xl text-white font-bold'>Notifications</Text>
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
    <SafeAreaView style={{ flex: 1, paddingBottom : 50}}>
      <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                  <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className='text-2xl text-white font-bold'>Notifications</Text>
          <View className='flex flex-row flex-wrap gap-7'>
            <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
          </View>
      </View>
      <View className='h-full w-full bg-primary'>
        <View className='flex flex-row justify-between p-2'>
          <TouchableOpacity onPress={() => setFilter('All')}>
            <Text className={`font-bold text-white p-2 rounded-md w-24 text-center ${filter === 'All' ? "bg-tertiary": "bg-secondary"}`}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('Gigs')}>
            <Text className={`font-bold text-white p-2 rounded-md w-24 text-center ${filter === 'Gigs' ? "bg-tertiary": "bg-secondary"}`}>Gigs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('Requests')}>
            <Text className={`font-bold text-white p-2 rounded-md w-24 text-center ${filter === 'Requests' ? "bg-tertiary": "bg-secondary"}`}>Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('Updates')}>
            <Text className={`font-bold text-white p-2 rounded-md w-24 text-center ${filter === 'Updates' ? "bg-tertiary": "bg-secondary"}`}>Updates</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={filteredNotifications}
            className='bg-primary'
            showsVerticalScrollIndicator={false}
            renderItem={({item }) =>
              {
                let iconName;
                switch (item.type) {
                  case 'Gigs':
                    iconName = 'checkmark';
                    break;
                  case 'Requests':
                    iconName = 'book';
                    break;
                  case 'Updates':
                    iconName = 'information-circle';
                    break;
                  default:
                      iconName = 'help';
                      break;
                }
                return (
                  <TouchableOpacity className={`flex flex-row px-3 mb-3 ${item.is_read === false ? "bg-secondary" : ""}`} onPress={()=> handleNotificationRoute(item.type, item.id)}>
                    <View className='flex justify-center items-center pr-3'>
                      <View className='rounded-full p-2 bg-tertiary'>
                        <Ionicons name={iconName} size={24} color="white" />
                      </View>
                    </View>
                    <View>
                        <Text className='text-white text-xl font-bold'>{item.title}</Text>
                        <Text className='text-gray-300 font-bold w-96 pt-2'>{item.content}</Text>
                        <Text className='text-tertiary text-sm font-bold py-2'>{getTimeAgo(item.created_at)}</Text>
                    </View>
                  </TouchableOpacity>
                )
            }}
            keyExtractor={item => item.id} 
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Notification
