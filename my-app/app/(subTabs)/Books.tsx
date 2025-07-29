import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/lib/supabase";

const Books = () => {
    const { uid } = useCurrentUser();
    const [ type, setType ] = useState("")
    const [ bookingData, setBookingData ] = useState<any[] | null>(null)
    const [ showContent, setShowContent] = useState(false);

    useFocusEffect(
        useCallback(()=>{
          setShowContent(false);
    
          const timer = setTimeout(() => {
            setShowContent(true);
          }, 1500);
      
          return () => clearTimeout(timer);
          
      },[]))

    useFocusEffect(
        useCallback(()=> {
            setType("")
            if(!uid) return

            const loadData = async () => {
                const { data, error} = await supabase.from('users').select('type').eq('uuid', uid)
                if(error){
                    Alert.alert(error.message)
                }else{
                    if(data.length !== 0){
                        setType(data[0].type);
                    }
                }

                const {data: booking , error: errorBooking } = await supabase.from('Booking').select().eq('receiver_uid', uid)
                if(errorBooking){
                    Alert.alert(errorBooking.message)
                } else if (booking.length !== 0) {
                    setBookingData(booking);
                  } else {
                    setBookingData([]); // Reset to empty array
                  }
            }
            loadData()

    }, [uid]))

    if (!showContent) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className='bg-primary'>
            <ActivityIndicator size="large" color="white" />
            <Text className='text-white'>Loading...</Text>
          </View>
        );
      }

    return (
        <View>
        <View className="w-full flex flex-row items-center justify-between p-4 bg-secondary">
            <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            {type === 'artist' ? (
                <Text className="text-2xl text-white font-bold">Booking</Text>
            ) : (
                <Text className="text-2xl text-white font-bold">Applicants</Text>
            )}
            <View className="flex flex-row flex-wrap gap-7">
            <Ionicons name="ellipsis-vertical" size={24} color="#1d7fe0" />
            </View>
        </View>
        <View className="bg-primary h-full">
            {bookingData !== null ? (
                    <FlatList
                    className='mb-72 bg-primary'
                    showsVerticalScrollIndicator={false}
                    data={bookingData}
                    renderItem={({item}) => 
                    <View className="flex flex-row items-center bg-secondary rounded-lg m-2">
                        <Image
                            source={require("../../assets/images/react-logo.png")}
                            className="size-24 bg-gray-500 rounded-full m-3"
                        />
                        <View>
                            <Text className="text-white text-2xl font-bold">{item.stageName}</Text>
                            <Text className="text-gray-400 font-bold pb-2">{item.description}</Text>
                            <View className="flex flex-row flex-wrap gap-4">
                            <TouchableOpacity className="py-1 bg-tertiary rounded-md" onPress={() => router.push(`/(context)/profile/${item.sender_uid}`)}>
                                <Text className="text-white text-center font-bold w-28">
                                View Profile
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="py-1 bg-tertiary rounded-md">
                                <Text className="text-white text-center font-bold w-20">
                                Accept
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="py-1 bg-primary border border-gray-400 rounded-md">
                                <Text className="text-white text-center font-bold w-20">
                                Cancel
                                </Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    }
                    keyExtractor={item => item.id}
                    />
                ) : (
                    <View className='w-full flex items-center justify-center h-96 bg-primary' >
                        <Text className='text-xl text-white'>No Data</Text>
                    </View>
                )
            }
        </View>
        </View>
    );
};

export default Books;
