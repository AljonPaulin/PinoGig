import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import GigBox from '@/components/GigBox'
import Ionicons from '@expo/vector-icons/Ionicons'
import { fetchData } from '@/lib/supabase/gigs'
import { Gig } from '@/types/gig'
import { FlatList } from 'react-native'
import { useRouter } from 'expo-router'

const Home = () => {
  const [data, setData] = useState<any[]|null>(null);
  const router = useRouter();

  useEffect(() => {
      const loadData = async () => {
        const {data, error} = await fetchData();

        if(error){
          Alert.alert(error.message);
        }else{
          setData(data)
        }
      }

      loadData()
  }, [])
  return (
    <View className='w-full items-center p-4 pb-16 bg-[#000e1a]'>
      <View className='w-full flex flex-row justify-between pb-2'>
        <View className='flex flex-row flex-wrap gap-3 items-center'>
          <FontAwesome6 name="music" size={20} color="#1d7fe0" />
          <View className='flex flex-row flex-wrap gap-0 items-center'>
          <Text className='text-3xl font-semibold text-white'>Pino</Text>
          <Text className='text-3xl font-semibold text-tertiary'>Gig</Text>
          </View>
        </View>
        <View className='flex flex-row flex-wrap gap-2 items-center'>
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color="#1d7fe0" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                className='size-8 bg-[#082644] rounded-full'
                source={require('../../assets/images/react-logo.png')} />
            </TouchableOpacity>
        </View>
      </View>
      <ScrollView className='w-full bg-primary' showsVerticalScrollIndicator={false}>
        <View className='w-full items-center px-4 py-6 bg-[#082644]'>
          <Text className="text-3xl text-white font-extrabold">Find Your Next Gig</Text>
          <Text className="text-md text-gray-300 text-center p-2 font-bold">Connect with venues and get paid for your talent</Text>
          <View className="w-full flex flex-row justify-evenly my-3">
            <TouchableOpacity className="w-40 mr-1 flex flex-row justify-center items-center border-2 border-tertiary bg-tertiary rounded-lg py-3">
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
            <Text className="text-2xl font-semibold text-white">1.2K</Text>
            <Text className="text-md text-gray-500 font-bold">Active Gigs</Text>
          </View>
          <View className="w-28 bg-[#082644] flex justify-center items-center rounded-xl py-3">
            <Text className="text-2xl font-semibold text-white">850</Text>
            <Text className="text-md text-gray-500 font-bold">Artist</Text>
          </View>
          <View className="w-28 bg-[#082644] flex justify-center items-center rounded-xl py-3">
            <Text className="text-2xl font-semibold text-white">$4.2K</Text>
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
              <Text className="text-gray-400 font-bold">300 gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark first-letter:p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'comedians'}})}>
            <MaterialIcons name="theater-comedy" size={24} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Comedians</Text>
              <Text className="text-gray-400 font-bold">128 gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'dancers'}})}>
              <MaterialCommunityIcons name="dance-pole" size={24} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Dancers</Text>
              <Text className="text-gray-400 font-bold">50 gigs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[45%] flex justify-center items-center bg-dark p-2 rounded-xl" onPress={() => router.push({pathname: '/Gigs', params : { main : 'artist' , filterData: 'speakers'}})}>
              <FontAwesome name="microphone" size={24} color="#1d7fe0" />
              <Text className="text-xl font-semibold text-white">Speakers</Text>
              <Text className="text-gray-400 font-bold">60 gigs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Home;