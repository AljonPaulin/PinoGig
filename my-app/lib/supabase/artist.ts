import { supabase } from "../supabase"

export const getNumberOfArtist = async () => {
    const { count : countArtist, error: artistError} = await supabase
        .from('profileArtist')
        .select('*', { count: 'exact', head: true })
    
    return { countArtist, artistError}
}

export const getNumberBaseOnCategory = async (category: any) => {
    return await supabase.from('gig_applications').select('*',{count: 'exact', head: true }).eq('category', category)
}