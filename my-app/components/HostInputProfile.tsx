import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const HostInputProfile = () => {
    const [ name, setName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ isFocused, setIsFocused] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);


    return (
        <View className='w-full p-4'>
            <View>
                <Text className='ml-1'>Name</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md ${isFocused === "name" ? 'border-black' : 'border-gray-400' }`}
                    value={name}
                    onChangeText={setName}
                    placeholder='Enter your full name'
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused(null)}
                />
            </View>
            <View>
                <Text className='ml-1'>Phone Number</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md ${isFocused === "phone" ? 'border-black' : 'border-gray-400' }`}
                    value={phone}
                    onChangeText={setPhone}
                    multiline={true}
                    placeholder='Enter your phone number'
                    onFocus={() => setIsFocused('phone')}
                    onBlur={() => setIsFocused(null)}
                    keyboardType='numeric'
                />
            </View>
            <View>
                <Text className='ml-1'>Location</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md ${isFocused === "location" ? 'border-black' : 'border-gray-400' }`}
                    value={location}
                    onChangeText={setLocation}
                    multiline={true}
                    placeholder='Enter your location or address'
                    onFocus={() => setIsFocused('location')}
                    onBlur={() => setIsFocused(null)}
                />
            </View>
            <TouchableOpacity disabled={loading} className='bg-black p-4 rounded-md m-1 mt-4' onPress={() => handleSaveProfile()}>
                    <Text className='text-white text-center font-bold'>Save Now</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HostInputProfile