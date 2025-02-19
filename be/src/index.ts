import dotenv from 'dotenv';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import { ContentBlock, TextBlock } from '@anthropic-ai/sdk/resources';
import { basePrompt as nodeBasePrompt } from './defaults/node';
import { basePrompt as reactBasePrompt } from './defaults/react';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Check if the necessary API key is available in the environment
if (!process.env.ANTHROPIC_API_KEY) {
    console.error("API key is missing. Please set it in the .env file.");
    process.exit(1); // Exit if the key is missing
}

// Initialize Anthropic API client and Express app
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// /template endpoint
app.post('/template', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        // Call the Anthropic API to determine whether to use node or react
        const response = await anthropic.messages.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 200,
            system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        });

        // Extract answer from response
        const answer = (response.content[0] as TextBlock).text; // react or node

        // Respond with corresponding prompts based on answer
        if (answer === 'react') {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            });
        } else if (answer === 'node') {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            });
        } else {
            // Handle unexpected responses
            res.status(403).json({ message: "You can't access this" });
        }
    } catch (error) {
        // Handle any errors that occur while making the API request
        console.error("Error during API request:", error);
        res.status(500).json({ message: "Internal server error or invalid API key." });
    }
});

// /chat endpoint
app.post('/chat', async (req, res) => {
    const messages = req.body.messages;

    try {
        // Call the Anthropic API for chat messages
        const response = await anthropic.messages.create({
            messages: messages,
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 8000,
            system: getSystemPrompt()
        });

        // Log and send the response back
        console.log(response);
        res.json({
            response: (response.content[0] as TextBlock)?.text
        });
    } catch (error) {
        // Handle any errors that occur while making the API request
        console.error("Error during API request:", error);
        res.status(500).json({ message: "Internal server error or invalid API key." });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
