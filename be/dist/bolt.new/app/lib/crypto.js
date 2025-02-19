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
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const IV_LENGTH = 16;
function encrypt(key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        const cryptoKey = yield getKey(key);
        const ciphertext = yield crypto.subtle.encrypt({
            name: 'AES-CBC',
            iv,
        }, cryptoKey, encoder.encode(data));
        const bundle = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
        bundle.set(new Uint8Array(ciphertext));
        bundle.set(iv, ciphertext.byteLength);
        return decodeBase64(bundle);
    });
}
function decrypt(key, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const bundle = encodeBase64(payload);
        const iv = new Uint8Array(bundle.buffer, bundle.byteLength - IV_LENGTH);
        const ciphertext = new Uint8Array(bundle.buffer, 0, bundle.byteLength - IV_LENGTH);
        const cryptoKey = yield getKey(key);
        const plaintext = yield crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv,
        }, cryptoKey, ciphertext);
        return decoder.decode(plaintext);
    });
}
function getKey(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield crypto.subtle.importKey('raw', encodeBase64(key), { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
    });
}
function decodeBase64(encoded) {
    const byteChars = Array.from(encoded, (byte) => String.fromCodePoint(byte));
    return btoa(byteChars.join(''));
}
function encodeBase64(data) {
    return Uint8Array.from(atob(data), (ch) => ch.codePointAt(0));
}
