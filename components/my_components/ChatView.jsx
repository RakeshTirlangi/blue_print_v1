"use client";

import { MContext } from '@/context/MContext';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { ArrowRight, LoaderCircleIcon } from 'lucide-react';
import axios from 'axios';

const ChatView = () => {
    const convex = useConvex();
    const { id } = useParams();
    const { msg, setMsg } = useContext(MContext);
    const { userDetail } = useContext(UserDetailsContext);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);

    useEffect(() => {
        GetWorkspaceData();
    }, [id]);

    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMsg(result?.messages || []);
    };

    useEffect(() => {
        if (msg?.length > 0 && msg[msg.length - 1].role === "user") {
            GetResponse();
        }
    }, [msg]);

    const GetResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(msg) + `\nYou are an AI assistant with vast experience in React Development.\nGUIDELINES:\n- Tell user what you are building\n- Response less than 15 lines\n- Skip code examples and commentary`;

        const result = await axios.post("/api/ai-chat-response", { prompt: PROMPT });
        const resp = { role: "ai", content: result.data.result };

        setMsg((prev) => [...prev, resp]);

        await UpdateMessages({
            messages: [...msg, resp],
            workspaceId: id
        });
        setLoading(false);
    };

    const onGenerate = () => {
        if (inputText.trim() === "") return;

        const userMessage = { role: "user", content: inputText };
        setMsg((prev) => [...prev, userMessage]);
        setInputText("");
    };

    console.log(msg)

    return (
        <div className='relative h-[75vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide'>
               
                    
                
                {loading && (
                    <div className="p-3 rounded-lg mb-2 flex gap-2 items-center">
                        <LoaderCircleIcon className='animate-spin' />
                        <h3>Generating...</h3>
                    </div>
                )}
                 {Array.isArray(msg) &&  !loading && msg?.map((data,idx) => (
<div  key={idx}
                        className={`p-3 rounded-lg mb-2 flex gap-2 items-center ${data.role === "user"?"bg-blue-200":"bg-green-200"} leading-6 `}
                    >
                        {data?.content}{""}
                    </div>
                ))}
                
            </div>

            <div className="relative w-full">
                <div className="flex items-center bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-4 pr-16 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        rows={4}
                        placeholder="Describe the application or project you want to build..."
                    />
                    {inputText && (
                        <button
                            onClick={onGenerate}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300 group"
                            aria-label="Submit project description"
                        >
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatView;
