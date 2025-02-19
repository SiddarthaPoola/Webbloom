"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantMessage = void 0;
const react_1 = require("react");
const Markdown_1 = require("./Markdown");
exports.AssistantMessage = (0, react_1.memo)(({ content }) => {
    return (<div className="overflow-hidden w-full">
      <Markdown_1.Markdown html>{content}</Markdown_1.Markdown>
    </div>);
});
