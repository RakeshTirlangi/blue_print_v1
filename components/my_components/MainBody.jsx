"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useContext } from "react";

import { useRouter } from "next/navigation";
import { MContext } from "@/context/MContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";


const suggestions = [
  "To-Do App",
  "Weather App",
  "Portfolio Website",
  "Note-Taking App",
  "Quiz App",
];



const MainBody = () => {

  
  const [inputText, setInputText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const {msg, setMsg} = useContext(MContext);
  const {userDetail, setUserDetail} = useContext(UserDetailsContext);
  const router = useRouter();
  const CreateWorkspace = useMutation(api.workspace.createWorkspace)

  
  const [messages, setMessages] = useState({
      role: "user",
      content: inputText
  });


  const onGenerate = async (input) => {
    if(!userDetail?.name){
      setOpenDialog(true);
      return;
    }
    setMsg({
      role: "user",
      content: input
    });

    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages: [{
        role: "user",
        content: input
      }]
    });

    console.log(workspaceId);
    router.push("/workspace/"+workspaceId)
  }
  

   

  const handleSubmit = async() => {
    console.log("Submitted:", inputText);
    setOpenDialog(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);  
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="text-blue-500" size={32} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Blue Print
          </h1>
        </div>

        <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto">
          Your partner in bringing full-stack ideas to life
        </p>

        <div className="relative w-full">
          <div className="flex items-center bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 pr-16 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              rows={4}
              placeholder="Describe the application or project you want to build..."
            />
            {inputText && <button
              onClick={() => onGenerate(inputText)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300 group"
              aria-label="Submit project description"
            >
               <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={24}
              />
            </button> }
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      <div>
        <SignInDialog
          openDialog={openDialog}
          closeDialog={(e) => setOpenDialog(false)}
        />
      </div>
    </div>
  );
};

export default MainBody;
