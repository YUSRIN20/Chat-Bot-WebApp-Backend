import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const allowedTopics = ['technology', 'daily news', 'personal finance', 'fun facts'];
const conversationalTopics = ['hi','hey','hello', 'how are you', 'what are you doing', 'tell me a joke','ok thank you','thank you','lets gets start','','ok gemini','ok bye','ok enough','see you later','one help','ok bye see you tommorrow','see you tommorrow'];
const personalTopics = ['who invented you','what your age','what abdul']
export const generateChatContent =  async (req, res) => {
    const { prompt } = req.body;
    
    // Check if the question fits within the allowed or conversational topics
    const isAllowed = allowedTopics.some(topic => prompt.toLowerCase().includes(topic));
    const isConversational = conversationalTopics.some(topic => prompt.toLowerCase().includes(topic));

    
    if (!isAllowed && !isConversational) {
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
    } 

    try {
        const result = await model.generateContent(modifiedPrompt);
        const responseText = result.response.text();
           
           res.status(200).json({
               response: responseText,
            //    videoId: videoId 
           });
    } catch (error) {
        console.error("Error with Google Generative AI:", error.message);
        res.status(500).send(error);
    }
};