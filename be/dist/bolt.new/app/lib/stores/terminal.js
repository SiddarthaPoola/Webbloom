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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TerminalStore_webcontainer, _TerminalStore_terminals;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalStore = void 0;
const nanostores_1 = require("nanostores");
const shell_1 = require("~/utils/shell");
const terminal_1 = require("~/utils/terminal");
class TerminalStore {
    constructor(webcontainerPromise) {
        var _a, _b;
        _TerminalStore_webcontainer.set(this, void 0);
        _TerminalStore_terminals.set(this, []);
        this.showTerminal = (_b = (_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.data.showTerminal) !== null && _b !== void 0 ? _b : (0, nanostores_1.atom)(false);
        __classPrivateFieldSet(this, _TerminalStore_webcontainer, webcontainerPromise, "f");
        if (import.meta.hot) {
            import.meta.hot.data.showTerminal = this.showTerminal;
        }
    }
    toggleTerminal(value) {
        this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
    }
    attachTerminal(terminal) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const shellProcess = yield (0, shell_1.newShellProcess)(yield __classPrivateFieldGet(this, _TerminalStore_webcontainer, "f"), terminal);
                __classPrivateFieldGet(this, _TerminalStore_terminals, "f").push({ terminal, process: shellProcess });
            }
            catch (error) {
                terminal.write(terminal_1.coloredText.red('Failed to spawn shell\n\n') + error.message);
                return;
            }
        });
    }
    onTerminalResize(cols, rows) {
        for (const { process } of __classPrivateFieldGet(this, _TerminalStore_terminals, "f")) {
            process.resize({ cols, rows });
        }
    }
}
exports.TerminalStore = TerminalStore;
_TerminalStore_webcontainer = new WeakMap(), _TerminalStore_terminals = new WeakMap();
