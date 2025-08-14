import CustomAlert from '@/components/CustomAlert'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const History = () => {
    const [ showDevelopment , setShowDevelopment ] = useState(false);
    const { uid } = useCurrentUser();

    useFocusEffect(
        useCallback(()=> {
            if(!uid) return
            setShowDevelopment(true)
    }, [uid]))

    

    return (
        <View>
            <CustomAlert
            visible={showDevelopment}
            type={'development'}
            message="This feature is underdevelopment "
            onClose={() => setShowDevelopment(false)}
            />
            <View className='w-full flex flex-row items-center justify-between p-4 bg-secondary'>
                <TouchableOpacity onPress={() => router.push('/(tabs)/Home')}>
                        <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                <Text className='text-2xl text-white font-bold'>History</Text>
                <View className='flex flex-row flex-wrap gap-7'>
                <Ionicons name="ellipsis-vertical" size={24} color="#082644" />
                </View>
            </View>
            <View className='bg-primary h-full'>
            </View>
        </View>
    )
}

export default History