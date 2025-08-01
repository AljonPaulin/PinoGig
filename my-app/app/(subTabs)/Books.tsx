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
    const [ bookingDataAccepted, setBookingDataAccepted ] = useState<any[] | null>(null)
    const [ bookingDataCancelled, setBookingDataCancelled ] = useState<any[] | null>(null)
    const [ showContent, setShowContent] = useState(false);
    const [ tab, setTab] = useState('request');

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

                const {data: bookingAccepted , error: errorBookingAccepted } = await supabase.from('Booking').select().eq('receiver_uid', uid).eq('is_Accepted', true)
                const {data: bookingCancelled , error: errorBookingCancelled } = await supabase.from('Booking').select().eq('receiver_uid', uid).eq('is_Accepted', false)
                const {data: booking , error: errorBooking } = await supabase.from('Booking').select().eq('receiver_uid', uid).is('is_Accepted', null)
                if(errorBookingAccepted || errorBookingCancelled || errorBooking){
                    if(errorBooking) Alert.alert(errorBooking.message)
                    if(errorBookingAccepted) Alert.alert(errorBookingAccepted.message)
                    if(errorBookingCancelled) Alert.alert(errorBookingCancelled.message)
                } else if (bookingAccepted.length !== 0 || bookingCancelled.length !== 0 || booking.length !== 0) {
                    setBookingData(booking)
                    setBookingDataAccepted(bookingAccepted)
                    setBookingDataCancelled(bookingCancelled);
                } else {
                    setBookingData([])
                    setBookingDataAccepted([])
                    setBookingDataCancelled([])
                }
            }
            loadData()

    }, [uid]))

    const handleRequest = async (sender_uid: string, accept: boolean) => {
        const { error } = await supabase.from('Booking').update({ is_Accepted : accept}).eq('sender_uid', sender_uid).eq('receiver_uid', uid)
        if(error){
            Alert.alert(error.message)
        }else{
            if(accept){
                router.push({
                    pathname: `/(context)/message/[id]`,
                    params: { id: sender_uid, type: 'first'},
                  })
            }else{
                router.push('/(subTabs)/History')
            }
           
        }
    }
    

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
        <View className="flex flex-row items-end justify-evenly bg-primary pt-2">
            <TouchableOpacity className={`py-1 border-2 rounded-full ${tab === 'request' ? "bg-tertiary border-tertiary" : "bg-primary border-gray-400" }`} onPress={()=> setTab('request')}>
                <Text className="text-white text-center font-bold px-3">Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity className={`py-1 border-2 rounded-full ${tab === 'accepted' ? "bg-tertiary border-tertiary" : "bg-primary border-gray-400" }`} onPress={()=> setTab('accepted')}>
                <Text className="text-white text-center font-bold px-3">Accepted</Text>
            </TouchableOpacity>
            <TouchableOpacity className={`py-1 border-2 rounded-full ${tab === 'cancelled' ? "bg-tertiary border-tertiary" : "bg-primary border-gray-400" }`} onPress={()=> setTab('cancelled')}>
                <Text className="text-white text-center font-bold px-3">Cancelled</Text>
            </TouchableOpacity>
        </View>
        <View className="bg-primary h-full">
            {tab === 'request' ? (
                    <FlatList
                    className='bg-primary'
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
                            <TouchableOpacity className="py-1 bg-tertiary rounded-md" onPress={()=> handleRequest(item.sender_uid, true)}>
                                <Text className="text-white text-center font-bold w-20">
                                Accept
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="py-1 bg-primary border border-gray-400 rounded-md" onPress={()=> handleRequest(item.sender_uid, false)}>
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
                ) : tab === 'accepted' ? (
                    <FlatList
                    className=' bg-primary'
                    showsVerticalScrollIndicator={false}
                    data={bookingDataAccepted}
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
                            
                            <View className="py-1 bg-primary border border-gray-300 rounded-md px-4">
                                <Text className="text-gray-300 text-center font-bold w-20">
                                Accepted
                                </Text>
                            </View>
                            <TouchableOpacity className="py-1 bg-tertiary rounded-md" onPress={() => router.push(`/(context)/profile/${item.sender_uid}`)}>
                                <Text className="text-white text-center font-bold w-28">
                                View Profile
                                </Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    }
                    keyExtractor={item => item.id}
                    />
                ) : (
                    <FlatList
                    className='bg-primary'
                    showsVerticalScrollIndicator={false}
                    data={bookingDataCancelled}
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
                            
                            <View className="py-1 bg-primary border border-gray-300 rounded-md px-8">
                                <Text className="text-gray-300 text-center font-bold w-20">
                                Cancelled
                                </Text>
                            </View>
                            </View>
                        </View>
                    </View>
                    }
                    keyExtractor={item => item.id}
                   
                    />
                )
            }
        </View>
        </View>
    );
};

export default Books;
