"use client";

import { MContext } from '@/context/MContext';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import React, { useState, useEffect } from 'react'
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

const Provider = ({children}) => {
    const [msg, setMsg] = useState([]);
    const [userDetail, setUserDetail] = useState(null);  // Initialize as null
    const convex = useConvex();

    useEffect(() => {
        isAuthenticated();
    }, []);

    const isAuthenticated = async() => {
        try {
            if (typeof window !== "undefined") {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user?.email) {
                    const result = await convex.query(api.users.GetUser, {
                        email: user.email
                    });
                    setUserDetail(result);
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
            setUserDetail(null);
        }
    }

    return (
        <UserDetailsContext.Provider value={{userDetail, setUserDetail}}>
            <MContext.Provider value={{msg, setMsg}}>
                {children}
            </MContext.Provider>
        </UserDetailsContext.Provider>
    );
}

export default Provider;