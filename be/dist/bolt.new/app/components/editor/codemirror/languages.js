"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.supportedLanguages = void 0;
exports.getLanguage = getLanguage;
const language_1 = require("@codemirror/language");
exports.supportedLanguages = [
    language_1.LanguageDescription.of({
        name: 'TS',
        extensions: ['ts'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-javascript'))).then((module) => module.javascript({ typescript: true }));
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'JS',
        extensions: ['js', 'mjs', 'cjs'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-javascript'))).then((module) => module.javascript());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'TSX',
        extensions: ['tsx'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-javascript'))).then((module) => module.javascript({ jsx: true, typescript: true }));
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'JSX',
        extensions: ['jsx'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-javascript'))).then((module) => module.javascript({ jsx: true }));
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'HTML',
        extensions: ['html'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-html'))).then((module) => module.html());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'CSS',
        extensions: ['css'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-css'))).then((module) => module.css());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'SASS',
        extensions: ['sass'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-sass'))).then((module) => module.sass({ indented: true }));
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'SCSS',
        extensions: ['scss'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-sass'))).then((module) => module.sass({ indented: false }));
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'JSON',
        extensions: ['json'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-json'))).then((module) => module.json());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'Markdown',
        extensions: ['md'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-markdown'))).then((module) => module.markdown());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'Wasm',
        extensions: ['wat'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-wast'))).then((module) => module.wast());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'Python',
        extensions: ['py'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-python'))).then((module) => module.python());
            });
        },
    }),
    language_1.LanguageDescription.of({
        name: 'C++',
        extensions: ['cpp'],
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve().then(() => __importStar(require('@codemirror/lang-cpp'))).then((module) => module.cpp());
            });
        },
    }),
];
function getLanguage(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const languageDescription = language_1.LanguageDescription.matchFilename(exports.supportedLanguages, fileName);
        if (languageDescription) {
            return yield languageDescription.load();
        }
        return undefined;
    });
}
