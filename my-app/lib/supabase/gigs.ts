import { Gig } from "@/types/gig";
import { supabase } from "../supabase";
import { Application } from "@/types/application";

export async function getTopRecentGigs() {
    const { data, error } = await supabase
    .from('gigs')
    .select()
    .limit(3)

    if(error) throw error;
    return data;
}

export const getAllGigs = async () => {
    const { data, error } = await supabase
    .from('gigs')
    .select()

    if(error) throw error;
    return data;
}

export const getAllUsersGigs = async (uid: any) => {
    const { data, error } = await supabase.from('gigs').select().eq('uuid', uid)
    return { data, error };
}

export async function fetchGig(id: string | string[]) {
    const { data, error } = await supabase
    .from('gigs')
    .select()
    .eq('id', id)

    return { data, error}
}

export const postGig = async (gig: Gig) => {
    const { error } = await supabase
        .from('gigs')
        .insert(gig)

    return error;
}

export const updateGig = async (gig: Gig, id: any) => {
    const { error } = await supabase
        .from('gigs')
        .update(gig)
        .eq('id', id)

    return error;
}

export const postApplicationGig = async (application: Application) => {
    const { error } = await supabase.from('gig_applications').insert(application)
    return error;
}

export const fetchAllAppicationGigs = async () => {
    const { data, error } = await supabase
    .from('gig_applications')
    .select()

    if(error) throw error;
    return data;
}

export const getNumberOfGigs = async () => {
    const { count : countGig, error: gigError} = await supabase
        .from('gigs')
        .select('*', { count: 'exact', head: true })

    return { countGig,  gigError }
}

export const deleteGig = async (id: any) => {
    const response = await supabase
        .from('gigs')
        .delete()
        .eq('id', id)

    return response;
}

