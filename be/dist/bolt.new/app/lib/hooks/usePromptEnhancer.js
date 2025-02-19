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
exports.usePromptEnhancer = usePromptEnhancer;
const react_1 = require("react");
const logger_1 = require("~/utils/logger");
const logger = (0, logger_1.createScopedLogger)('usePromptEnhancement');
function usePromptEnhancer() {
    const [enhancingPrompt, setEnhancingPrompt] = (0, react_1.useState)(false);
    const [promptEnhanced, setPromptEnhanced] = (0, react_1.useState)(false);
    const resetEnhancer = () => {
        setEnhancingPrompt(false);
        setPromptEnhanced(false);
    };
    const enhancePrompt = (input, setInput) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        setEnhancingPrompt(true);
        setPromptEnhanced(false);
        const response = yield fetch('/api/enhancer', {
            method: 'POST',
            body: JSON.stringify({
                message: input,
            }),
        });
        const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
        const originalInput = input;
        if (reader) {
            const decoder = new TextDecoder();
            let _input = '';
            let _error;
            try {
                setInput('');
                while (true) {
                    const { value, done } = yield reader.read();
                    if (done) {
                        break;
                    }
                    _input += decoder.decode(value);
                    logger.trace('Set input', _input);
                    setInput(_input);
                }
            }
            catch (error) {
                _error = error;
                setInput(originalInput);
            }
            finally {
                if (_error) {
                    logger.error(_error);
                }
                setEnhancingPrompt(false);
                setPromptEnhanced(true);
                setTimeout(() => {
                    setInput(_input);
                });
            }
        }
    });
    return { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer };
}
