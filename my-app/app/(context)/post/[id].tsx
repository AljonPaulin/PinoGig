import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Gig } from '@/types/gig';
import { fetchGig } from '@/lib/supabase/gigs';
import { getBucket, getGigPic } from '@/lib/supabase/storage';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types/booking';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import DeleteAlert from '@/components/DeleteAlert';
import { getProfile } from '@/lib/supabase/profile';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const GigDetails = () => {
    const {id} = useLocalSearchParams();
    const { uid } = useCurrentUser();
    const [gigData, setGigData] = useState<Gig |null>(null)
    const [ userProfile, setUserProfile ] = useState<any | null>(null);
    const [ gigHost, setGigHost ] = useState<any | null>(null);
    const [gigPic, setGigPic] = useState("")
    const [isApplied, setIsApplied] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [gigUid, setGigUid] = useState("")
    

    useEffect(() => {
        if(!uid) return

        const loadData = async () => {
            
            const { data, error } = await fetchGig(id);
            if(error){
                Alert.alert(error.message)
            }else{
                setGigData(data?.[0]);
                setGigUid(data?.[0].uuid);
            }

            const { data : hostData, error: hostError} = await supabase.from('users').select().eq('uuid', data?.[0].uuid);
            if(hostError){
                Alert.alert(hostError.message)
            }else{
                setGigHost(hostData?.[0]);
                await loadBooking(hostData?.[0].uuid);
            }


            
            const { artistData, artistError } = await getProfile(uid);
            if( artistError === null ){
                if(artistData?.length !== 0){
                    setUserProfile(artistData?.[0])
                }
            }else{
                if(artistError) Alert.alert(artistError.message)
            }
        }
        const loadBooking = async (receiver_uid: string) => {
            const { data, error } = await supabase.from('Booking').select('id').eq('sender_uid', uid).eq('receiver_uid', receiver_uid);
            if(error){
                Alert.alert(error.message)
            }else{
                if(data.length !== 0){
                    setIsApplied(true)
                }else{
                    console.log('not applied yet')
                }
            }
        }

        if (gigPic) return; // use cached
       
        const loadPic = async () => {
            const { data, error } = await getBucket();
            if(error){
                Alert.alert(error.message)
            }else{
                if(data){
                    const urls = (await supabase.storage.from('assets').createSignedUrl(`gig/${data[0].name}`, 60)).data?.signedUrl
                    setGigPic(urls ?? '');
                    console.log("Success Bucket");
                }
            }
        }
        loadData();
        loadPic();
    }, [uid])

    const handleApply = async() => {
        if (!uid || userProfile === null ) return

        const booking: Booking = {
            sender_uid: uid,
            receiver_uid: gigUid,
            is_Accepted: null,
            stageName: userProfile.name,
            description: userProfile.description
        }
        console.log(booking);
        
        const { error } = await supabase
            .from('Booking')
            .insert(booking)
        
        if(error){
            Alert.alert(error.message)
        }else{
            router.push(`/(subTabs)/Chats`)
        }
    };
    const cancellation = async () => {
        const response = await supabase
            .from('Booking')
            .delete()
            .eq('sender_uid', uid)
        if(response.status === 204){
            console.log('Successfull cancel');
            setIsApplied(false)
        }else{
            console.log('failed');
        }
    };

    const deletePost = async () => {
        const response = await supabase
            .from('gigs')
            .delete()
            .eq('id', id)
        if(response.status === 204){
            console.log('Successful delete');
            setShowDelete(false)
            router.push('/(context)/Posts')
        }else{
            console.log('failed');
        }
    };
    const deleteDaw = () => {
        router.push('/(context)/Posts')
    };

    return (
        
        <SafeAreaView style={{ flex: 1}}>
            <DeleteAlert
                visible={showDelete}
                type={'post'}
                message="Do you want to delete your post?"
                onClose={() => setShowDelete(false)}
                onConfirm={() => deleteDaw()}
            />
            <DeleteAlert 
                visible={showCancel} 
                type={'application'} 
                message={'Do you want to cancel your Application to this gig?'}
                onClose={()=> setShowCancel(false)}
                onConfirm={()=> cancellation()}
            />
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                <Text className='text-xl text-white font-bold'>Gig Details</Text>
                <Ionicons name="bookmark-sharp" size={24} color="#1d7fe0" />
            </View>
            {gigData && gigHost ? (
            <ScrollView showsVerticalScrollIndicator={false}  className='bg-primary'>
                <Image
                className='w-full size-56 bg-slate-600' src={gigPic} />
                <View className='w-full p-4'>
                    <View className='w-full flex flex-row justify-between mb-3'>
                        <View>
                            <Text className="text-2xl font-bold overflow-ellipsis text-white">{gigData.title}</Text>
                            <Text className="text-md text-gray-300 font-semibold">The Blue Note Cafe</Text>
                        </View>
                        <View className='flex items-center'>
                            <Text className="text-3xl font-bold text-tertiary">${gigData.rate}</Text>
                            <Text className="text-sm text-gray-300 font-semibold">per night</Text>
                        </View>
                    </View>
                    <View className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                        <Ionicons name="calendar-clear" size={24} color="#1d7fe0" />
                        <Text className='text-gray-300 font-semibold'>{gigData.date.toString()}</Text>
                    </View>
                    <View className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                        <Ionicons name="time" size={24} color="#1d7fe0" />
                        <Text className='text-gray-300 font-semibold'>{gigData.startTime} - {gigData.endTime}</Text>
                    </View>
                    <View className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                        <FontAwesome6 name="location-dot" size={24} color="#1d7fe0" />
                        <Text className='text-gray-300 font-semibold'>{gigData.location}</Text>
                    </View>
                    <View className='w-full flex flex-row flex-wrap gap-4'>
                        {gigData.tags.map((tag, index) => (
                             <Text key={index} className='bg-tertiary px-3 py-1 rounded-xl text-sm font-semibold'>{tag}</Text>
                        ))}
                    </View>
                    <Text className='text-lg font-medium pt-3 text-white'>Description</Text>
                    <Text className='text-sm font-medium text-gray-300 leading-6'>
                    {gigData.description}
                        </Text>
                    <Text className='text-lg font-medium py-3 text-white'>Requirements</Text>
                    {gigData.requirements.map((item, index) => (
                        <View key={index} className='flex flex-row flex-wrap gap-2 items-center mb-3'>
                            <AntDesign name="check" size={15} color="#1d7fe0" />
                            <Text className='text-gray-300 font-semibold text-md'>{item}</Text>
                        </View>
                    ))}
                
                    
                    <View className='w-full border-y border-y-gray-300 py-3'>
                        <Text className='text-lg font-medium py-1 text-white'>Venue Host</Text>
                        <View className='w-full flex flex-row justify-between items-center'>
                            {uid !== gigUid && (
                                  <Image
                            className='size-14 bg-slate-600 rounded-full'
                            source={require('../../../assets/images/react-logo.png')} />
                            )}
                            <View>
                                <Text className='font-bold text-white'>{gigHost.name}</Text>
                                <Text className='font-semibold text-sm text-gray-300'>Venue Manager</Text>
                                <View className='flex flex-row items-center gap-1 flex-wrap' >
                                    <View className='flex flex-row flex-wrap gap-1'>
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    <FontAwesome name="star" size={15} color="#d1d5db" />
                                    </View>
                                    <Text className='font-semibold text-gray-300' >4.9 (29 reviews)</Text>
                                </View>
                            </View>
                            <View>
                                {uid !== gigUid && (
                                    <TouchableOpacity className='border border-tertiary bg-tertiary px-3 py-1 rounded-md'>
                                      <Text className='text-center'>Message</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                    <Text className='text-lg font-medium py-3 text-white'>Similar Gigs</Text>
                    <TouchableOpacity className='w-full flex flex-row flex-wrap gap-2 mb-3'>
                        <Image
                            className='size-20 bg-slate-600 rounded-md'
                            source={require('../../../assets/images/react-logo.png')} />
                        <View>
                            <Text className='text-xl font-semibold text-white'>Acoustic Night</Text>
                            <Text className='text-md text-gray-400 font-semibold'>Coffee House Downtown</Text>
                            <Text className='text-xl text-tertiary'>$180/night</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className='w-full flex flex-row flex-wrap gap-2 mb-3'>
                        <Image
                            className='size-20 bg-slate-600 rounded-md'
                            source={require('../../../assets/images/react-logo.png')} />
                        <View>
                            <Text className='text-xl font-semibold text-white'>Acoustic Night</Text>
                            <Text className='text-md text-gray-400 font-semibold'>Coffee House Downtown</Text>
                            <Text className='text-xl text-tertiary'>$180/night</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            ):(
                <View className='w-full justify-center items-center h-full bg-primary'>
                    <ActivityIndicator size="large" color="white" />
                    <Text className='text-white'>Loading...</Text>
                </View>
              )
            }
            <View className='w-full flex flex-row items-center justify-between p-4 bg-primary'>
                {isApplied ? (
                    <TouchableOpacity onPress={() => setShowCancel(true)} className='w-full bg-secondary py-2 rounded-lg'>
                        <Text className='text-tertiary text-center font-semibold text-xl '>Applied</Text>
                    </TouchableOpacity>
                ) : (
                    uid !== gigUid && (
                        <TouchableOpacity onPress={() => handleApply()} className=' w-full bg-tertiary py-2 rounded-lg'>
                            <Text className='text-white text-center font-semibold text-xl '>Appy for Gig</Text>
                        </TouchableOpacity>
                    )
                )}
                {uid === gigUid && (
                    <View className='w-full flex flex-row items-center justify-between'>
                        <TouchableOpacity className='w-[90%] bg-tertiary py-2 rounded-lg'
                             onPress={() => router.push(`/(context)/edit_post/${id}`)}>
                            <Text className='text-white text-center font-semibold text-xl '>Edit</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity className='w-[9%] items-center bg-red-500 py-2 rounded-lg' onPress={() => {setShowDelete(true)}}>
                            <MaterialIcons name="delete" size={24} color="white" />
                        </TouchableOpacity> 
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default GigDetails;