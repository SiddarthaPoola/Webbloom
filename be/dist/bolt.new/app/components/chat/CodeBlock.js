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
exports.CodeBlock = void 0;
const react_1 = require("react");
const shiki_1 = require("shiki");
const classNames_1 = require("~/utils/classNames");
const logger_1 = require("~/utils/logger");
const CodeBlock_module_scss_1 = __importDefault(require("./CodeBlock.module.scss"));
const logger = (0, logger_1.createScopedLogger)('CodeBlock');
exports.CodeBlock = (0, react_1.memo)(({ className, code, language = 'plaintext', theme = 'dark-plus', disableCopy = false }) => {
    const [html, setHTML] = (0, react_1.useState)(undefined);
    const [copied, setCopied] = (0, react_1.useState)(false);
    const copyToClipboard = () => {
        if (copied) {
            return;
        }
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };
    (0, react_1.useEffect)(() => {
        if (language && !(0, shiki_1.isSpecialLang)(language) && !(language in shiki_1.bundledLanguages)) {
            logger.warn(`Unsupported language '${language}'`);
        }
        logger.trace(`Language = ${language}`);
        const processCode = () => __awaiter(void 0, void 0, void 0, function* () {
            setHTML(yield (0, shiki_1.codeToHtml)(code, { lang: language, theme }));
        });
        processCode();
    }, [code]);
    return (<div className={(0, classNames_1.classNames)('relative group text-left', className)}>
        <div className={(0, classNames_1.classNames)(CodeBlock_module_scss_1.default.CopyButtonContainer, 'bg-white absolute top-[10px] right-[10px] rounded-md z-10 text-lg flex items-center justify-center opacity-0 group-hover:opacity-100', {
            'rounded-l-0 opacity-100': copied,
        })}>
          {!disableCopy && (<button className={(0, classNames_1.classNames)('flex items-center bg-transparent p-[6px] justify-center before:bg-white before:rounded-l-md before:text-gray-500 before:border-r before:border-gray-300', {
                'before:opacity-0': !copied,
                'before:opacity-100': copied,
            })} title="Copy Code" onClick={() => copyToClipboard()}>
              <div className="i-ph:clipboard-text-duotone"></div>
            </button>)}
        </div>
        <div dangerouslySetInnerHTML={{ __html: html !== null && html !== void 0 ? html : '' }}></div>
      </div>);
});
