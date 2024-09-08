# ChatVerse-AI-Assistant Backend

## Overview

The ChatVerse Backend provides server-side logic for handling interactions with chatbots, including text-based and video avatar chatbots. It leverages various APIs for generating chatbot responses and video content.

## Features

- **Fetch Avatars**: Retrieve available avatars from the HeyGen API.
- **Generate Avatar Video**: Create a video response from an avatar based on user input.
- **Check Video Status**: Verify the status of a generated video.
- **Generate Chatbot Content**: Generate text responses using Google Generative AI.

## Tech Stack

- **Express.js**: Web framework for Node.js
- **Axios**: HTTP client for making API requests
- **dotenv**: For managing environment variables
- **cors**: Middleware to enable Cross-Origin Resource Sharing
- **GoogleGenerativeAI**: Library to interact with Google Generative AI
- **HeyGen API**: API for generating avatars and avatar videos

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/chatverse-backend.git
    cd chatverse-backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following content:

    ```env
    HEYGEN_API_KEY=your_heygen_api_key
    GEMINI_API_KEY=your_gemini_api_key
    PORT=5000
    ```

4. Start the development server:

    ```bash
    npm start
    ```

5. The server will be running on [http://localhost:5000](http://localhost:5000).

## API Endpoints

### GET /api/avatars

Fetches available avatars from the HeyGen API.

**Response:**

- Status Code: `200 OK`
- Body: JSON containing the list of avatars

**Error Response:**

- Status Code: `500 Internal Server Error`
- Body: `{ "error": "Failed to fetch Avatars" }`

### POST /api/generate

Generates a video response from an avatar based on the user’s prompt. 

**Request Body:**

```json
{
    "prompt": "Your question or request here"
}
```

**Response:**

- Status Code: `200 OK`
- Body: JSON containing the generated text response and the video ID

**Error Response:**

- Status Code: `500 Internal Server Error`
- Body: `{ "message": "Failed to generate video" }`

### GET /api/video-status/:videoId

Checks the status of a generated avatar video.

**Path Parameters:**

- `videoId`: The ID of the video to check

**Response:**

- Status Code: `200 OK`
- Body: JSON containing the video status

**Error Response:**

- Status Code: `500 Internal Server Error`
- Body: `{ "message": "Failed to check video status" }`

### POST /api/generate-content

Generates a text response based on the user’s prompt using Google Generative AI.

**Request Body:**

```json
{
    "prompt": "Your question or request here"
}
```

**Response:**

- Status Code: `200 OK`
- Body: JSON containing the generated text response

**Error Response:**

- Status Code: `500 Internal Server Error`
- Body: `{ "message": "Failed to generate content" }`

## Deployment
Backend Render deployment link: [Render](https://chat-bot-webapp-backend.onrender.com)

## Folder Structure

```plaintext
/src
├── index.ts          # Main server file
├── Controllers
│   ├── generateAvatarVideo.js    # Handles avatar video generation and status checking
│   ├── generateChat.js           # Handles chatbot content generation
│   └── getAvatar.js              # Handles avatar fetching
└── .env                        # Environment variables
```

## Usage

- **Fetch Avatars**: Access `/api/avatars` to get available avatars.
- **Generate Avatar Video**: Use `/api/generate` with a prompt to get a video response from an avatar.
- **Check Video Status**: Use `/api/video-status/:videoId` to check the status of a video.
- **Generate Chatbot Content**: Use `/api/generate-content` for text responses.

## Running in Production

Once you're ready to deploy, create a production build and set appropriate environment variables.

```bash
npm run build
```

Deploy the server to your preferred hosting service and ensure to configure the environment variables accordingly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
