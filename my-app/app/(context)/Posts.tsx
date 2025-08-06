import { View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import PostBox from '@/components/PostBox';
import { getAllUsersGigs } from '@/lib/supabase/gigs';

const Posts = () => {
    const { uid } = useCurrentUser();
    const [showContent , setShowContent ] = useState(false)
    const [ postsData, setPostsData] = useState<any[] | null>(null)

    useFocusEffect(
        useCallback(() => {
            if(!uid) return
            setShowContent(false)

            const loadPost = async () => {
                const { data, error } = await getAllUsersGigs(uid)
                if(error){
                    Alert.alert(error.message)
                }else{
                    setPostsData(data)
                    setShowContent(true)
                }
            }

            loadPost();
        },[uid])
    )

    if (!showContent) {
        return (
          <SafeAreaView style={{ flex: 1}}>
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
              <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                      <Ionicons name="arrow-back-outline" size={24} color="white"/>
              </TouchableOpacity>
              <Text className='text-2xl text-white font-bold'>Your Posts</Text>
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
            <Text className='text-2xl text-white font-bold'>Your Posts</Text>
            <View className='flex flex-row flex-wrap gap-7'>
                <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
        </View>
        <View className='h-full w-full bg-primary pt-3'>
        {postsData?.length !== 0 ? (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={postsData}
                renderItem={({item}) => <PostBox data={item} />}
                keyExtractor={item => item.id}
                />
            ) : (
                <View className='w-full flex items-center justify-center h-96 bg-primary' >
                    <Text className='text-xl text-white'>No Data</Text>
                </View>
            )
        }
        </View>
        </SafeAreaView>
    )
}

export default Posts