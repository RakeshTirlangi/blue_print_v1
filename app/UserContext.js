"use client"

import {createContext, useState} from "react";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({ email: "", name: ""});

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};