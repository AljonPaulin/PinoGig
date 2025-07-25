import { Gig } from "@/types/gig";
import { supabase } from "../supabase";
import { Application } from "@/types/application";

export async function fetchData() {
    const { data, error } = await supabase
    .from('gigs')
    .select()
    .limit(3)

    return { data, error}
}

export async function fetchAllData() {
    const { data, error } = await supabase
    .from('gigs')
    .select()

    return { data, error}
}

export async function fetchGig(id: string | string[]) {
    const { data, error } = await supabase
    .from('gigs')
    .select()
    .eq('id', id)

    return { data, error}
}

export async function postGig(gig: Gig) {
    const { error } = await supabase
    .from('gigs')
    .insert(gig)

    return { error}
}


export async function postApplicationGig(application: Application) {
    const { error } = await supabase
                      .from('gig_applications')
                      .insert(application)

    return { error}
}

export async function fetchAllAppicationGig() {
    const { data, error } = await supabase
    .from('gig_applications')
    .select()

    return { data, error}
}