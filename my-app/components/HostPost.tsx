import { supabase } from '@/lib/supabase';
import { postGig, updateGig, updateImgGig } from '@/lib/supabase/gigs';
import { Gig } from '@/types/gig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';


const HostPost = ({ data, type } : any) => {
    const [ title , setTitle ] = useState("");
    const [ description , setDescription ] = useState("");
    const [ location , setLocation ] = useState("");
    const [ place , setPlace ] = useState("");
    const [ amount , setAmount ] = useState("");
    const [ people , setPeople ] = useState("");
    const [ isFocused, setIsFocused] = useState<string | null>(null)
    const [ date, setDate] = useState(new Date(1598051730000));
    const [ startTime, setStartTime] = useState(new Date(1598051730000));
    const [ endTime, setEndTime] = useState(new Date(1598051730000));
    const [ isStartTime, setIsStartTime] = useState(true);
    const [ mode, setMode] = useState('date');
    const [ show, setShow] = useState(false);
    const [ loading, setLoading] = useState(false);
    const [ loadTag, setLoadTag] = useState(false);
    const [ loadReq, setLoadReq] = useState(false);
    const [ oldPic, setOldPic] = useState(false);
    const [ tags, setTags] = useState<string[]>(['']);
    const [ requirements , setRequirements] =  useState<string[]>(['']);
    const [ localImage, setLocalImage] = useState<any | null | undefined>(null)
    const [ previewUri, setPreviewUri] = useState<string | null | undefined>(null)
    const [ signedUrl, setSignedUrl] = useState<any | null | undefined>(null)


    useEffect(() => {

        const loadPic = async (img: string) => {
            setOldPic(true)
            const { data, error } = await supabase.storage
                    .from('assets')
                    .createSignedUrl(`gig/${img}`, 60)
        
            if(error) { Alert.alert(error.message) }

            if(data){
               setSignedUrl(data.signedUrl)
            }
        }

        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setPlace(data.place || "");
          setLocation(data.location || "");
          setAmount(String(data.rate) || "");
          setPeople(String(data.people)|| "");
          setTags(data.tags || []);
          setRequirements(data.requirements || []);
          if(data.img !== null){
            loadPic(data.img)
          }
        }
        
    }, [data]);


  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      if(mode === 'date'){
        setDate(currentDate);
      }else{
        isStartTime ?  setStartTime(currentDate) :  setEndTime(currentDate);
      }
    };
  
    const showMode = (currentMode : string) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = (type : string) => {
        if(type === 'start'){
            setIsStartTime(true)
        } else{
            setIsStartTime(false)
        }
        showMode('time');
    };

    const handlePostGig = async () => {
        setLoading(true)
        if(title === '' || description === '' || place === '' ||
            location === '' || amount === '' || people === '' || data === '' || localImage === null
            || tags.length === 0 || requirements.length === 0){
              setLoading(false)
              return Alert.alert('Fill All fields')
        }else{
            const diffInMs = endTime.getTime() - startTime.getTime();
            const diffInHours = diffInMs / (1000 * 60 * 60); 

            const gig: Gig = {
                title,
                description,
                place,
                location,
                rate: Number(amount),
                people: Number(people),
                date,
                startTime: startTime.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }),
                endTime: endTime.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }),
                hours: diffInHours,
                tags,
                requirements,
            };

            const { data, error} = await postGig(gig);

            if(error){
                Alert.alert(error.message)
                console.log(error.message);
            }else{ 
                const id = data?.[0].id

                const {error: errUpload } = await supabase
                .storage
                .from('assets')
                .upload(`gig/gig${id}.${localImage.mimeType.split('/')[1]}`, decode(localImage.base64), {
                    contentType: localImage.mimeType
                })

                if (errUpload) {
                    console.error('Upload error:', errUpload)
                }

                console.log(`Sucess $€{data}`);
                router.back();
            }
            setLoading(false)
        }
    }

    const handleUpdateGig = async () => {
        setLoading(true)
        if(title === '' || description === '' || place === '' ||
            location === '' || amount === '' || people === '' || data === '' || localImage === null
            || tags.length === 0 || requirements.length === 0){
              setLoading(false)
              return Alert.alert('Fill All fields')
        }else{
            const diffInMs = endTime.getTime() - startTime.getTime();
            const diffInHours = diffInMs / (1000 * 60 * 60); 

            const gig: Gig = {
                title,
                description,
                place,
                location,
                rate: Number(amount),
                people: Number(people),
                date,
                startTime: startTime.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }),
                endTime: endTime.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }),
                hours: diffInHours,
                tags,
                requirements,
            };
            
            
            const { data: dataID, error} = await updateGig(gig, data.id);

            if(error){
                Alert.alert(error.message)
                console.log(error.message);
            }else{
                const id = dataID?.[0].id

                if(localImage !== null){
                    if(oldPic){
                        const {error: errUpload } = await supabase
                            .storage
                            .from('assets')
                            .update(`gig/gig${id}.${localImage.mimeType.split('/')[1]}`, decode(localImage.base64), {
                                    contentType: localImage.mimeType
                            })
        
                        if (errUpload) {
                            Alert.alert(errUpload.message)
                        } else{
                            const { error : errorImg } = await updateImgGig(`gig${id}.${localImage.mimeType.split('/')[1]}`, data.id);
                            if (errorImg) { console.error('img error:', errorImg) }
                        }
                    }
                }

                console.log(`Sucess $€{data}`);
                router.push(`/(context)/post/${data.id}`)
            }
            setLoading(false)
        }
    }

    const handleTagChange = (text: string, index: number) => {
        const updatedTags = [...tags];
        updatedTags[index] = text;
        setTags(updatedTags);
    };
    
    const addTags = () => {
        setLoadTag(true)
        const lastTag = tags[tags.length - 1];
        if (lastTag.trim() !== '') {
          setTags([...tags, '']);
        }
        setLoadTag(false)
    };

    const handleReqChange = (text: string, index: number) => {
        const updatedReqs = [...requirements];
        updatedReqs[index] = text;
        setRequirements(updatedReqs);
    };
    
    const addReqs = () => {
        setLoadReq(true)
        const lastReq = requirements[requirements.length - 1];
        if (lastReq.trim() !== '') {
          setRequirements([...requirements, '']);
        }
        setLoadReq(false)
    };
    
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
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "title" ? 'text-tertiary' : 'text-gray-400' }`}>Title</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "title" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={title}
                onChangeText={setTitle}
                placeholder='eg. Name of the Event'
                placeholderTextColor={isFocused === "title" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('title')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "description" ? 'text-tertiary' : 'text-gray-400' }`}>Description</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "description" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={description}
                onChangeText={setDescription}
                placeholder='Description of the event, skills and what type of artist are you looking for...'
                placeholderTextColor={isFocused === "description" ? 'gray' : '#9CA3AF'}
                multiline={true}
                onFocus={() => setIsFocused('description')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "place" ? 'text-tertiary' : 'text-gray-400' }`}>Place</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "place" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={place}
                onChangeText={setPlace}
                placeholderTextColor={isFocused === "place" ? 'gray' : '#9CA3AF'}
                placeholder='Set name of building or cafe'
                onFocus={() => setIsFocused('place')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "location" ? 'text-tertiary' : 'text-gray-400' }`}>Location</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "location" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={location}
                onChangeText={setLocation}
                placeholder='Set location address'
                placeholderTextColor={isFocused === "location" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('location')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "amount" ? 'text-tertiary' : 'text-gray-400' }`}>Rate</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "amount" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={amount}
                onChangeText={setAmount}
                placeholder='Set amount of your gig'
                placeholderTextColor={isFocused === "amount" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('amount')}
                onBlur={() => setIsFocused(null)}
                keyboardType='numeric'
            />
        </View>
        
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "people" ? 'text-tertiary' : 'text-gray-400' }`}>People</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "people" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={people}
                onChangeText={setPeople}
                placeholder='Set the number of guest'
                placeholderTextColor={isFocused === "people" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('people')}
                onBlur={() => setIsFocused(null)}
                keyboardType='numeric'
            />
        </View>
        <View>
            <Text className='ml-1 text-gray-400 font-bold'>Date</Text>
            <View className='flex flex-row flex-wrap'>
                <Text className='border-2 p-2 m-1 border-secondary bg-secondary rounded-md w-80 text-gray-400 font-bold'>{date.toDateString()}</Text>
                <TouchableOpacity className='bg-gray-700 flex items-center justify-center p-2 rounded-md' onPress={showDatepicker}>
                    <Fontisto name="date" size={24} color="white"/>
                </TouchableOpacity>
            </View>
        </View>

        <View className='flex flex-row justify-between px-1'>
            <View>
                <Text className='ml-1 text-gray-400 font-bold'>Start Time</Text>
                <View className='flex flex-row flex-wrap gap-2 items-center'>
                    <Text className='border-2 p-2 border-secondary bg-secondary rounded-md w-32 text-gray-400 font-bold'>{startTime.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}</Text>
                    <TouchableOpacity className='bg-gray-700 p-2 rounded-md' onPress={() => showTimepicker('start')}>
                        <FontAwesome6 name="clock" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text className='ml-1 text-gray-400 font-bold'>End Time</Text>
                <View className='flex flex-row flex-wrap gap-2 items-center'>
                    <Text className='border-2 p-2 border-secondary bg-secondary rounded-md w-32 text-gray-400 font-bold'>{endTime.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}</Text>
                    <TouchableOpacity className='bg-gray-700 p-2 rounded-md' onPress={() => showTimepicker('end')}>
                        <FontAwesome6 name="clock" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
                    
        <View>
        <Text className={`ml-1 font-bold ${isFocused === "tags" ? 'text-tertiary' : 'text-gray-400' }`}>Tags</Text>
        <View className="flex flex-row flex-wrap gap-3 items-center ml-1 py-2">
            {tags.filter((tag) => tag.trim() !== '')
                .map((tag, idx) => (
                    <Text key={idx} className="bg-gray-300 py-1 px-3 rounded-2xl text-sm">#{tag}</Text>
            ))}
        </View>
        {tags.map((value, index) => (
            <View key={index} className="flex flex-row flex-wrap gap-2 items-center justify-between">
            <TextInput 
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold w-80 bg-secondary ${isFocused === "tags" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={value}
                onChangeText={(text) => handleTagChange(text, index)}
                placeholder="Add Tags"
                placeholderTextColor={isFocused === "tags" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('tags')}
                onBlur={() => setIsFocused(null)}
            />
            {index === tags.length - 1 && (
                <TouchableOpacity
                disabled={loadTag}
                className="bg-gray-700 p-2 rounded-md"
                onPress={addTags}
                >
                <Ionicons name="add-sharp" size={24} color="white" />
                </TouchableOpacity>
            )}
            </View>
        ))}
        </View>

        <View>
            <Text className={`ml-1 font-bold ${isFocused === "requirements" ? 'text-tertiary' : 'text-gray-400' }`}>Requirements</Text>
            {requirements.map((value, index) =>(
                <View key={index} className='flex flex-row flex-wrap gap-2 items-center justify-between'>
                <TextInput
                     className={`border-2 p-2 px-3 m-1 rounded-md font-bold w-80 bg-secondary ${isFocused === "requirements" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                     value={value}
                     onChangeText={(text) => handleReqChange(text, index)}
                     placeholder='Add requirements'
                     placeholderTextColor={isFocused === "requirements" ? 'gray' : '#9CA3AF'}
                     onFocus={() => setIsFocused('requirements')}
                     onBlur={() => setIsFocused(null)}
                 /> 
                 {index === requirements.length - 1 && (
                    <TouchableOpacity className='bg-gray-700 p-2 rounded-md' disabled={loadReq}  onPress={addReqs}>
                    <Ionicons name="add-sharp" size={24} color="white" />
                 </TouchableOpacity>
                    )}
             </View>
            ))}
            
        </View>

        <View className='w-full flex'>
            <Text className='ml-1 text-gray-400 font-bold' >Add Photo</Text>
            <TouchableOpacity className='bg-gray-700 rounded-md items-center justify-center h-72 m-1' onPress={() => {handleUploadImg()}}>
                {signedUrl ? (
                    <Image src={signedUrl} className='rounded-md w-full h-72 m-1'/>
                ): (
                    previewUri ? (
                        <Image source={{ uri: previewUri }} className='rounded-md w-full h-72 m-1'/>
                    ): (
                        <Text className='font-semibold text-white'>Venue Photo</Text>
                    )
                )}
            </TouchableOpacity>
        </View>
        {type !== 'edit' ? (
            <TouchableOpacity disabled={loading} className='bg-tertiary p-2 rounded-md m-1 mt-4' onPress={() => handlePostGig()}>
                <Text className='text-primary text-center text-xl font-bold'>Post Now</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity disabled={loading} className='bg-tertiary p-2 rounded-md m-1 mt-4' onPress={() => handleUpdateGig()}>
                <Text className='text-primary text-center text-xl font-bold'>Update Now</Text>
            </TouchableOpacity>
        )}
        
        
        {show && (
            <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            />
      )}
    </View>
    )
}

export default HostPost