import { Booking } from "@/types/booking"
import { supabase } from "../supabase"

export const getAllAcceptedBooking = async (uid: any) => {
    const {data: bookingAccepted , error: errorBookingAccepted } = await supabase.from('Booking').select().eq('receiver_uid', uid).eq('is_Accepted', true)
    return { bookingAccepted, errorBookingAccepted}
}

export const getAllCancelledBooking = async (uid: any) => {
    const {data: bookingCancelled , error: errorBookingCancelled } = await supabase.from('Booking').select().eq('receiver_uid', uid).eq('is_Accepted', false)
    return { bookingCancelled, errorBookingCancelled}
}

export const getAllBooking = async (uid: any) => {
    const {data: booking , error: errorBooking } = await supabase.from('Booking').select().eq('receiver_uid', uid).is('is_Accepted', null)
    return { booking,  errorBooking }
}

export const updateBookingStatus = async (sender_uid: string, accept: boolean, uid: any) => {
    const { error: errorBookingUpdate } = await supabase.from('Booking').update({ is_Accepted : accept}).eq('sender_uid', sender_uid).eq('receiver_uid', uid)
    return { errorBookingUpdate } ;
}

export const checkForApplication = async (sender_id: any, receiver_id: any) => {
    const { data, error } = await supabase.from('Booking').select('id').eq('sender_uid', sender_id).eq('receiver_uid', receiver_id);
    return { data, error }
}

export const postBooking = async (booking: Booking) => {
    const { error } = await supabase
            .from('Booking')
            .insert(booking)

    return error
}

export const deleteBooking = async (uid: any) => {
    const response = await supabase
        .from('Booking')
        .delete()
        .eq('sender_uid', uid)

    return response
}