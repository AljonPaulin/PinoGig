import { View, Text, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import PostBox from '@/components/PostBox';
import { fetchAllAppicationGig, fetchAllData } from '@/lib/supabase/gigs';
import ArtistBox from '@/components/ArtistBox';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Gigs = () => {
  const router = useRouter();
  const { main, filterData } = useLocalSearchParams();
  const [data, setData] = useState<any[]|null>(null);
  const [dataApplication, setDataApplication] = useState<any[]|null>(null);
  const [ orginalData, setOrginalData] = useState<any[]|null>(null);
  const [ isHost , setIsHost ] = useState(true);
  const [ filter, setFilter ] = useState('all');

  useFocusEffect(
    useCallback(() => {
        const loadData = async () => {
          const {data, error} = await fetchAllData();

          main ? setIsHost(false) : setIsHost(true)

          if(error){
            Alert.alert(error.message);
          }else{
            setData(data)
          }
        }

        const loadDataAppication = async () => {
          const {data, error} = await fetchAllAppicationGig();

          if(error){
            Alert.alert(error.message);
          }else{
            setDataApplication(data)
            setOrginalData(data)
            if (filterData) {
              const temp = filterData.toString()
              handleFilter(temp)
            }
          }
        }

        loadData()
        loadDataAppication()
    }, [filterData, main])
  );

  const handleFilterMain = (type: string) => {
    (type === 'artist') ? setIsHost(false) : setIsHost(true)
  };
  const handleFilter = (type: any) => {
      switch(type){
        case 'all':{
            setFilter('all')
            setDataApplication(orginalData)
          } 
          break;
        case 'musicians':{
            setFilter('musicians')
            const filterData = orginalData?.filter(item => item.category === 'Singer')?? [];
            setDataApplication(filterData)
          }
          break;
        case 'comedians':{
            setFilter('comedians')
            const filterData = orginalData?.filter(item => item.category === 'Comedian')?? [];
            setDataApplication(filterData)
          }
          break;
        case 'dancers':{
            setFilter('dancers')
            const filterData = orginalData?.filter(item => item.category === 'Choreographer')?? [];
            setDataApplication(filterData)
          }
          break;
        case 'speakers':{
            setFilter('speakers')
            const filterData = orginalData?.filter(item => item.category === 'Host')?? [];
            setDataApplication(filterData)
          }
          break;
      }
  };

  return (
    <View>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
            <Text className='text-2xl text-white font-bold'>Gigs</Text>
            <View className='flex flex-row flex-wrap gap-7'>
              <MaterialIcons name="post-add" size={28} color="#1d7fe0" />
              <Entypo name="message" size={28} color="#1d7fe0" onPress={() => router.push('/(subTabs)/Message')}/>
            </View>
        </View>
        <View className='w-full flex flex-row items-center justify-between p-4 bg-primary'>
          <TouchableOpacity className={`w-48 p-2 border-2 rounded-md ${isHost ?  "bg-tertiary border-tertiary" : "bg-secondary border-gray-400" }`} onPress={() => handleFilterMain('host')}>
            <Text className={`text-xl text-center ${isHost ?  "text-black" : "text-white" }`}>Offered By Host</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`w-48 p-2 border-2 rounded-md ${isHost ?  "bg-secondary border-gray-400" : "bg-tertiary border-tertiary" }`} onPress={() => handleFilterMain('artist')}>
            <Text  className={`text-xl text-center ${isHost ?  "text-white" : "text-black" }`} >Offered By Artists</Text>
          </TouchableOpacity>
        </View>
        {
          isHost ? (
            <View className='bg-primary h-full'>
               <FlatList
                className='mb-14 bg-primary p-4'
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => <PostBox data={item} />}
                keyExtractor={item => item.id}
                />
            </View>
          ) : (
            <View className='bg-primary h-full'>
              <View className='w-full flex flex-row items-center justify-between p-4 bg-primary'>
                <TouchableOpacity className={`border rounded-full ${filter === 'all' ?  "bg-tertiary border-tertiary" : "bg-secondary border-gray-400" }`} onPress={() => handleFilter('all')}>
                  <Text className={`text-sm px-2 text-center ${filter === 'all' ?   "text-black" : "text-white" }`}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`border rounded-full ${filter === 'musicians' ?  "bg-tertiary border-tertiary" : "bg-secondary border-gray-400" }`} onPress={() => handleFilter('musicians')}>
                  <Text  className={`text-sm px-2 text-center ${filter === 'musicians' ?   "text-black" : "text-white" }`} >Musicians</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`border rounded-full ${filter === 'comedians' ?  "bg-tertiary border-tertiary" : "bg-secondary border-gray-400" }`} onPress={() => handleFilter('comedians')}>
                  <Text className={`text-sm px-2 text-center ${filter === 'comedians' ?   "text-black" : "text-white" }`}>Comedians</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`border rounded-full ${filter === 'dancers' ?  "bg-tertiary border-tertiary" : "bg-secondary border-gray-400" }`} onPress={() => handleFilter('dancers')}>
                  <Text  className={`text-sm px-2 text-center ${filter === 'dancers' ?   "text-black" : "text-white" }`} >Dancers</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`border rounded-full ${filter === 'speakers' ?  "bg-tertiary border-tertiary" : "bg-secondary border-gray-400" }`} onPress={() => handleFilter('speakers')}>
                  <Text className={`text-sm px-2 text-center ${filter === 'speakers'  ?   "text-black" : "text-white" }`}>Speakers</Text>
                </TouchableOpacity>
              </View>
              {dataApplication?.length !== 0 ? (
                 <FlatList
                className='mb-72 bg-primary'
                showsVerticalScrollIndicator={false}
                data={dataApplication}
                renderItem={({item}) => <ArtistBox data={item} />}
                keyExtractor={item => item.id}
                />
              ) : (
                <View className='w-full flex items-center justify-center h-96 bg-primary' >
                    <Text className='text-xl text-white'>No Data</Text>
                </View>
              )
              }
            </View>
          )
        }
       
    </View>
  )
}

export default Gigs;