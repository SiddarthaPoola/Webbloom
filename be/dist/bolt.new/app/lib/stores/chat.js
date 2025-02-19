"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatStore = void 0;
const nanostores_1 = require("nanostores");
exports.chatStore = (0, nanostores_1.map)({
    started: false,
    aborted: false,
    showChat: true,
});
