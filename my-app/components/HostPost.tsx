import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Gig } from '@/types/gig';
import { router } from 'expo-router';
import { postGig } from '@/lib/supabase/gigs';
import { supabase } from '@/lib/supabase';


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
    const [ tags, setTags] = useState<string[]>(['']);
    const [ requirements , setRequirements] =  useState<string[]>(['']);

    useEffect(() => {
        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setPlace(data.place || "");
          setLocation(data.location || "");
          setAmount(String(data.rate) || "");
          setPeople(String(data.people)|| "");
          setTags(data.tags || []);
          setRequirements(data.requirements || []);
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

        const { error } = await postGig(gig);

        if(error){
            Alert.alert(error.message)
            console.log(error.message);
        }else{ 
            console.log(`Sucess $€{data}`);
            router.back();
        }
        setLoading(false)
    }

    const handleUpdateGig = async () => {
        setLoading(true)
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
        
        const { error } = await supabase
          .from('gigs')
          .update(gig)
          .eq('id', data.id)

        if(error){
            Alert.alert(error.message)
            console.log(error.message);
        }else{ 
            console.log(`Sucess $€{data}`);
            router.push(`/(context)/post/${data.id}`)
        }
        setLoading(false)
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
                    <Text className='border-2 p-2 border-secondary bg-secondary rounded-md w-36 text-gray-400 font-bold'>{startTime.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}</Text>
                    <TouchableOpacity className='bg-gray-700 p-2 rounded-md' onPress={() => showTimepicker('start')}>
                        <FontAwesome6 name="clock" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text className='ml-1 text-gray-400 font-bold'>End Time</Text>
                <View className='flex flex-row flex-wrap gap-2 items-center'>
                    <Text className='border-2 p-2 border-secondary bg-secondary rounded-md w-36 text-gray-400 font-bold'>{endTime.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}</Text>
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
            <TouchableOpacity className='bg-gray-700 rounded-md items-center justify-center h-40 m-1'>
                <Text className='font-semibold text-white'>Venue Photo</Text>
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