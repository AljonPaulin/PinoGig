export interface Booking{
    sender_uid: string,
    receiver_uid: string,
    is_Accepted: boolean | null,
    stageName: string,
    description: string
}