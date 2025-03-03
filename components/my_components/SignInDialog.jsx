import React, { useContext, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import uuid4 from "uuid4";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { UserDetailsContext } from "@/context/UserDetailsContext";

const SignInDialog = ({ openDialog, closeDialog }) => {

  const {userDetail, setUserDetail} = useContext(UserDetailsContext);


  

  const createUser = useMutation(api.users.CreateUser)

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserInfo(tokenResponse?.access_token);
    },
  });

  async function getUserInfo(accessToken) {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userInfo = await response.json();
      console.log(userInfo);

      const user = userInfo;
      setUserDetail(userInfo);
      closeDialog(false);
      console.log("user Details");
      console.log(userDetail)
      console.log(userInfo?.name);
      console.log(userInfo?.email);

      await createUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuid4()
      })


      if(typeof window !== undefined){
        localStorage .setItem("user", JSON.stringify(user))
      }
      closeDialog(false);

      return user;
    } catch (error) {
      console.error("Error retrieving user info:", error);
    }
  }

  console.log(userDetail);

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-xl text-center font-bold">
                  Continue with Blue Print
                </h1>
                <p className="mt-2 text-center">
                  Login into your account or Create one!
                </p>
                <Button
                  onClick={() => {
                    login();
                  }}
                  className="text-white bg-blue-600 mt-2 hover:bg-blue-500"
                >
                  Sign In with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignInDialog;
