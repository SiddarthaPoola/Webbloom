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
exports.default = handleRequest;
const react_1 = require("@remix-run/react");
const isbot_1 = require("isbot");
const server_1 = require("react-dom/server");
const remix_island_1 = require("remix-island");
const root_1 = require("./root");
const theme_1 = require("~/lib/stores/theme");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, _loadContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const readable = yield (0, server_1.renderToReadableStream)(<react_1.RemixServer context={remixContext} url={request.url}/>, {
            signal: request.signal,
            onError(error) {
                console.error(error);
                responseStatusCode = 500;
            },
        });
        const body = new ReadableStream({
            start(controller) {
                const head = (0, remix_island_1.renderHeadToString)({ request, remixContext, Head: root_1.Head });
                controller.enqueue(new Uint8Array(new TextEncoder().encode(`<!DOCTYPE html><html lang="en" data-theme="${theme_1.themeStore.value}"><head>${head}</head><body><div id="root" class="w-full h-full">`)));
                const reader = readable.getReader();
                function read() {
                    reader
                        .read()
                        .then(({ done, value }) => {
                        if (done) {
                            controller.enqueue(new Uint8Array(new TextEncoder().encode(`</div></body></html>`)));
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        read();
                    })
                        .catch((error) => {
                        controller.error(error);
                        readable.cancel();
                    });
                }
                read();
            },
            cancel() {
                readable.cancel();
            },
        });
        if ((0, isbot_1.isbot)(request.headers.get('user-agent') || '')) {
            yield readable.allReady;
        }
        responseHeaders.set('Content-Type', 'text/html');
        responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
        responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
        return new Response(body, {
            headers: responseHeaders,
            status: responseStatusCode,
        });
    });
}
