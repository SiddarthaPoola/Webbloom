"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unreachable = unreachable;
function unreachable(message) {
    throw new Error(`Unreachable: ${message}`);
}
