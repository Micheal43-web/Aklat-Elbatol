

"use client"


import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import SigninWithGoogle from "./SignInWithGoogle";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import Logo from "./../../../public/Logo.jpeg"






function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const { user } = useContext(UserContext)

  const logout = async () => {
    const { data } = await supabase.auth.signOut()
    window.location.reload()
  }



  return (
    <nav className="z-10  py-4  flex items-center justify-between relative">

      <div className="flex items-center gap-7">
        <Image 
          src={Logo}
          height={0}
          width={0}
          alt=""
          draggable="false"
          className="h-20 w-20 rounded-full"
        />
        <span className="text-xl md:text-3xl text-secondry font-bold">اكلات البتول</span>
      </div>

      <div className="hidden  md:flex items-center rounded-full px-5 py-1 gap-3">


        {
          user?.email == "michealwaled16@gmail.com" && (
            <>
              <Link href="/" className="px-4 py-1.5 rounded-full transition-colors font-semibold  ">
                الرئيسي
              </Link>
              <Link href="/dashboard/add-product" className="px-4 py-1.5 rounded-full transition-colors font-semibold  ">
                لوحة التحكم
              </Link>
            </>
          )
        }







      </div>

      {
        !user ? <SigninWithGoogle mini={false}/> : (
          <button onClick={logout} className="hidden md:flex rounded-full p-3 bg-[#440000c4] text-red-500 ml-7 cursor-pointer hover:-translate-y-0.5 transition-all">
            <LogOut size={22} />
          </button>
        )
      }



      <div className="btnsMob  flex items-center gap-4 md:hidden">

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
          <span className={`block w-6 h-0.5 bg-secondry transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-secondry transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-secondry transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute backdrop-blur-lg  md:backdrop-blur-none top-full left-0 w-full  border-t border-secondry flex flex-col  p-5 gap-1 md:hidden z-50">
          {
            user?.email == "michealwaled16@gmail.com" && (
              <>
                <Link href="/" className="px-4 py-1.5 rounded-full transition-colors font-semibold  ">
                  الرئيسي
                </Link>
                <Link href="/dashboard/add-product" className="px-4 py-1.5 rounded-full transition-colors font-semibold  ">
                  لوحة التحكم
                </Link>
              </>
            )
          }


          
          {
            !user ? (<SigninWithGoogle mini={true}/>) : (
              <button onClick={logout} className="mt-5 flex items-center gap-4 rounded-full p-3 bg-[#440000c4] text-red-500 ml-7 cursor-pointer hover:-translate-y-0.5 transition-all">
                <LogOut size={22} />
                <span>تسجيل خروج</span>
              </button>
            )
          }
        </div>



      )}
    </nav>
  );






}

export default Header;