
"use client";

import { createContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {


  
  
  const [user, setUser] = useState(null)
  const navigate = useRouter("")

  const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      setUser(user)
      
      
    
      
    }

  useEffect(() => {
    
    
    getUser();
    
  }, [user])
  

  




  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}