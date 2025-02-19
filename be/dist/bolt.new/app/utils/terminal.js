"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coloredText = exports.escapeCodes = void 0;
const reset = '\x1b[0m';
exports.escapeCodes = {
    reset,
    clear: '\x1b[g',
    red: '\x1b[1;31m',
};
exports.coloredText = {
    red: (text) => `${exports.escapeCodes.red}${text}${reset}`,
};
