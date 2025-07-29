import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo';
import ArtistProfile from '@/components/ArtistProfile';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getUID, getUser } from '@/lib/supabase/auth';
import { getProfile } from '@/lib/supabase/profile';
import HostProfile from '@/components/HostProfile';
import DeleteAlert from '@/components/DeleteAlert';
import { supabase } from '@/lib/supabase';
import CustomAlert from '@/components/CustomAlert';


const Profile = () => {
  const router = useRouter();
  const [ dataProfile, setDataProfile ] = useState<any[] | null>(null);
  const [ email, setEmail ] = useState<string | undefined>(undefined);
  const [ showContent, setShowContent] = useState(false);
  const [ showDelete, setShowDelete] = useState(false);
  const [ showAlert, setShowAlert] = useState(false);
  const [ profileExist, setProfileExist] = useState(false);
  const [ type, setType] = useState("");

  useFocusEffect(
    useCallback(()=>{
      setShowContent(false);

      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1500); // 1.5 seconds
  
      return () => clearTimeout(timer); // cleanup
      
  },[]))

  useEffect(() => {
      const loadEmail = async () => {
        const { data: { user } } = await getUser();
        if(user !== null){
          setEmail(user.email)
        }else{
          setEmail('not found')
        }
      }
      const loadData = async () => {
        const { UID } = await getUID();
        
          if(UID !== undefined){
            const { artistData, artistError, hostData, hostError } = await getProfile(UID);
            if(artistError === null && hostError === null){
              if(artistData?.length !== 0){
                setDataProfile(artistData);
                setType("artist");
                setProfileExist(true)
              }
              if(hostData?.length !== 0){
                setDataProfile(hostData);
                setType("host");
                setProfileExist(true)
              }
            }else{
              if(artistError) Alert.alert(artistError.message)
              if(artistError) Alert.alert(artistError.message)
            }
          }
      }

      loadEmail();
      loadData();

  }, [profileExist]);

  const deleteProfile = async ( typeProfile: string) => {
    if(dataProfile === null) return

    const response = await supabase
        .from('users')
        .delete()
        .eq('uuid', dataProfile[0].uuid)
    
    if(typeProfile === 'host'){
      const response = await supabase
        .from('profileHost')
        .delete()
        .eq('uuid', dataProfile[0].uuid)

      if(response.status === 204){
          console.log('Successful delete');
          setProfileExist(false)
          setDataProfile(null)
          setType("");
          router.push('/(tabs)/Home')
      }else{
          console.log('failed');
      }
    }else{
      const response = await supabase
        .from('profileArtist')
        .delete()
        .eq('uuid', dataProfile[0].uuid)

      if(response.status === 204){
          console.log('Successful delete');
          setProfileExist(false)
          setDataProfile(null)
          setType("");
          router.push('/(tabs)/Home')
      }else{
          console.log('failed');
      }
    }
  };
  
  const handleDelete = () =>{
      profileExist ? setShowDelete(true) : setShowAlert(true)
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
    <View className='w-full'>
       <DeleteAlert
            visible={showDelete}
            type={'profile'}
            message="Do you want to delete your profile?"
            onClose={() => setShowDelete(false)}
            onConfirm={() => deleteProfile(type)}
        />
        <CustomAlert
            visible={showAlert}
            type={'notice'}
            message="Create Your Profile First"
            onClose={() => setShowAlert(false)}
        />
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className='text-xl text-white'>Profile</Text>
            <TouchableOpacity onPress={() => handleDelete()}>
                <MaterialIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
        </View>

        { dataProfile && dataProfile.length > 0 ? (
          type === "artist" ? (
            <ArtistProfile profile={dataProfile[0]} email={email} />
          ) : (
            <HostProfile profile={dataProfile[0]} email={email} />
          )
        ) : (
          <View className='flex items-center p-3 bg-primary h-full'>
            <View className='size-24 bg-secondary rounded-full m-3 flex justify-center items-center'>
              <FontAwesome name="user" size={60} color="#1d7fe0" />
            </View>
            <Text className='text-2xl font-bold text-white'>Anonymous</Text>
            <View className='flex flex-row flex-wrap gap-1 items-center mb-2'>
              <MaterialIcons name="email" size={17} color="#6b7280" />
              <Text className='text-md text-gray-400 font-semibold'>{email}</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()} className='bg-tertiary py-2 px-8 rounded-lg' onPressIn={() => router.push('/(context)/CreateArtistProfile')}>
                <Text className='text-white text-sm font-bold'>Create Profile</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  )
}

export default Profile