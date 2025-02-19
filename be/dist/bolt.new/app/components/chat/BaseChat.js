"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChat = void 0;
const react_1 = __importDefault(require("react"));
const client_only_1 = require("remix-utils/client-only");
const Menu_client_1 = require("~/components/sidebar/Menu.client");
const IconButton_1 = require("~/components/ui/IconButton");
const Workbench_client_1 = require("~/components/workbench/Workbench.client");
const classNames_1 = require("~/utils/classNames");
const Messages_client_1 = require("./Messages.client");
const SendButton_client_1 = require("./SendButton.client");
const BaseChat_module_scss_1 = __importDefault(require("./BaseChat.module.scss"));
const EXAMPLE_PROMPTS = [
    { text: 'Build a todo app in React using Tailwind' },
    { text: 'Build a simple blog using Astro' },
    { text: 'Create a cookie consent form using Material UI' },
    { text: 'Make a space invaders game' },
    { text: 'How do I center a div?' },
];
const TEXTAREA_MIN_HEIGHT = 76;
exports.BaseChat = react_1.default.forwardRef(({ textareaRef, messageRef, scrollRef, showChat = true, chatStarted = false, isStreaming = false, enhancingPrompt = false, promptEnhanced = false, messages, input = '', sendMessage, handleInputChange, enhancePrompt, handleStop, }, ref) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    return (<div ref={ref} className={(0, classNames_1.classNames)(BaseChat_module_scss_1.default.BaseChat, 'relative flex h-full w-full overflow-hidden bg-bolt-elements-background-depth-1')} data-chat-visible={showChat}>
        <client_only_1.ClientOnly>{() => <Menu_client_1.Menu />}</client_only_1.ClientOnly>
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={(0, classNames_1.classNames)(BaseChat_module_scss_1.default.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (<div id="intro" className="mt-[26vh] max-w-chat mx-auto">
                <h1 className="text-5xl text-center font-bold text-bolt-elements-textPrimary mb-2">
                  Where ideas begin
                </h1>
                <p className="mb-4 text-center text-bolt-elements-textSecondary">
                  Bring ideas to life in seconds or get help on existing projects.
                </p>
              </div>)}
            <div className={(0, classNames_1.classNames)('pt-6 px-6', {
            'h-full flex flex-col': chatStarted,
        })}>
              <client_only_1.ClientOnly>
                {() => {
            return chatStarted ? (<Messages_client_1.Messages ref={messageRef} className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1" messages={messages} isStreaming={isStreaming}/>) : null;
        }}
              </client_only_1.ClientOnly>
              <div className={(0, classNames_1.classNames)('relative w-full max-w-chat mx-auto z-prompt', {
            'sticky bottom-0': chatStarted,
        })}>
                <div className={(0, classNames_1.classNames)('shadow-sm border border-bolt-elements-borderColor bg-bolt-elements-prompt-background backdrop-filter backdrop-blur-[8px] rounded-lg overflow-hidden')}>
                  <textarea ref={textareaRef} className={`w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent`} onKeyDown={(event) => {
            if (event.key === 'Enter') {
                if (event.shiftKey) {
                    return;
                }
                event.preventDefault();
                sendMessage === null || sendMessage === void 0 ? void 0 : sendMessage(event);
            }
        }} value={input} onChange={(event) => {
            handleInputChange === null || handleInputChange === void 0 ? void 0 : handleInputChange(event);
        }} style={{
            minHeight: TEXTAREA_MIN_HEIGHT,
            maxHeight: TEXTAREA_MAX_HEIGHT,
        }} placeholder="How can Bolt help you today?" translate="no"/>
                  <client_only_1.ClientOnly>
                    {() => (<SendButton_client_1.SendButton show={input.length > 0 || isStreaming} isStreaming={isStreaming} onClick={(event) => {
                if (isStreaming) {
                    handleStop === null || handleStop === void 0 ? void 0 : handleStop();
                    return;
                }
                sendMessage === null || sendMessage === void 0 ? void 0 : sendMessage(event);
            }}/>)}
                  </client_only_1.ClientOnly>
                  <div className="flex justify-between text-sm p-4 pt-2">
                    <div className="flex gap-1 items-center">
                      <IconButton_1.IconButton title="Enhance prompt" disabled={input.length === 0 || enhancingPrompt} className={(0, classNames_1.classNames)({
            'opacity-100!': enhancingPrompt,
            'text-bolt-elements-item-contentAccent! pr-1.5 enabled:hover:bg-bolt-elements-item-backgroundAccent!': promptEnhanced,
        })} onClick={() => enhancePrompt === null || enhancePrompt === void 0 ? void 0 : enhancePrompt()}>
                        {enhancingPrompt ? (<>
                            <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl"></div>
                            <div className="ml-1.5">Enhancing prompt...</div>
                          </>) : (<>
                            <div className="i-bolt:stars text-xl"></div>
                            {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
                          </>)}
                      </IconButton_1.IconButton>
                    </div>
                    {input.length > 3 ? (<div className="text-xs text-bolt-elements-textTertiary">
                        Use <kbd className="kdb">Shift</kbd> + <kbd className="kdb">Return</kbd> for a new line
                      </div>) : null}
                  </div>
                </div>
                <div className="bg-bolt-elements-background-depth-1 pb-6">{/* Ghost Element */}</div>
              </div>
            </div>
            {!chatStarted && (<div id="examples" className="relative w-full max-w-xl mx-auto mt-8 flex justify-center">
                <div className="flex flex-col space-y-2 [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                return (<button key={index} onClick={(event) => {
                        sendMessage === null || sendMessage === void 0 ? void 0 : sendMessage(event, examplePrompt.text);
                    }} className="group flex items-center w-full gap-2 justify-center bg-transparent text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-theme">
                        {examplePrompt.text}
                        <div className="i-ph:arrow-bend-down-left"/>
                      </button>);
            })}
                </div>
              </div>)}
          </div>
          <client_only_1.ClientOnly>{() => <Workbench_client_1.Workbench chatStarted={chatStarted} isStreaming={isStreaming}/>}</client_only_1.ClientOnly>
        </div>
      </div>);
});
