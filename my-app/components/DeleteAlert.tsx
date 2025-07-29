import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const DeleteAlert = ({ visible, type, message, onClose, onConfirm }: any ) => {
    const handle = (type: string, del: boolean ) =>{
        if(type === 'profile' && del ){
            onConfirm()
        }
        if(type === 'application' && del ){
            onConfirm()
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
            <View className='flex flex-row justify-evenly w-full'>
            <TouchableOpacity
                className="bg-blue-500 px-5 py-2 rounded-lg"
                onPress={() => handle(type, false)}
            >
                <Text className="text-white font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-red-500 px-5 py-2 rounded-lg"
                onPress={() => handle(type, true)}
            >
                <Text className="text-white font-bold">Confirm</Text>
            </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    )
}

export default DeleteAlert