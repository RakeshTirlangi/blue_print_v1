"use client";

import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import axios from 'axios';
import { MContext } from '@/context/MContext';

const CodeView = () => {

  const [loading, setLoading] = useState(false);

  const defaultFiles = {
      "/App.js": {
        code: `export default function App() {
          return <div>Hello World</div>
        }`,
        active: true
      },
      "index.js": {
        code: `import React from "react";
    import { createRoot } from "react-dom/client";
    import App from "./App";

    const root = createRoot(document.getElementById("root"));
    root.render(<App />);`,
        active: true
      }
    };

    const [files, setFiles] = useState(defaultFiles);

  
  //const [files, setFiles] = useState()
  const {msg, setMsg} = useContext(MContext);
  const [active, setActive] = useState("code");

//   const p = `
    
//   Note: Only Generate .js files don't generate the .jsx files and also don't create a src folder, just create in 
//         root directory
//     Generate a programming code structure for a React project using Vite.

//     Return the response in JSON format with the following schema:

//     json
//     {
//       "projectTitle": "",
//       "explanation": "",
//       "files": {
//         "/App.js": {
//           "code": ""
//         },
//         ...      
//       },
//       "generatedFiles": []
//     }
    


//     Ensure the files field contains all created files, and the generatedFiles in this structure
//     and also create the custom folders if needs for example like components folder

//     files: {
//       "/App.js": {
//         "code": "import React from "react";\nimport "./styles.css";
//       }
//     }

//     Additionally, include an explanation of the projects structure,
//     - Add emoji icons whenever needed to give good user experience 
//     - The lucid-react library is also available to be imported IF Needed

    
//   Note: 
//   1. Only Generate .js files don't generate the .jsx files and also don't create a src folder, just create in 
//         root directory
//   2. Using tailwind css is mandatory.

//   Important points:
//   Don't make these type of errors:
//   TypeError
// Cannot assign to read only property 'message' of object 'SyntaxError: /App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (14:6)
  
//   `

const p = `
🚀 **React Project Structure with Vite (Root Directory Only)**

**Instructions for LLM:**  
- 📂 **Always create all files in the root directory. Never create a \`src\` folder.**  
- 📜 **Use only \`.js\` files (no \`.jsx\` files).**  
- 🎨 **Use Tailwind CSS (mandatory).**  
- 💎 You can use the \`lucid-react\` library if needed.  
- 📝 Return the response in **JSON format** with this schema:

\`\`\`json
{
  "projectTitle": "Vite React Tailwind App",
  "explanation": "Detailed explanation of the project structure with emoji highlights.",
  "files": {
    "/App.js": {
      "code": "import React from 'react';\\nimport './styles.css';"
    },
    "/components/Button.js": {
      "code": "export default function Button() { return <button>Click Me</button>; }"
    }
  },
  "generatedFiles": ["/App.js", "/components/Button.js"]
}
\`\`\`

💡 **Key Points:**  
1. 📂 **Only Root Directory:** All files must be directly under the root or custom folders (\`/components\`, \`/utils\`, etc.) without any \`src\` folder.  
2. 📝 **.js Files Only:** No \`.jsx\` extensions.  
3. 💅 **Tailwind CSS:** Must be used for styling.  
4. 🚫 **Avoid Errors:** Ensure proper JSX syntax. If multiple elements are returned, wrap them in a fragment (\`<>...</>\`).  
5. 💎 **Use lucid-react if needed.**  

🎉 Return with clear explanations and emoji highlights for better understanding.
`;


  useEffect(() => {
         if(msg?.length > 0){
             const role = msg[msg?.length-1].role
             if(role == "user"){
                GenerateCode();
             }
             
         }
     }, [msg])
 
  const GenerateCode = async() => {
    const PROMPT = msg[msg?.length-1]?.content +" "+p
    const result = await axios.post("/api/gen-code", {
      prompt: PROMPT
    });

    console.log(result.data);
    const resp = result.data;

    const combinedFiles = {...resp?.files};
    setFiles(combinedFiles);
  }

 
  return (
    <div>
      <div className='bg-[#181818] w-full p-2 border text-white'>
        <div className='flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px]
        rounded-full text-white gap-3 justify-center'>
          <h2 
          onClick={() => setActive("code")}
          className={`text-sm cursor-pointer 
            ${active == "code" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}>Code</h2>
          <h2 
            onClick={() => setActive("preview")}
          className={`text-sm cursor-pointer 
            ${active == "preview" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}>Preview</h2>
          
        </div>
      </div>
      <SandpackProvider template="react" theme={"dark"} 
      files={files}
      customSetup={{
        dependencies:{
            "uuid4": "^2.0.3" 
        },
      }}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"]
      }}
      >
    <SandpackLayout>
     { active== "code"? <>
          <SandpackFileExplorer style={{height:"75vh"}}/>
          <SandpackCodeEditor style={{height:"75vh"}}/>
      </>:
     <> 
        <SandpackPreview style={{height:"75vh"}} showNavigator={true}/>
     </>
    } 
      
    </SandpackLayout>
    </SandpackProvider>
    </div>
  )
}

export default CodeView