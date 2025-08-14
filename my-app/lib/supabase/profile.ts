import { supabase } from "../supabase";

export async function getProfile(uuid: any) {
    const { data: artistData, error : artistError } = await supabase.from('profileArtist').select().eq('uuid', uuid)
    const { data: hostData, error: hostError } = await supabase.from('profileHost').select().eq('uuid', uuid)
    return { artistData, artistError, hostData, hostError};
}

export async function getProfileArtist(uuid: any) {
    const { data: artistData, error : artistError } = await supabase.from('profileArtist').select().eq('uuid', uuid)
    return { artistData, artistError };
}
export async function getProfileHost(uuid: any) {
    const { data: hostData, error: hostError } = await supabase.from('profileHost').select().eq('uuid', uuid)
    return { hostData, hostError};
}

export const updateImgProfile = async (name: string, id: any, type: any) => {
    if(type === 'artist'){
        const { error } = await supabase
        .from('profileArtist')
        .update({ img: name })
        .eq('id', id)

        return { error } ;
    }else{
        const { error } = await supabase
        .from('profileHost')
        .update({ img: name })
        .eq('id', id)

        return { error } ;
    }
   
}

