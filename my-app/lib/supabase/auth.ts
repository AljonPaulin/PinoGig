import { supabase } from "../supabase"

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    return {data, error};
}

export async function signUpUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
    return { data, error } ;
}

export async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  return { data, error};
}
export async function getUID() {
  const { data : { user } } = await supabase.auth.getUser()
  const UID = user?.id
  return { UID };
}