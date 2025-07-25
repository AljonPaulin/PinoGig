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
        <View className='w-full flex flex-row items-center justify-between p-4 bg-white'>
            <TouchableOpacity onPress={() => router.push('/Profile')}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text className='text-xl'>Create Profile</Text>
            <Entypo name="dots-three-vertical" size={18} color="black" />
        </View>
        <Text className='text-xl self-center'>Types of profile you can create</Text>
        <View className='flex flex-row justify-evenly items-center p-4'>
          <TouchableOpacity style={{borderColor: isArtist ? "gray" : "black", backgroundColor: isArtist ? "white" : "black" }} className='w-44 flex items-center justify-center border-2 rounded-xl h-24' onPress={() => gigTypeChange('host')}>
            <Fontisto name="user-secret" size={30} color={isArtist ? "gray" : "white"} />
            <Text style={{color: isArtist ? "gray" : "white"}} >For an Artist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderColor: isArtist ? "black" : "gray", backgroundColor: isArtist ? "black" : "white" }} className='w-44 flex items-center justify-center border-2 rounded-xl h-24' onPress={() => gigTypeChange('artist')}>
            <FontAwesome5 name="user-tie" size={30} color={isArtist ? "white" : "gray"} />
            <Text style={{color: isArtist ? "white" : "gray"}} className='font-semibold' >For Host</Text>
          </TouchableOpacity>
        </View>
      <ScrollView showsVerticalScrollIndicator={false}>
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