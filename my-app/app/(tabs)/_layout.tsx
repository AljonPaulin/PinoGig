import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return(
  <SafeAreaView style={{ flex: 1}}>
    <Tabs
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color}) => {
              let iconName;

              switch (route.name) {
                case "Home": {
                    iconName = focused ? 'home' : 'home-outline';
                    }
                  break;
                case "Gigs": {
                    iconName = focused ? 'card' : 'card-outline';
                  }
                  break;
                case "Post": {
                    iconName = focused ? 'add' : 'add-outline';
                  }
                  break;
                case "Profile": {
                    iconName = focused ? 'person' : 'person-outline';
                  }
                  break;
                case "Setting": {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }
                  break;
              }
              return <Ionicons name={iconName} size={24} color={color} />;
            },
            tabBarActiveTintColor: '#1d7fe0',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              width: "100%",
              backgroundColor: '#000e1a',
              elevation: 10,  
              height: 70},
            tabBarItemStyle:{
              marginTop: 5,
              height: 55,
            }
          })}
      >
      <Tabs.Screen name="Home" options={{ title: 'Home', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      <Tabs.Screen name="Post" options={{ title: 'Post', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      <Tabs.Screen name="Gigs" options={{ title: 'Gigs', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      <Tabs.Screen name="Profile" options={{ title: 'Profile', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      <Tabs.Screen name="Setting" options={{ title: 'Setting', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      </Tabs>
  </SafeAreaView>)
}

