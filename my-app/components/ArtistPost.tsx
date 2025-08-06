import { View, Text, TextInput, TouchableOpacity, Alert} from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import React, { useState } from 'react'
import { Application } from '@/types/application'
import { router } from 'expo-router'
import { postApplicationGig } from '@/lib/supabase/gigs'
import Ionicons from '@expo/vector-icons/Ionicons'

const ArtistPost = () => {
  const [ stageName, setStageName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ experience, setExperience ] = useState("");
  const [ isFocused, setIsFocused ] = useState<string | null>(null);
  const [ category, setCategory] = useState("");
  const [ travel, setTravel] = useState("");
  const [ rate, setRate] = useState("");
  const [ available, setAvailable] = useState([]);
  const [ loading, setLoading] = useState(false);
  
  const categoryData = [
      {key:'1', value:'Singer'},
      {key:'2', value:'Choreographer'},
      {key:'3', value:'Comedian'},
      {key:'4', value:'Host'},
  ]

  const travelData = [
    {key:'1', value:'Local only'},
    {key:'2', value:'Nearby cities'},
    {key:'3', value:'Nationwide'},
  ]

  const availableData = [
    {key:'1', value:'Birthday' },
    {key:'2', value:'Wedding'},
    {key:'3', value:'Bar'},
    {key:'4', value:'Cafe'},
    {key:'5', value:'Corporate'},
    {key:'6', value:'School Event'},
  ]

  const handlePost = async () => {
      setLoading(true)
      if(stageName === '' || description === '' || category === '' ||
        experience === '' || rate === '' || available.length === 0 || travel === ''){
          setLoading(false)
          return Alert.alert('Fill All fields')
      }else{
         const application : Application = {
          stageName,
          description,
          category,
          experience,
          rate: Number(rate),
          available,
          travel
        }
        const error = await postApplicationGig(application)

        if(error){
          Alert.alert(error.message)
        } else{
          console.log("Success adding application");
          router.back();
        }
        setLoading(false)
      }
  }


  return (
    <View className='w-full p-4'>
       <View>
            <Text className={`ml-1 font-bold ${isFocused === "stageName" ? 'text-tertiary' : 'text-gray-400' }`}>Stage Name</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "stageName" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={stageName}
                onChangeText={setStageName}
                placeholder='Enter your stage name'
                placeholderTextColor={isFocused === "stageName" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('stageName')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "description" ? 'text-tertiary' : 'text-gray-400' }`}>Description</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "description" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={description}
                onChangeText={setDescription}
                placeholder='Short bio or what makes you unique'
                multiline={true}
                placeholderTextColor={isFocused === "description" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('description')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View className='ml-1'>
          <Text className="ml-1 font-bold text-gray-400">Category</Text>
          <SelectList
              setSelected={(val : string) => setCategory(val)} 
              data={categoryData}
              save="value"
              search={false}
              defaultOption={{key:'1', value:'Singer'}} 
              inputStyles={{ color: '#9ca3af', fontWeight: 'bold' }}
              arrowicon={<Ionicons name="chevron-down" size={20} color="#9ca3af" />}
              dropdownStyles={{backgroundColor: "#082644", borderColor: "#082644" }}
              dropdownTextStyles={{color: "white", fontWeight: "bold"}}
              boxStyles={{borderColor : "#082644", borderWidth : 2, borderRadius: 6, paddingVertical: 7, marginRight: 3, backgroundColor: "#082644"}}
          />
        </View>
        <View>
            <Text className={`ml-1 font-bold ${isFocused === "experience" ? 'text-tertiary' : 'text-gray-400' }`}>Experience</Text>
            <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "experience" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={experience}
                onChangeText={setExperience}
                placeholder='Enter your experience here...'
                placeholderTextColor={isFocused === "experience" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('experience')}
                onBlur={() => setIsFocused(null)}
            />
        </View>
        <View>
          <Text className={`ml-1 font-bold ${isFocused === "rate" ? 'text-tertiary' : 'text-gray-400' }`}>Rate</Text>
          <TextInput
                className={`border-2 p-2 px-3 m-1 rounded-md font-bold bg-secondary ${isFocused === "rate" ? 'border-tertiary text-tertiary' : 'border-secondary text-gray-400' }`}
                value={rate}
                onChangeText={setRate}
                placeholder='e.g $150 per hour'
                placeholderTextColor={isFocused === "rate" ? 'gray' : '#9CA3AF'}
                onFocus={() => setIsFocused('rate')}
                onBlur={() => setIsFocused(null)}
                keyboardType='numeric'
            />
        </View>
        <View className='ml-1'>
          <Text className='mb-1 text-gray-400 font-bold'>Availability</Text>
          <MultipleSelectList 
              setSelected={(val : any) => setAvailable(val)} 
              data={availableData} 
              save="value"
              search={false}
              label="Available For"
              labelStyles={{color:'#9ca3af', fontWeight: 'bold' }}
              inputStyles={{ color: '#9ca3af', fontWeight: 'bold' }}
              badgeStyles={{backgroundColor: "#1d7fe0" }}
              dropdownStyles={{backgroundColor: "#082644", borderColor: "#082644" }}
              dropdownTextStyles={{color: "white", fontWeight: "bold"}}
              boxStyles={{borderColor : "#082644", borderWidth : 2, borderRadius: 6, paddingVertical: 7, marginRight: 3, backgroundColor: "#082644" }}
          />
        </View>
        <View className='ml-1'>
          <Text className='mb-1 text-gray-400 font-bold'>Travel Willingness</Text>
          <SelectList
              setSelected={(val : string) => setTravel(val)} 
              data={travelData}
              save="value"
              search={false}
              defaultOption={{key:'1', value:'Local only'}} 
              inputStyles={{ color: '#9ca3af', fontWeight: 'bold' }}
              arrowicon={<Ionicons name="chevron-down" size={20} color="#9ca3af" />}
              dropdownStyles={{backgroundColor: "#082644", borderColor: "#082644" }}
              dropdownTextStyles={{color: "white", fontWeight: "bold"}}
              boxStyles={{borderColor : "#082644", borderWidth : 2, borderRadius: 6, paddingVertical: 7, marginRight: 3, backgroundColor: "#082644" }}
          />
        </View>
        <TouchableOpacity disabled={loading} className='bg-tertiary p-4 rounded-md m-1 mt-4' onPress={handlePost}>
                    <Text className='text-white text-center font-bold'>Post Now</Text>
        </TouchableOpacity>
    </View>
  )
}

export default ArtistPost