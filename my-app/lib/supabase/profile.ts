import { supabase } from "../supabase";

export async function getProfile(uuid: any) {
    const { data, error } = await supabase.from('profileArtist').select().eq('uuid', uuid)
    return { data, error};
}
