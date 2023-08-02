import axios from 'axios';  
import type { NextApiRequest, NextApiResponse } from 'next';  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  const apiKey = process.env.AZURE_OPENAI_API_KEY;  
  const resourceEndpoint = process.env.AZURE_OPENAI_ENDPOINT;  
  const apiVersion = process.env.API_VERSION || '2022-12-01';  
  
  // Check for the presence of an API key  
  if (!apiKey || !resourceEndpoint) {  
    return res.status(401).json({ error: 'Missing API key or resource endpoint' });  
  }  
  
  // Send a request to Azure OpenAI API to list available deployments  
  const url = `${resourceEndpoint}/openai/deployments?api-version=${apiVersion}`;  
  
  try {  
    const response = await axios.get(url, {  
      headers: {  
        'api-key': apiKey,  
      },  
    });  
  
    // Return the response data  
    return res.status(200).json(response.data);  
  } catch (error: any) {  
    // Return an appropriate error message and status code  
    if (error.response) {  
      return res.status(error.response.status).json({ error: error.response.data });  
    }  
  
    return res.status(500).json({ error: error.message });  
  }  
}  

// import { OpenAIChatModels } from "@/utils/OpenAI";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { OpenAIApi, Configuration } from "openai";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const apiKey = process.env.AZURE_OPENAI_API_KEY;
//   //  (req.headers["authorization"] as string)?.split(" ")[1];
//   // if (!apiKey) {
//   //   return res.status(401).json({ error: "Missing token" });
//   // }

// // const API_KEY = process.env.AZURE_OPENAI_API_KEY;
//   const basePath = process.env.AZURE_OPENAI_ENDPOINT;
//   const API_VERSION = process.env.API_VERSION;


//   const configuration = new Configuration({
//     apiKey,
//     basePath,
//   });

//   const openAi = new OpenAIApi(configuration);

//   try {
//     const {
//       data: { data },
//     } = await openAi.listModels();

//     // Get the list of models
//     const models = data.map(({ id }) => id);

//     // Get the models that can interface with the chat API and return
//     const chatModels = models
//       .filter((model) => model in OpenAIChatModels)
//       .map((model) => OpenAIChatModels[model as keyof typeof OpenAIChatModels])
//       .sort((a, b) => (b.maxLimit || 0) - (a.maxLimit || 0)); // Sort by max limit

//     return res.status(200).json({
//       models,
//       chatModels,
//     });
//   } catch (e: any) {
//     if (e.response) {
//       return res.status(e.response.status).json({ error: e.response.data });
//     }

//     return res.status(500).json({ error: e.message });
//   }
// }
