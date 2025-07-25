import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Fontisto from '@expo/vector-icons/Fontisto'
import ArtistInputProfile from '@/components/ArtistInputProfile'
import HostInputProfile from '@/components/HostInputProfile'

const CreateArtistProfile = () => {
  const [ isArtist , setIsArtist ] = useState(false);

  const gigTypeChange = (type: string) => {
    type === "host" ? setIsArtist(false) : setIsArtist(true);
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 50, paddingTop: 50}}>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.push('/Profile')}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-xl text-white font-bold'>Create Profile</Text>
            <Entypo name="dots-three-vertical" size={18} color="white" />
        </View>
        <Text className='text-xl self-center text-white py-2 bg-primary w-full text-center'>Types of profile you can create</Text>
        <View className='flex flex-row justify-evenly items-center p-4 bg-primary'>
          <TouchableOpacity style={{borderColor: isArtist ?  "#082644" : "#1d7fe0" , backgroundColor: isArtist ? "#082644" : "#1d7fe0" }} className='w-44 flex items-center justify-center border-2 rounded-xl h-24' onPress={() => gigTypeChange('host')}>
            <Fontisto name="user-secret" size={30} color={isArtist ? "gray" : "white"} />
            <Text style={{color: isArtist ? "gray" : "white"}} >For an Artist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderColor: isArtist ? "#1d7fe0" : "#082644", backgroundColor: isArtist ? "#1d7fe0" : "#082644" }} className='w-44 flex items-center justify-center border-2 rounded-xl h-24' onPress={() => gigTypeChange('artist')}>
            <FontAwesome5 name="user-tie" size={30} color={isArtist ? "white" : "gray"} />
            <Text style={{color: isArtist ? "white" : "gray"}} className='font-semibold' >For Host</Text>
          </TouchableOpacity>
        </View>
      <ScrollView showsVerticalScrollIndicator={false} className='bg-primary'>
        {isArtist ? (
          <HostInputProfile />
        ) : (
          <ArtistInputProfile data={null} mode='create' />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateArtistProfile