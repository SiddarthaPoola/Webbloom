"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
const react_1 = require("react");
const react_markdown_1 = __importDefault(require("react-markdown"));
const logger_1 = require("~/utils/logger");
const markdown_1 = require("~/utils/markdown");
const Artifact_1 = require("./Artifact");
const CodeBlock_1 = require("./CodeBlock");
const Markdown_module_scss_1 = __importDefault(require("./Markdown.module.scss"));
const logger = (0, logger_1.createScopedLogger)('MarkdownComponent');
exports.Markdown = (0, react_1.memo)(({ children, html = false, limitedMarkdown = false }) => {
    logger.trace('Render');
    const components = (0, react_1.useMemo)(() => {
        return {
            div: (_a) => {
                var { className, children, node } = _a, props = __rest(_a, ["className", "children", "node"]);
                if (className === null || className === void 0 ? void 0 : className.includes('__boltArtifact__')) {
                    const messageId = node === null || node === void 0 ? void 0 : node.properties.dataMessageId;
                    if (!messageId) {
                        logger.error(`Invalid message id ${messageId}`);
                    }
                    return <Artifact_1.Artifact messageId={messageId}/>;
                }
                return (<div className={className} {...props}>
            {children}
          </div>);
            },
            pre: (props) => {
                var _a, _b;
                const { children, node } = props, rest = __rest(props, ["children", "node"]);
                const [firstChild] = (_a = node === null || node === void 0 ? void 0 : node.children) !== null && _a !== void 0 ? _a : [];
                if (firstChild &&
                    firstChild.type === 'element' &&
                    firstChild.tagName === 'code' &&
                    firstChild.children[0].type === 'text') {
                    const _c = firstChild.properties, { className } = _c, rest = __rest(_c, ["className"]);
                    const [, language = 'plaintext'] = (_b = /language-(\w+)/.exec(String(className) || '')) !== null && _b !== void 0 ? _b : [];
                    return <CodeBlock_1.CodeBlock code={firstChild.children[0].value} language={language} {...rest}/>;
                }
                return <pre {...rest}>{children}</pre>;
            },
        };
    }, []);
    return (<react_markdown_1.default allowedElements={markdown_1.allowedHTMLElements} className={Markdown_module_scss_1.default.MarkdownContent} components={components} remarkPlugins={(0, markdown_1.remarkPlugins)(limitedMarkdown)} rehypePlugins={(0, markdown_1.rehypePlugins)(html)}>
      {children}
    </react_markdown_1.default>);
});
