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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
const ai_1 = require("ai");
const stream_text_1 = require("~/lib/.server/llm/stream-text");
const stripIndent_1 = require("~/utils/stripIndent");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return enhancerAction(args);
    });
}
function enhancerAction(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context, request }) {
        const { message } = yield request.json();
        try {
            const result = yield (0, stream_text_1.streamText)([
                {
                    role: 'user',
                    content: (0, stripIndent_1.stripIndents) `
          I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

          IMPORTANT: Only respond with the improved prompt and nothing else!

          <original_prompt>
            ${message}
          </original_prompt>
        `,
                },
            ], context.cloudflare.env);
            const transformStream = new TransformStream({
                transform(chunk, controller) {
                    const processedChunk = decoder
                        .decode(chunk)
                        .split('\n')
                        .filter((line) => line !== '')
                        .map(ai_1.parseStreamPart)
                        .map((part) => part.value)
                        .join('');
                    controller.enqueue(encoder.encode(processedChunk));
                },
            });
            const transformedStream = result.toAIStream().pipeThrough(transformStream);
            return new ai_1.StreamingTextResponse(transformedStream);
        }
        catch (error) {
            console.log(error);
            throw new Response(null, {
                status: 500,
                statusText: 'Internal Server Error',
            });
        }
    });
}
