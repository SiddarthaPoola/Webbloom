"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const cors_1 = __importDefault(require("cors"));
// Load environment variables from .env file
dotenv_1.default.config();
// Check if the necessary API key is available in the environment
if (!process.env.ANTHROPIC_API_KEY) {
    console.error("API key is missing. Please set it in the .env file.");
    process.exit(1); // Exit if the key is missing
}
// Initialize Anthropic API client and Express app
const anthropic = new sdk_1.default({ apiKey: process.env.ANTHROPIC_API_KEY });
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// /template endpoint
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    try {
        // Call the Anthropic API to determine whether to use node or react
        const response = yield anthropic.messages.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 200,
            system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        });
        // Extract answer from response
        const answer = response.content[0].text; // react or node
        // Respond with corresponding prompts based on answer
        if (answer === 'react') {
            res.json({
                prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [react_1.basePrompt]
            });
        }
        else if (answer === 'node') {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [node_1.basePrompt]
            });
        }
        else {
            // Handle unexpected responses
            res.status(403).json({ message: "You can't access this" });
        }
    }
    catch (error) {
        // Handle any errors that occur while making the API request
        console.error("Error during API request:", error);
        res.status(500).json({ message: "Internal server error or invalid API key." });
    }
}));
// /chat endpoint
app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const messages = req.body.messages;
    try {
        // Call the Anthropic API for chat messages
        const response = yield anthropic.messages.create({
            messages: messages,
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 8000,
            system: (0, prompts_1.getSystemPrompt)()
        });
        // Log and send the response back
        console.log(response);
        res.json({
            response: (_a = response.content[0]) === null || _a === void 0 ? void 0 : _a.text
        });
    }
    catch (error) {
        // Handle any errors that occur while making the API request
        console.error("Error during API request:", error);
        res.status(500).json({ message: "Internal server error or invalid API key." });
    }
}));
// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
