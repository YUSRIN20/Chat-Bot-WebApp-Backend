import axios from "axios";
import dotenv from "dotenv";
dotenv.config()


const heygenApiKey = process.env.HEYGEN_API_KEY;

export const getAvatar =  async (req, res) => {
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
};
