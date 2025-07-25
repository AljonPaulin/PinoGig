import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Books from './Books'
import Chats from './Chats'
import History from './History'

const Message = () => {
    const [ tab, setTab ] = useState("Books");

    return (
        <SafeAreaView style={{ flex: 1}}>
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
                <TouchableOpacity onPress={() => router.push('/(tabs)/Gigs')}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                <Text className='text-xl font-bold text-white'>{tab}</Text>
                <Entypo name="dots-three-vertical" size={18} color="white" />
            </View>
            <ScrollView className='bg-primary h-full' showsVerticalScrollIndicator={false}>
                {tab === "Books" ? 
                    ( <Books/> ) : 
                tab === "Messages" ? 
                    ( <Chats />) :
                    ( <History /> )
                }
            </ScrollView>
            <View className='w-full flex flex-row items-center justify-evenly p-4 bg-secondary'>
                <TouchableOpacity onPress={() => { setTab("Books")}}>
                    <MaterialIcons name="library-books" size={28} color={tab === "Books" ? "#1d7fe0" : "white"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setTab("Messages")}}>
                    <Ionicons name="chatbubble-ellipses" size={28} color={tab === "Messages" ? "#1d7fe0" : "white"} />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => { setTab("History")}}>
                    <FontAwesome5 name="history" size={24} color={tab === "History" ? "#1d7fe0" : "white"} />
                </TouchableOpacity>
            </View>
    </SafeAreaView>
    )
}

export default Message