import { supabase } from "../supabase";

export async function getProfile(uuid: any) {
    const { data: artistData, error : artistError } = await supabase.from('profileArtist').select().eq('uuid', uuid)
    const { data: hostData, error: hostError } = await supabase.from('profileHost').select().eq('uuid', uuid)
    return { artistData, artistError, hostData, hostError};
}
