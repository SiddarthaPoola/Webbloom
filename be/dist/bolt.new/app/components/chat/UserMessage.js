"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessage = UserMessage;
const diff_1 = require("~/utils/diff");
const Markdown_1 = require("./Markdown");
function UserMessage({ content }) {
    return (<div className="overflow-hidden pt-[4px]">
      <Markdown_1.Markdown limitedMarkdown>{sanitizeUserMessage(content)}</Markdown_1.Markdown>
    </div>);
}
function sanitizeUserMessage(content) {
    return content.replace(diff_1.modificationsRegex, '').trim();
}
