import { supabase } from "../supabase"

export const loadNewNotification = async (uid : any) => {
    const { data, error } = await supabase
        .from('notifications')
        .select()
        .eq('uuid', uid)
        .eq('is_read', false)

    if (error) throw error;
    return data;
}

export const getAllNotification = async (uid : any) => {
    const { data, error } = await supabase
                .from('notifications')
                .select()
                .eq('uuid', uid)
                .order('id', { ascending: false })

    return { data, error };
}

export const updateNotificationStatus = async (id: any) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    return error
}