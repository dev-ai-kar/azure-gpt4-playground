import { getOpenAICompletion, OpenAIRequest } from "../../utils/OpenAI/OpenAI"; // Replace yourModuleName with the name of your module  
  
// const testPayload: OpenAIRequest = {  
//   model: "gpt-4",  
//   temperature: 0.5,  
//   max_tokens: 8192,  
//   top_p: 1,  
//   frequency_penalty: 0,  
//   presence_penalty: 0.6,  
//   messages: [  
//     {  
//       role: "system",  
//       content: "You are a helpful assistant.",  
//     },  
//     {  
//       role: "user",  
//       content: "Who won the world series in 2020?",  
//     },  
//   ],  
// };  
  
// async function test() {  
//   try {  
//     const stream = await getOpenAICompletion("your_token_here", testPayload); // Replace your_token_here with your actual token  
//     const reader = stream.getReader();  
  
//     while (true) {  
//       const { done, value } = await reader.read();  
//       if (done) break;  
//       console.log(new TextDecoder().decode(value));  
//     }  
//   } catch (error) {  
//     console.error("Error:", (error as Error).message);  
//   }  
// }  

import { NextApiRequest, NextApiResponse } from "next";  
const API_KEY = process.env.AZURE_OPENAI_API_KEY;

const testPayload: OpenAIRequest = {  
  model: "gpt-4",  
  stream:true,
  temperature: 0.5,  
  max_tokens: 8192,  
  top_p: 1,  
  frequency_penalty: 0,  
  presence_penalty: 0.6,  
  messages: [  
    {  
      role: "system",  
      content: "You are a helpful assistant.",  
    },  
    {  
      role: "user",  
      content: "Who won the world series in 2020?",  
    },  
  ],  
};  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  try {  

console.log(API_KEY)
    const stream = await getOpenAICompletion("d020880e0119447fbde26d3dcfb09bd7", testPayload); // Replace your_token_here with your actual token  
    const reader = stream.getReader();  
    let result = "";  
  
    while (true) {  
      const { done, value } = await reader.read();  
      if (done) break;  
      result += new TextDecoder().decode(value);  
    }  
  
    res.status(200).json({ data: result });  
  } catch (error) {  
    console.error("Error:", error);  
    res.status(500).json({ error: (error as Error).message });  
  }  
   
}  
