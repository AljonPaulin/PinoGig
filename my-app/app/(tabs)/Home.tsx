import GigBox from '@/components/GigBox'
import PostBox from '@/components/PostBox'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { supabase } from '@/lib/supabase'
import { getNumberBaseOnCategory, getNumberOfArtist } from '@/lib/supabase/artist'
import { getNumberOfGigs, getTopRecentGigs } from '@/lib/supabase/gigs'
import { loadNewNotification } from '@/lib/supabase/notification'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, Button, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Home = () => {
  const [data, setData] = useState<any[]|null>(null);
  const [ searchData, setSearchData] = useState<any[]|null>(null);
  const [ artists, setArtists] = useState(0);
  const [ gigs, setGigs] = useState(0);
  const [ musicians, setMusicians] = useState(0);
  const [ comedians, setComedians] = useState(0);
  const [ dancers, setDancers] = useState(0);
  const [ speakers, setSpeakers] = useState(0);
  const [ notifications, setNotifications] = useState(0);
  const [ modalVisible, setModalVisible] = useState(false);
  const [ isFocused, setIsFocused] = useState<string | null>(null);
  const [ searchText, setSearchText] = useState("");
  const { uid } = useCurrentUser();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {

      if(!uid) return // return if user id  is not found

      //Display top three most recent gig post
      const loadData = async () => {
        try {
          const data = await getTopRecentGigs();
          setData(data)
        } catch (err) {
          console.error(err);
        }
      }

      //Display the number of unread notification
      const loadNotification = async () => {
        try {
            const data = await loadNewNotification(uid)
            if(data.length !== 0){
              setNotifications(data.length)}else{
                setNotifications(0)
              }
        } catch (err) {
            console.error(err);
        }
      }

      // Display the number of artist and post in the system
      const loadAll = async () => {
        const { countArtist,artistError} = await getNumberOfArtist(); // return number of artists
        const { countGig, gigError} = await getNumberOfGigs(); // return number of gigs

        if(artistError || gigError){
          artistError && Alert.alert(artistError.message);
          gigError && Alert.alert(gigError.message)
        }else{
          countArtist !== null && setArtists(countArtist)
          countGig !== null  && setGigs(countGig)
        }

      }

      // Display the number of singer, comedian and more
      const loadCategory = async () => {
        const categories = ['Singer', 'Comedian', 'Dancer', 'Speaker'];
        const results = await Promise.all(
          categories.map(category => getNumberBaseOnCategory(category))
        )

        const [singerResult, comedianResult, dancerResult, speakerResult] = results;
        const countSinger = singerResult.count;
        const countDancer = dancerResult.count;
        const countSpeaker = speakerResult.count;
        const countGigComedian = comedianResult.count;
        const gigErrorSinger = singerResult.error;
        const gigErrorComedian = comedianResult.error;
        const gigErrorDancer = dancerResult.error;
        const gigErrorSpeaker = speakerResult.error;

        if(gigErrorSinger || gigErrorComedian || gigErrorDancer || gigErrorSpeaker){
          if(gigErrorSinger) Alert.alert(gigErrorSinger.message);
          if(gigErrorComedian) Alert.alert(gigErrorComedian.message)
          if(gigErrorDancer) Alert.alert(gigErrorDancer.message)
          if(gigErrorSpeaker) Alert.alert(gigErrorSpeaker.message)
        }else{
          if(countSinger !== null) setMusicians(countSinger)
          if(countGigComedian !== null) setComedians(countGigComedian)
          if(countDancer !== null) setDancers(countDancer)
          if(countSpeaker !== null) setSpeakers(countSpeaker)
        }
    }

      loadData()
      loadAll()
      loadCategory()
      loadNotification()
    }, [uid])
  )

  const handleClose = () => {
    setSearchText('')
    setModalVisible(false)
    setIsFocused(null)
    setSearchData(null)
  }

  const handleGigSearch = async (query: string) => {
    let searchPattern = `%${query}%`;
    
    const { data, error } = await supabase
    .from('gigs')
    .select()
    .or(
      `title.ilike.${searchPattern}`
    );

    if(error){
      console.log(error);
      return;
    }else{
      setSearchData(data)
    }
    
  }
  return (
    <View className='w-full items-center p-4 bg-[#000e1a] h-full'>
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View className='m-3 bg-primary'>
            <View className='flex flex-row items-center bg-primary mb-1 '>
              <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-l-full font-bold bg-secondary w-[85%] ${isFocused === "search" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={searchText}
                onChangeText={setSearchText}
                placeholder='Type your search...'
                placeholderTextColor={'gray'}
                onFocus={() => setIsFocused('search')}
                onBlur={() => setIsFocused(null)}
              />
              <TouchableOpacity className='w-[13%] bg-secondary border-2 size-11 border-tertiary rounded-r-full flex items-center justify-center' onPress={() => handleGigSearch(searchText)}>
                <FontAwesome name="search" size={20} color="#1d7fe0" />
              </TouchableOpacity>
            </View>
            <View className='bg-secondary rounded-md h-auto mb-3'>
              {searchData !== null ? (
                <FlatList
                className='bg-primary p-4'
                data={searchData}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => <PostBox data={item} />}
                ListEmptyComponent={ <Text className='text-center my-10 text-xl font-semibold text-white'>NO DATA FOUND</Text>}
                keyExtractor={item => item.id}
                />
              ) : (
                <Text className='text-center my-10 text-xl font-semibold text-white'>...search again</Text>
              )  }
            </View>
            <Button title='close' onPress={() => handleClose()} />
          </View>
      </Modal>
      <View className='w-full flex flex-row justify-between pb-2'>
        <View className='flex flex-row flex-wrap gap-1 items-center'>
          <Image className='size-8 rounded-md'
                source={require('../../assets/images/logo3.png')} />
          <View className='flex flex-row flex-wrap gap-0 items-center'>
          <Text className='text-3xl font-semibold text-white'>Pino</Text>
          <Text className='text-3xl font-semibold text-tertiary'>Gig</Text>
          </View>
        </View>
        <View className='flex flex-row flex-wrap gap-2 items-center'>
            <TouchableOpacity onPress={() => router.push('/(context)/Notification')}>
              <Ionicons name="notifications" size={24} color="#1d7fe0" />
              {notifications !== 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-xl items-center justify-center">
                  <Text className="text-white text-xs font-bold">{notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/Profile')}>
              <FontAwesome name="user" size={20} color="#1d7fe0"  className='px-2 py-1 bg-secondary rounded-full'/>
            </TouchableOpacity>
        </View>
      </View>
      <ScrollView className='w-full bg-primary' showsVerticalScrollIndicator={false}>
        <View className='w-full items-center px-4 py-6 bg-[#082644]'>
          <Text className="text-3xl text-white font-extrabold">Find Your Next Gig</Text>
          <Text className="text-md text-gray-300 text-center p-2 font-bold">Connect with venues and get paid for your talent</Text>
          <View className="w-full flex flex-row justify-evenly my-3">
            <TouchableOpacity className="w-40 mr-1 flex flex-row justify-center items-center border-2 border-tertiary bg-tertiary rounded-lg py-3" onPress={() => setModalVisible(true)}>
              <FontAwesome name="search" size={15} color="#00172D" />
              <Text className="text-[#00172D] ml-2 font-bold">Find Gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-40 ml-1 flex flex-row justify-center items-center border-2 border-gray-500 rounded-lg py-3" onPress={() => router.push('/Post')}>
              <FontAwesome6 name="add" size={15} color="white" />
              <Text className="ml-2 text-white font-bold">Post Gig</Text>
            </TouchableOpacity>
          </View>
        </View>
       <View className="w-full flex flex-row my-3 justify-evenly">
          <View className="w-28 bg-[#082644] flex justify-center items-center rounded-xl py-3">
            <Text className="text-2xl font-semibold text-white">{gigs}</Text>
            <Text className="text-md text-gray-500 font-bold">Active Gigs</Text>
          </View>
          <View className="w-28 bg-[#082644] flex justify-center items-center rounded-xl py-3">
            <Text className="text-2xl font-semibold text-white">{artists}</Text>
            <Text className="text-md text-gray-500 font-bold">Artist</Text>
          </View>
          <View className="w-28 bg-[#082644] flex justify-center items-center rounded-xl py-3">
            <Text className="text-2xl font-semibold text-white">$ 4.2 K</Text>
            <Text className="text-md text-gray-500 font-bold" >Avg. Pay</Text>
          </View>
        </View>
        <View className="w-full">
          <View className="w-full flex flex-row justify-between items-center px-3 mb-2">
            <Text className='text-2xl font-semibold text-white'>Featured Gigs </Text>
            <TouchableOpacity onPress={() => router.push('/Gigs')}>
                <Text className="text-gray-500 font-bold">View All</Text>
            </TouchableOpacity>
          </View>
          
            {data?.[0] && (
              data.map((item) => (
                <GigBox key={item.id} data={item} />
              ))
            )}
        </View>
        <View className="w-full">
          <View className="bg-[#082644] flex-row flex-wrap gap-5 justify-between p-4 rounded-xl">
            <Text className="text-2xl font-semibold my-1 text-white">Browse by Category</Text>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'musicians'}})}>
              <FontAwesome6 name="music" size={20} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Musicians</Text>
              <Text className="text-gray-400 font-bold">{musicians} gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark first-letter:p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'comedians'}})}>
            <MaterialIcons name="theater-comedy" size={24} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Comedians</Text>
              <Text className="text-gray-400 font-bold">{comedians} gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'dancers'}})}>
              <MaterialCommunityIcons name="dance-pole" size={24} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Dancers</Text>
              <Text className="text-gray-400 font-bold">{dancers} gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'speakers'}})}>
              <FontAwesome name="microphone" size={24} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Speakers</Text>
              <Text className="text-gray-400 font-bold">{speakers} gigs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Home;