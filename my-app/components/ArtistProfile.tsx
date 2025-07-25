import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const ArtistProfile = (props : any) => {
    const router = useRouter();

    return (
        <ScrollView showsVerticalScrollIndicator={false} className='mb-14 bg-primary'>
        <View className='flex items-center p-3'>
        <Image source={require('../assets/images/react-logo.png')} className='size-24 bg-gray-500 rounded-full m-3'/>
        <Text className='text-2xl text-white'>{props.profile.name}</Text>
        <Text className='text-md text-gray-400 font-semibold m-2'>{props.profile.description}</Text>
        <View className='flex flex-row flex-wrap gap-1 items-center mb-2'>
            <FontAwesome name="star" size={17} color="#6b7280" />
            <Text className='text-md text-gray-400 font-semibold'>4.8 (127 reviews) </Text>
        </View>
        <View className='flex flex-row flex-wrap gap-1 items-center mb-2'>
            <FontAwesome6 name="location-dot" size={17} color="#6b7280" />
            <Text className='text-md text-gray-400 font-semibold'>{props.profile.location}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push({pathname : '/(context)/edit_profile/artist'})}
         className='bg-tertiary py-2 px-8 rounded-lg'>
            <Text className='text-white text-sm font-bold'>Edit Profile</Text>
        </TouchableOpacity>
        </View>
        <View className='w-full flex flex-row items-center justify-between bg-secondary px-6 py-2'>
        <View className='flex items-center'>
            <Text className='text-xl font-semibold text-tertiary'>127</Text>
            <Text className='text-sm text-gray-400'>Total Gigs</Text>
        </View>
        <View className='flex items-center'>
            <Text className='text-xl font-semibold text-tertiary'>$2,840</Text>
            <Text className='text-sm text-gray-400'>Earned</Text>
        </View>
        <View className='flex items-center'>
            <Text className='text-xl font-semibold text-tertiary'>90%</Text>
            <Text className='text-sm text-gray-400'>Success Rate</Text>
        </View>
        </View>
        <View className='p-4'>
        <View className='mb-3'>
            <Text className='font-semibold text-white'>About</Text>
            <Text className='text-gray-400 text-sm font-semibold py-2'>{props.profile.about}</Text>
        </View>
        <View className='mb-3'>
            <Text className='font-semibold text-white'>Skills & Genres</Text>
            <View className='flex flex-row flex-wrap gap-4 items-center py-3'>
                    {props.profile.skills.map((skill : string, index : any) => (
                        <Text key={index} className='text-sm bg-tertiary rounded-xl text-center p-1 px-3'>{skill}</Text>
                    ))}
            </View>
        </View>
        <View className='mb-3'>
            <View className='flex flex-row justify-between'>
            <Text className='font-semibold text-xl text-white'>Portfolio</Text>
            <TouchableOpacity>
            <Text className='text-tertiary text-sm font-semibold'>View all</Text>
            </TouchableOpacity>
            </View>
            <View className='w-full flex flex-row justify-between items-center py-3'>
            <TouchableOpacity className='w-[47%] bg-gray-300 flex items-center justify-center h-36 rounded-xl'>
            <FontAwesome5 name="play" size={24} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity className='w-[47%] bg-gray-300 flex items-center justify-center h-36 rounded-xl'>
            <FontAwesome5 name="play" size={24} color="white"/>
            </TouchableOpacity>
            </View>
        </View>
        <View className='mb-3'>
            <View className='w-full flex flex-row justify-between'>
            <Text className='font-semibold text-xl text-white'>Recent Reviews</Text>
            <TouchableOpacity>
            <Text className='text-tertiary text-sm font-semibold'>View all</Text>
            </TouchableOpacity>
            </View>
            <View className='w-full flex flex-row  items-start my-2'>
            <Image source={require('../assets/images/react-logo.png')} className='size-10 bg-gray-500 rounded-full m-3'/>
            <View >
                <View className='flex flex-row items-center flex-wrap gap-2'>
                <Text className='text-white'>Sarah M.</Text>
                <View className='flex flex-row flex-wrap gap-1 items-center'>
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star-half-empty" size={15} color="yellow" />
                </View>
                </View>
                <Text className='text-sm text-gray-400 w-80'>Amazing performance at our cafe! Customers loved it That why i recommend this artist</Text>
            </View>
            </View>
            <View className='w-full flex flex-row items-start my-2'>
            <Image source={require('../assets/images/react-logo.png')} className='size-10 bg-gray-500 rounded-full m-3'/>
            <View >
                <View className='flex flex-row items-center flex-wrap gap-2'>
                <Text className='text-white'>Martin T.</Text>
                <View className='flex flex-row flex-wrap gap-1 items-center'>
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star" size={15} color="yellow" />
                    <FontAwesome name="star-half-empty" size={15} color="yellow" />
                </View>
                </View>
                <Text className='text-sm text-gray-400 w-80'>Perfecy for our wedding  reception. Highly recomended</Text>
            </View>
            </View>
        </View>
        <View className='w-full'>
            <Text className='font-semibold text-xl mb-2 text-white'>Contact</Text>
            <View className='flex flex-row flex-wrap gap-3 mb-2'>
            <MaterialIcons name="email" size={20} color="#4b5563" />
            <Text className='font-medium text-md text-gray-400'>{props.email}</Text>
            </View>
            <View className='flex flex-row flex-wrap gap-3'>
            <FontAwesome name="phone" size={20} color="#4b5563" />
            <Text className='font-medium text-md text-gray-400'>{props.profile.phone}</Text>
            </View>
        </View>
        </View>
    </ScrollView>
    )
}

export default ArtistProfile;