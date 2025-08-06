import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Host } from '@/types/host';
import { router } from 'expo-router';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { User } from '@/types/user';
import { postHostProfile, postUser, updateHostProfile } from '@/lib/supabase/users';

const HostInputProfile = ({ data, mode } : any) => {
    const [ name, setName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ isFocused, setIsFocused] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);
    const { uid, email } = useCurrentUser();

    useEffect(() => {
        if (data) {
          setName(data.name || "");
          setLocation(data.location || "");
          setPhone(data.phone || "");
        }
        
    }, [data]);

    const handleSaveProfile = async () => {
        setLoading(true)
        if (!email || !uid) return;
        if(name === '' || location === '' || phone === '' || email === ''){
            setLoading(false)
            return Alert.alert('Fill All fields')
        }else{
            const host: Host = {
                email,
                name,
                location,
                phone,
            }
            const user: User = {
                name,
                type: 'host',
                email: email,
                uuid: uid,
            }
            const hostError  = await postHostProfile(host);
            const  userError = await postUser(user);
    
            if (hostError || userError) {
                hostError && Alert.alert(hostError.message);
                userError && Alert.alert(userError.message);
            }else{
                console.log('Success in creating profile');
                router.push('/(tabs)/Profile')
            }
            setLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        setLoading(true)
        if(name === '' || location === '' || phone === '' || email === ''){
              setLoading(false)
              return Alert.alert('Fill All fields')
        }else{
            const host: Host = {
                email,
                name,
                location,
                phone,
            }
            const hostError  = await updateHostProfile(host, data.id);
    
            if(hostError){
                Alert.alert(hostError.message)
            }else{
                console.log('Success in updating profile');
                router.push('/(tabs)/Profile')
            }
            setLoading(false)
        }
    }


    return (
        <View className='w-full p-4'>
            <View>
                <Text className={`ml-1 font-bold ${isFocused === "name" ? 'text-tertiary' : 'text-gray-400' }`}>Name</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "name" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                    value={name}
                    onChangeText={setName}
                    placeholder='Enter your full name'
                    placeholderTextColor={'gray'}
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused(null)}
                />
            </View>
            <View>
                <Text className={`ml-1 font-bold ${isFocused === "phone" ? 'text-tertiary' : 'text-gray-400' }`}>Phone Number</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "phone" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                    value={phone}
                    onChangeText={setPhone}
                    multiline={true}
                    placeholder='Enter your phone number'
                    placeholderTextColor={'gray'}
                    onFocus={() => setIsFocused('phone')}
                    onBlur={() => setIsFocused(null)}
                    keyboardType='numeric'
                />
            </View>
            <View>
                <Text className={`ml-1 font-bold ${isFocused === "location" ? 'text-tertiary' : 'text-gray-400' }`}>Location</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "location" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                    value={location}
                    onChangeText={setLocation}
                    multiline={true}
                    placeholder='Enter your location or address'
                    placeholderTextColor={'gray'}
                    onFocus={() => setIsFocused('location')}
                    onBlur={() => setIsFocused(null)}
                />
            </View>
            { mode === 'edit' ? (
                <TouchableOpacity disabled={loading} className='bg-tertiary p-4 rounded-md m-1 mt-4' onPress={() => handleUpdateProfile()}>
                    <Text className='text-white text-center font-bold'>Update Now</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity disabled={loading} className='bg-tertiary p-4 rounded-md m-1 mt-4' onPress={() => handleSaveProfile()}>
                <Text className='text-white text-center font-bold'>Save Now</Text>
                </TouchableOpacity>
            )
            }
           
        </View>
    )
}

export default HostInputProfile