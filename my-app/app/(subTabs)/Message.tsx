import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Books from './Books'
import Chats from './Chats'
import History from './History'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Applicants from './Applicants'
import CustomAlert from '@/components/CustomAlert'

const Message = () => {
    const [ tab, setTab ] = useState("Messages");
    const { uid, loading } = useCurrentUser();
    const [ type, setType ]   = useState("");
    const [ showAlert , setShowAlert ] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (loading || !uid) return;

            const loadTab = async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('type')
                    .eq('uuid', uid)

                if(error){
                    setShowAlert(true)
                }else{
                    if(data[0].type === 'artist'){
                        setType('artist')
                    }else{
                        setType('host')
                    } 
                }
            }
            loadTab();
        }, [])
    );
    const handleTab = () => {
        if(type === "artist"){
            setTab('Books')
        }else{
            setTab('Applicants')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1}}>
            <CustomAlert
                    visible={showAlert}
                    type={'profile'}
                    message="Create your profile first"
                    onClose={() => setShowAlert(false)}
            />
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
                tab === "Applicants" ? 
                    ( <Applicants />) : 
                tab === "Messages" ? 
                    ( <Chats />) :
                    ( <History /> )
                }
            </ScrollView>
            <View className='w-full flex flex-row items-center justify-evenly p-4 bg-secondary'>
                <TouchableOpacity onPress={() => { handleTab()}}>
                    <MaterialIcons name="library-books" size={28} color={tab === "Books" || tab === "Applicants" ? "#1d7fe0" : "white"} />
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