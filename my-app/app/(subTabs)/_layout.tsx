import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubTabsLayout() {
  return(
  <SafeAreaView style={{ flex: 1}}>
    <Tabs
          initialRouteName="Chats"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color}) => {
              let iconName;

              switch (route.name) {
                case "Chats": {
                    iconName = focused ? 'chatbox' : 'chatbox-outline';
                    }
                  break;
                case "Books": {
                    iconName = focused ? 'document-text' : 'document-text-outline';
                  }
                  break;
                case "History": {
                    iconName = focused ? 'information-circle' : 'information-circle-sharp';
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
      <Tabs.Screen name="Chats" options={{ title: 'Chats', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      <Tabs.Screen name="Books" options={{ title: 'Books', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      <Tabs.Screen name="History" options={{ title: 'History', tabBarLabelStyle: { fontWeight : "bold", fontSize: 12} }} />
      </Tabs>
  </SafeAreaView>)
}

