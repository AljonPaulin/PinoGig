import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

export default function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const router = useRouter();
  const rootNavigation = useRootNavigationState();

  // Get session + listen for auth state change
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Redirect only when navigation is ready and session is checked
  useEffect(() => {
    if (!rootNavigation?.key || session === undefined) return;

    if (session === null) {
      router.replace('/(auth)/signin');
    } else {
      router.replace('/(tabs)/Home');
    }
  }, [session, rootNavigation?.key]);

  // Splash Screen UI while checking
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Image className='size-40 bg-[#082644] rounded-full' source={require('../assets/images/logoPinogig.png')} />
    </View>
  );
}
