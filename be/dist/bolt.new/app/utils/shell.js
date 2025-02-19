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
exports.newShellProcess = newShellProcess;
const promises_1 = require("./promises");
function newShellProcess(webcontainer, terminal) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const args = [];
        // we spawn a JSH process with a fallback cols and rows in case the process is not attached yet to a visible terminal
        const process = yield webcontainer.spawn('/bin/jsh', ['--osc', ...args], {
            terminal: {
                cols: (_a = terminal.cols) !== null && _a !== void 0 ? _a : 80,
                rows: (_b = terminal.rows) !== null && _b !== void 0 ? _b : 15,
            },
        });
        const input = process.input.getWriter();
        const output = process.output;
        const jshReady = (0, promises_1.withResolvers)();
        let isInteractive = false;
        output.pipeTo(new WritableStream({
            write(data) {
                if (!isInteractive) {
                    const [, osc] = data.match(/\x1b\]654;([^\x07]+)\x07/) || [];
                    if (osc === 'interactive') {
                        // wait until we see the interactive OSC
                        isInteractive = true;
                        jshReady.resolve();
                    }
                }
                terminal.write(data);
            },
        }));
        terminal.onData((data) => {
            if (isInteractive) {
                input.write(data);
            }
        });
        yield jshReady.promise;
        return process;
    });
}
