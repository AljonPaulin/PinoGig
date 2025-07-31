export interface Chats{
    sender_id: string | undefined,
    receiver_id: string,
    message: string,
    conversation_id: string | null
}