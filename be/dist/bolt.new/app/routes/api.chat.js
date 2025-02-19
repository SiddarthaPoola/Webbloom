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
exports.action = action;
const constants_1 = require("~/lib/.server/llm/constants");
const prompts_1 = require("~/lib/.server/llm/prompts");
const stream_text_1 = require("~/lib/.server/llm/stream-text");
const switchable_stream_1 = __importDefault(require("~/lib/.server/llm/switchable-stream"));
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return chatAction(args);
    });
}
function chatAction(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context, request }) {
        const { messages } = yield request.json();
        const stream = new switchable_stream_1.default();
        try {
            const options = {
                toolChoice: 'none',
                onFinish: (_a) => __awaiter(this, [_a], void 0, function* ({ text: content, finishReason }) {
                    if (finishReason !== 'length') {
                        return stream.close();
                    }
                    if (stream.switches >= constants_1.MAX_RESPONSE_SEGMENTS) {
                        throw Error('Cannot continue message: Maximum segments reached');
                    }
                    const switchesLeft = constants_1.MAX_RESPONSE_SEGMENTS - stream.switches;
                    console.log(`Reached max token limit (${constants_1.MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);
                    messages.push({ role: 'assistant', content });
                    messages.push({ role: 'user', content: prompts_1.CONTINUE_PROMPT });
                    const result = yield (0, stream_text_1.streamText)(messages, context.cloudflare.env, options);
                    return stream.switchSource(result.toAIStream());
                }),
            };
            const result = yield (0, stream_text_1.streamText)(messages, context.cloudflare.env, options);
            stream.switchSource(result.toAIStream());
            return new Response(stream.readable, {
                status: 200,
                headers: {
                    contentType: 'text/plain; charset=utf-8',
                },
            });
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
