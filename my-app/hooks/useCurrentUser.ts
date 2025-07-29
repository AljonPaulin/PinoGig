import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useCurrentUser() {
    const [ uid, setUid ] = useState<string | undefined>(undefined);
    const [ email, setEmail ] = useState<string | undefined>(undefined);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            if(error) {
                console.log(error.message);
            } else{
                setEmail(data.user.email);
                setUid(data.user.id)
            }
            setLoading(false)
        }
        getUser();
    }, []);

    return { uid, email, loading }
};