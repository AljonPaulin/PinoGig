import { supabase } from "../supabase";

export async function getProfilePic() {
    const { data, error } = await supabase
            .storage
            .getBucket('assets')
    return { data, error};
}

export function getGigPic() {
    const { data } = supabase
            .storage
            .from('assets')
            .getPublicUrl('gig/1/gig1.png')
    return { data };
}

export async function getBucket() {
    const { data, error } = await supabase
        .storage
        .from('assets')
        .list('gig', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })
    return { data, error};
}

export const createUrls = async (name: any) => {
    return await supabase.storage.from('assets').createSignedUrl(`gig/${name}`, 60)
}