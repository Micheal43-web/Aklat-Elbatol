"use client"
import { supabase } from "./../lib/supabase"


export default function SigninWithGoogle({mini}) {



  const signInWithGoogle = async () => {

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.log(error)
    }

  }

  return (
    <button onClick={signInWithGoogle} className={` ${mini ? "flex md:hidden" : "hidden md:flex"}  bg-secondry text-primary font-semibold px-8 py-4 rounded-2xl cursor-pointer hover:rounded-3xl transition-all duration-350`}>تسجيل دخول عبر Google</button>
  )
}