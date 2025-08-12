import { useCurrentUser } from '@/hooks/useCurrentUser';
import { supabase } from '@/lib/supabase';
import { updateImgProfile } from '@/lib/supabase/profile';
import { postArtistProfile, postUser, updateArtistProfile } from '@/lib/supabase/users';
import { Artist } from '@/types/artist';
import { User } from '@/types/user';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';


const ArtistInputProfile = ({ data, mode } : any) => {
    const [ name, setName ] = useState("");
    const [ about, setAbout ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ isFocused, setIsFocused] = useState<string | null>(null);
    const [ skills, setSkills] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ localImage, setLocalImage] = useState<any | null | undefined>(null)
    const [ previewUri, setPreviewUri] = useState<string | null | undefined>(null)
    const [ signedUrl, setSignedUrl] = useState<any | null | undefined>(null)
    const [ oldPic, setOldPic] = useState(false);


    const { uid, email } = useCurrentUser();


    useEffect(() => {
        const loadPic = async (img: string) => {
            setOldPic(true)
            const { data, error } = await supabase.storage
                    .from('assets')
                    .createSignedUrl(`profile/artist/${img}`, 60)
                    
            if(error) { Alert.alert(error.message) }

            if(data){
               setSignedUrl(data.signedUrl)
            }
        }

        if (data) {
          setName(data.name || "");
          setAbout(data.about || "");
          setDescription(data.description || "");
          setLocation(data.location || "");
          setPhone(data.phone || "");
          setSkills(data.skills || []);
          if(data.img !== null){
            loadPic(data.img)
          }
        }
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
        if (!email || !uid) return;

        if(name === '' || about === '' || description === '' ||
            location === '' || phone === '' || skills.length === 0 || email === ''){
              setLoading(false)
              return Alert.alert('Fill All fields')
        }else{
            const artist: Artist = {
                name,
                about,
                description,
                location,
                phone,
                skills,
                email
            }
            const user: User = {
                name,
                type: 'artist',
                email: email,
                uuid: uid,
            }
            const artistError = await postArtistProfile(artist);
            const userError = await postUser(user);
    
            if (artistError || userError) {
                artistError && Alert.alert(artistError.message);
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
        if (!email) return;
        if(name === '' || about === '' || description === '' ||
            location === '' || phone === '' || skills.length === 0 || email === '' || localImage === null){
              setLoading(false)
              return Alert.alert('Fill All fields')
        }else{
            const artist: Artist = {
                name,
                about,
                description,
                location,
                phone,
                skills,
                email
            }
            const artistError = await updateArtistProfile(artist, data.id)
    
            if(artistError){
                Alert.alert(artistError.message)
            }else{
                const id = data.id
                console.log(localImage.mimeType);
                

                if(localImage !== null){
                    if(oldPic){
                        const {error: errUpload } = await supabase
                            .storage
                            .from('assets')
                            .update(`profile/artist/profile${id}.${localImage.mimeType.split('/')[1]}`, decode(localImage.base64), {
                                    contentType: localImage.mimeType
                            })
        
                        if (errUpload) {
                            Alert.alert(errUpload.message)
                        } else{
                            const { error : errorImg } = await updateImgProfile(`profile${id}.${localImage.mimeType.split('/')[1]}`, data.id, 'artist');
                            if (errorImg) { console.error('img error:', errorImg) }
                        }
                    }else{
                        const {error: errUpload } = await supabase
                            .storage
                            .from('assets')
                            .upload(`profile/artist/profile${id}.${localImage.mimeType.split('/')[1]}`, decode(localImage.base64), {
                                    contentType: localImage.mimeType
                            })
    
                        if (errUpload) {
                            Alert.alert(errUpload.message)
                        } else{
                            const { error : errorImg } = await updateImgProfile(`profile${id}.${localImage.mimeType.split('/')[1]}`, data.id, 'artist');
                            if (errorImg) { console.error('img error:', errorImg) }
                        }
                    }
                }

                console.log('Success in updating profile');
                router.push('/(tabs)/Profile')
            }
            setLoading(false)
        }
    }
    const handleUploadImg = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permissionResult.granted) {
            alert("Permission to access gallery is required!")
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true
        })

        if (!result.canceled) {
            setLocalImage(result.assets[0]) 
            setPreviewUri(result.assets[0].uri)
            setSignedUrl(null)
        }
    }


    return (
        <View className='w-full p-4'>
            <TouchableOpacity className='bg-gray-700 rounded-md items-center justify-center h-72 m-1' onPress={() => {handleUploadImg()}}>
                {signedUrl ? (
                    <Image src={signedUrl} className='rounded-md w-full h-72 m-1'/>
                ): (
                    previewUri ? (
                        <Image source={{ uri: previewUri }} className='rounded-md w-full h-72 m-1'/>
                    ): (
                        <Text className='font-semibold text-white'>Profile Photo</Text>
                    )
                )}
            </TouchableOpacity>
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

export default ArtistInputProfile