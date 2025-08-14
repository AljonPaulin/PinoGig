import { router } from 'expo-router'
import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

const CustomAlert = ({ visible , type, message, onClose }: any ) => {

    const handle = (type: any) =>{
        if(type === 'profile'){
            router.push('/(tabs)/Profile')
        }
        if(type === 'development'){
            router.push('/(subTabs)/Books')
        }
        if(type === 'host'){
            router.push('/(tabs)/Setting')
        }
        onClose()
       
    }
    return (
        <Modal
        transparent
        visible={visible}
        animationType="fade"
        >
        <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-secondary w-80 p-5 rounded-2xl shadow-md items-center">
            <Text className="text-2xl font-bold mb-3 text-white">Notice</Text>
            <Text className="text-center mb-5 text-white">{message}</Text>
            <TouchableOpacity
                className="bg-blue-500 px-5 py-2 rounded-lg"
                onPress={() => handle(type)}
            >
                <Text className="text-white font-bold">OK</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    )
}

export default CustomAlert