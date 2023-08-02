import { OpenAIChatMessage, OpenAIConfig } from "./OpenAI.types";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export const defaultConfig = {
  model: "gpt-4",
  temperature: 0.5,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
};

export type OpenAIRequest = {
  messages: OpenAIChatMessage[];
} & OpenAIConfig;

const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const RESOURCE_NAME = process.env.AZURE_OPENAI_ENDPOINT;
const API_VERSION = process.env.API_VERSION;


export const getOpenAICompletion = async (
  token: string,
  payload: OpenAIRequest
) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const MODEL_NAME = payload.model; // Extract the model name from the payload

  const headers = {  
    "api-key": API_KEY || "",
    "Content-Type": "application/json",
  };  

  // console.log(
  //   `${RESOURCE_NAME}openai/deployments/${MODEL_NAME}/chat/completions?api-version=${API_VERSION}`
  // )
  // console.log(payload)
  // console.log(headers)
  
  const response = await fetch(
    `${RESOURCE_NAME}openai/deployments/${MODEL_NAME}/chat/completions?api-version=${API_VERSION}`,
    {
      method: 'POST',  
      headers: headers, 
      body: JSON.stringify(payload),
    });
    
    // console.log(response)

  // Check for errors
  if (!response.ok) {
    throw new Error(await response.text());
  }

  let counter = 0;
  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
