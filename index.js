import express, { text } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const heygenApiKey = process.env.HEYGEN_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY
const port = process.env.PORT || 5000;

// const client = new OpenAI({
//     apiKey: openAIApiKey, // This is the default and can be omitted
// });


const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Getting Avatar
app.get("/api/avatars", async (req, res) => {
    try {
        const options = {
            method: "GET",
            url: "https://api.heygen.com/v2/avatars",
            headers: {
                accept: "application/json",
                "x-api-key": heygenApiKey,
            },
        };

        const response = await axios.request(options);
        res.status(200).json(response.data); // Return data from Heygen API
    } catch (error) {
        console.error("Error fetching avatars:", error.message); // Log error details
        res.status(500).json({ error: "Failed to fetch Avatars" });
    }
});



// app.post('/api/generate-video', async (req, res) => {
//     const { text } = req.body;

//     try {
//         const response = await axios.post(
//             'https://api.heygen.com/v2/video/generate',
//             {
//                 video_inputs: [
//                     {
//                         character: {
//                             type: 'avatar',
//                             avatar_id: 'Daisy-inskirt-20220818',
//                             avatar_style: 'normal'
//                         },
//                         voice: {
//                             type: 'text',
//                             input_text: text,
//                             voice_id: '1bd001e7e50f421d891986aad5158bc8',
//                             speed: 1.1
//                         }
//                     }
//                 ],
//                 dimension: {
//                     width: 1280,
//                     height: 720
//                   },
//                   aspect_ratio: null,
//                   test: true
//             },
//             {
//                 headers: {
//                     'x-api-key': heygenApiKey,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error('Error generating avatar video:', error.message);
//         res.status(500).send(error);
//     }
// });



// another method for generateVideo


