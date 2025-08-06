import { Artist } from "@/types/artist";
import { supabase } from "../supabase"
import { User } from "@/types/user";
import { Host } from "@/types/host";

export const getUserByID = async (uid: any) => {
    const { data : hostData, error: hostError} = await supabase
                .from('users')
                .select()
                .eq('uuid', uid);
    
    return { hostData, hostError };
}
export const getUserName = async (id: any) => {
    const { data, error } = await supabase
            .from('users')
            .select('name')
            .eq('uuid', id)
    
    return { data, error };
}

export const getUserType = async (uid: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('type')
        .eq('uuid', uid )
    
    return { data, error };
}

export const postUser = async (user: User) => {
    const { error: userError } = await supabase.from('users').insert(user);
    return userError;
}

export const postArtistProfile = async (artist: Artist) => {
    const { error: artistError } = await supabase.from('profileArtist').insert(artist);
    
    return artistError;
}

export const updateArtistProfile = async (artist: Artist,  id: any) => {
    const { error: artistError } = await supabase.from('profileArtist').update(artist).eq('id', id);
    return artistError;
}

export const postHostProfile = async (host: Host) => {
    const { error: hostError } = await supabase.from('profileHost').insert(host);
    return hostError;
}

export const updateHostProfile = async (host: Host,  id: any) => {
    const { error: hostError } = await supabase.from('profileHost').update(host).eq('id', id);
    return hostError;
}

export const deleteUserHost = async (uuid: any) => {
    const response = await supabase
        .from('profileHost')
        .delete()
        .eq('uuid', uuid)
    
    return response;
}

export const deleteUserArtist = async (uuid: any) => {
    const response = await supabase
        .from('profileArtist')
        .delete()
        .eq('uuid', uuid)
    
    return response;
}