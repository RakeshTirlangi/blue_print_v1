import { chatSession } from "@/configs/Model";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt} = await req.json();

    try{
        const result = await chatSession.sendMessage(prompt)
        const response = result.response.text();

        return NextResponse.json({result:response})
    }catch(e){
        return NextResponse.json({error:e})
    }
}