// call function for avatar video generate
const generateAvatarVideo  = async (text)=>{

    try {
        const response = await axios.post(
            'https://api.heygen.com/v2/video/generate',
            {
                video_inputs: [
                    {
                        character: {
                            type: 'avatar',
                            avatar_id: 'Daisy-inskirt-20220818',
                            avatar_style: 'normal'
                        },
                        voice: {
                            type: 'text',
                            input_text: text,
                            voice_id: '1bd001e7e50f421d891986aad5158bc8',
                            speed: 1.1
                        }
                    }
                ],
                dimension: {
                    width: 1280,
                    height: 720
                  },
                  aspect_ratio: null,
                  test: true
            },
            {
                headers: {
                    'x-api-key': heygenApiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data);
        return response.data
        // res.status(200).json(response.data);
        
    } catch (error) {
        console.error('Error generating avatar video:', error.message);
        // res.status(500).send(error);
        throw(error)
    }
};


app.get('/api/video-status/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        const response = await axios.get(
            `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
            {
                headers: {
                    'X-Api-Key': heygenApiKey,
                    'Accept': 'application/json'
                }
            }
        );

        res.status(200).json(response.data);
        // console.log(response.data);
        
    } catch (error) {
        console.error('Error checking video status:', error);
        res.status(500).json({ message: 'Failed to check video status' });
    }
});

// Route to fetch response from OpenAI
// app.post('/api/chat',async(req,res)=>{
//     const userMessage = req.body.message

//     try {
//         const response = await axios.post('https://api.openai.com/v1/completions',{
//             model:'text-davinci-003',
//             prompt:userMessage,
//             max_tokens:150,
//             temperature:0.7,
//         },{
//             headers:{
//                 'Content-Type':'application/json',
//                 Authorization:openAIApiKey
//             },
//         });
//         res.status(200).json(response.data.choices[0].text.trim())
//     } catch (error) {
//         console.error('Error fetching avatars:', error.response ? error.response.data : error.message);
//         res.status(500).json({ message: "Failed to response from OpenAI:" });
//     }
// })



// app.post("/api/generate", async (req, res) => {
//     const { prompt } = req.body;
//     const allowedTopics = ['technology','daily news', 'personal finance','fun facts']
    
//     // Check if the question fits within the allowed topics
//     const isAllowed = allowedTopics.some(topic => prompt.toLowerCase().includes(topic))

//     if(!isAllowed){
//         return res.status(400).json({message:`please ask questions related to: ${allowedTopics.join(', ')}`})
//     }

//     // Modify prompt to ask for a concise response
//     const modifiedPrompt = `You are a chatbot that responds to questions about Technology, Daily News, Personal Finance, or Fun Facts. 
//     Please give the important points only in a concise manner. Respond to this question: ${prompt}`;
   
   
//     try {
//         const result = await model.generateContent(modifiedPrompt);
//         res.status(200).json({ response: result.response.text() })
//         // console.log(result.response.text());



//     } catch (error) {
//         console.error("Error with Google Generative AI:", error.message);
//         res.status(500).json({ message: "Failed to generate content" });
//     }
// });


const allowedTopics = ['technology', 'daily news', 'personal finance', 'fun facts'];
const conversationalTopics = ['hi','hey','hello', 'how are you', 'what are you doing', 'tell me a joke','ok thank you','thank you','lets gets start','shall we start','ok gemini','ok bye','ok enough','see you later','i need your help','one help'];
const personalTopics = ['who invented you','what your age','what abdul']
app.post("/api/generate", async (req, res) => {
    const { prompt } = req.body;
    
    // Check if the question fits within the allowed or conversational topics
    const isAllowed = allowedTopics.some(topic => prompt.toLowerCase().includes(topic));
    const isConversational = conversationalTopics.some(topic => prompt.toLowerCase().includes(topic));
    const isPersonl = personalTopics.some(topic => prompt.toLowerCase().includes(topic));

    
    if (!isAllowed && !isConversational && !isPersonl) {
        return res.status(400).json({ message: `Please ask questions related to: ${allowedTopics.join(', ')}.` });
    }

    // Modify prompt based on topic type
    let modifiedPrompt; 
    if (isAllowed) {
        modifiedPrompt = `
        You are a chatbot designed to assist users with various topics, including Technology, Daily News, Personal Finance, and Fun Facts. Your goal is to provide responses that are helpful and engaging, while keeping the conversation natural and human-like.
    
        When responding to questions, consider the following:
        - Understand the context of the question and provide an answer that is relevant and accurate.
        - Use a conversational tone, structure your response as if you are having a friendly chat with the user.
        - Feel free to acknowledge the user's input with casual fillers, like "carry on", "yes, interesting", or "go on" when it fits the flow of conversation naturally. This will make the interaction feel more fluid.
        
        Here's an example interaction:
        - User: "${prompt}"
        - Chatbot: "Yes, that's a great point. Let's dive into it... (then provide the main response)."
    
        Keep in mind that if the user's question relates to Technology, Daily News, Personal Finance, or Fun Facts, provide relevant information while maintaining an engaging and friendly tone.
    
        Here is the user's question: "${prompt}"
    
        Please provide a response that is engaging, informative, and includes casual conversational fillers to maintain a natural interaction.`;
    
    } else if (isConversational) {
        modifiedPrompt = `You are a friendly chatbot. Respond conversationally to this input: ${prompt}`;
    } else if(personalTopics){
        modifiedPrompt = `Tell the answer I was invented by Yusrin ${prompt}`
    }

    try {
        const result = await model.generateContent(modifiedPrompt);
        const responseText = result.response.text();

           // Generate avatar video
           const videoResponse = await generateAvatarVideo(responseText);
           const videoId = videoResponse.data.video_id; // Assuming `video_id` is returned in the response
           console.log(videoResponse.data.video_id);
           
           res.status(200).json({
               response: responseText,
               videoId: videoId 
           });
    } catch (error) {
        console.error("Error with Google Generative AI:", error.message);
        res.status(500).send(error);
    }
});


// for generate content chatbot only
app.post("/api/generate-content", async (req, res) => {
    const { prompt } = req.body;
    
    // Check if the question fits within the allowed or conversational topics
    const isAllowed = allowedTopics.some(topic => prompt.toLowerCase().includes(topic));
    const isConversational = conversationalTopics.some(topic => prompt.toLowerCase().includes(topic));
    const isPersonl = personalTopics.some(topic => prompt.toLowerCase().includes(topic));

    
    if (!isAllowed && !isConversational && !isPersonl) {
        return res.status(400).json({ message: `Please ask questions related to: ${allowedTopics.join(', ')}.` });
    }

    // Modify prompt based on topic type
    let modifiedPrompt; 
    if (isAllowed) {
        modifiedPrompt = `
        You are a chatbot designed to assist users with various topics, including Technology, Daily News, Personal Finance, and Fun Facts. Your goal is to provide responses that are helpful and engaging, while keeping the conversation natural and human-like.
    
        When responding to questions, consider the following:
        - Understand the context of the question and provide an answer that is relevant and accurate.
        - Use a conversational tone, structure your response as if you are having a friendly chat with the user.
        - Feel free to acknowledge the user's input with casual fillers, like "carry on", "yes, interesting", or "go on" when it fits the flow of conversation naturally. This will make the interaction feel more fluid.
        
        Here's an example interaction:
        - User: "${prompt}"
        - Chatbot: "Yes, that's a great point. Let's dive into it... (then provide the main response)."
    
        Keep in mind that if the user's question relates to Technology, Daily News, Personal Finance, or Fun Facts, provide relevant information while maintaining an engaging and friendly tone.
    
        Here is the user's question: "${prompt}"
    
        Please provide a response that is engaging, informative, and includes casual conversational fillers to maintain a natural interaction.`;
    
    } else if (isConversational) {
        modifiedPrompt = `You are a friendly chatbot. Respond conversationally to this input: ${prompt}`;
    } else if(personalTopics){
        modifiedPrompt = `Tell the answer I was invented by Yusrin ${prompt}`
    }

    try {
        const result = await model.generateContent(modifiedPrompt);
        const responseText = result.response.text();

        //    // Generate avatar video
        //    const videoResponse = await generateAvatarVideo(responseText);
        //    const videoId = videoResponse.data.video_id; // Assuming `video_id` is returned in the response
        //    console.log(videoResponse.data.video_id);
           
           res.status(200).json({
               response: responseText,
            //    videoId: videoId 
           });
    } catch (error) {
        console.error("Error with Google Generative AI:", error.message);
        res.status(500).send(error);
    }
});
// const client = new OpenAI({
//   apiKey: openAIApiKey, // This is the default and can be omitted
// });

// const callApi = async()=> {
//     try {
//         const response = await client.chat.completions.create({
//           model: "gpt-3.5-turbo",
//           prompt: "say this is a test",
//           max_tokens: 150,
//           temperature: 0.7,
//         });
//         console.log(response.data.choices[0].text);
//     } catch (error) {
//         console.error("Error with OpenAI:", error.response ? error.response.data : error.message);
//     }
// }

// callApi()



app.listen(port, () => {
    console.log(`App Running on port ${port}`);
});
