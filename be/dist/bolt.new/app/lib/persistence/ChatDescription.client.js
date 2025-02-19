"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDescription = ChatDescription;
const react_1 = require("@nanostores/react");
const useChatHistory_1 = require("./useChatHistory");
function ChatDescription() {
    return (0, react_1.useStore)(useChatHistory_1.description);
}
