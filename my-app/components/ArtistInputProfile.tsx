import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { supabase } from '@/lib/supabase';
import { Artist } from '@/types/artist';
import { router } from 'expo-router';

const ArtistInputProfile = ({ data, mode } : any) => {
    const [ name, setName ] = useState("");
    const [ about, setAbout ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ isFocused, setIsFocused] = useState<string | null>(null);
    const [ skills, setSkills] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (data) {
          setName(data.name || "");
          setAbout(data.about || "");
          setDescription(data.description || "");
          setLocation(data.location || "");
          setPhone(data.phone || "");
          setSkills(data.skills || []);
        }
        console.log(skills);
        
      }, [data]);

    const typeData = [
        { key: '1', value: 'Singer' },
        { key: '2', value: 'Host' },
        { key: '3', value: 'Comedian' },
        { key: '4', value: 'Choreographer' },
        { key: '5', value: 'DJ' },
        { key: '6', value: 'Magician' },
        { key: '7', value: 'Instrumentalist' },
    ]

    const handleSaveProfile = async () => {
        setLoading(true)
        const artist: Artist = {
            name,
            about,
            description,
            location,
            phone,
            skills
        }
        const { error } = await supabase.from('profileArtist').insert(artist);

        if(error){
            Alert.alert(error.message)
        }else{
            console.log('Success in creating profile');
            router.push('/(tabs)/Profile')
        }
        setLoading(false)
        
    }
    const handleUpdateProfile = async () => {
        setLoading(true)
        const artist: Artist = {
            name,
            about,
            description,
            location,
            phone,
            skills
        }
        const { error } = await supabase.from('profileArtist').update(artist).eq('id', data.id);

        if(error){
            Alert.alert(error.message)
        }else{
            console.log('Success in updating profile');
            router.push('/(tabs)/Profile')
        }
        setLoading(false)
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
                <Text className={`ml-1 font-bold ${isFocused === "description" ? 'text-tertiary' : 'text-gray-400' }`}>Short Description</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "description" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                    value={description}
                    onChangeText={setDescription}
                    placeholder='Enter short descritption like eg. Pop singer and host'
                    placeholderTextColor={'gray'}
                    onFocus={() => setIsFocused('description')}
                    onBlur={() => setIsFocused(null)}
                />
            </View>
            <View>
                <Text className={`ml-1 font-bold ${isFocused === "about" ? 'text-tertiary' : 'text-gray-400' }`}>About</Text>
                <TextInput
                    className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "about" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                    value={about}
                    onChangeText={setAbout}
                    multiline={true}
                    placeholder='Describe yourself and achievement'
                    placeholderTextColor={'gray'}
                    onFocus={() => setIsFocused('about')}
                    onBlur={() => setIsFocused(null)}
                />
            </View>
            <View className='ml-1'>
                <Text className='mb-1 text-gray-400 font-bold'>Skills</Text>
                <MultipleSelectList 
                    setSelected={(val : any) => setSkills(val)} 
                    data={typeData} 
                    save="value"
                    search={false}
                    label="Skills or Talent"
                    labelStyles={{color:'#9ca3af', fontWeight: 'bold' }}
                    inputStyles={{ color: '#9ca3af', fontWeight: 'bold' }}
                    badgeStyles={{backgroundColor: "#1d7fe0" }}
                    dropdownStyles={{backgroundColor: "#082644", borderColor: "#082644" }}
                    dropdownTextStyles={{color: "white", fontWeight: "bold"}}
                    boxStyles={{borderColor : "#082644", borderWidth : 2, borderRadius: 6, paddingVertical: 7, marginRight: 3, backgroundColor: "#082644" }}
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
                <TouchableOpacity disabled={loading} className='bg-tertiary rounded-md m-1 mt-4' onPress={() => handleUpdateProfile()}>
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

export default ArtistInputProfile