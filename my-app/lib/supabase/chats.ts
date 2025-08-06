import { Chats } from "@/types/chat";
import { supabase } from "../supabase"

export const getNumberOfUnreadChat = async (uid: any) => {
    const { data, error } = await supabase
        .from('messages')
        .select()
        .eq('receiver_id', uid)
        .eq('is_read', false)

    if(error) throw error;
    return data;
}

export const getMessageFromCurrentUser = async (uid: any) => {
    const { data: msgSender, error: errSender} = await supabase
        .from('messages')
        .select(`*, users:receiver_id ( name )`)
        .eq('sender_id', uid)
        .order('created_at', { ascending: false })

    return { msgSender, errSender } ;
}
export const getMessageToCurrentUser = async (uid: any) => {

    const { data: msgReceiver, error: errReceiver } = await supabase
    .from('messages')
    .select(`*, users:sender_id ( name )`)
    .eq('receiver_id', uid)
    .order('created_at', { ascending: false })

    return { msgReceiver, errReceiver } ;

}

export const getLatestChat = async (conversationID: any) => {
    const { data, error } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conversationID)
              .order('created_at', { ascending: false })
              .limit(1);
    return { data, error } ;
}

export const getConversationID = async (srcUID: string, uid: any, srcID: string, id:any) => {
    const { data, error } = await supabase.from('messages').select('conversation_id').eq(srcUID, uid).eq(srcID, id)
    return { data, error };
}

export const getAllConversationID = async (conversationId : any) => {
    const { data, error } = await supabase.from('messages').select().eq('conversation_id', conversationId).order('id', { ascending: false })
    return { data, error };
}

export const updateChatStatus = async (id: any) => {
    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', id)
    
    return error;
}

export const sendChat = async (chats: Chats) => {
    const { error } = await supabase.from('messages').insert(chats)
    return error;
}