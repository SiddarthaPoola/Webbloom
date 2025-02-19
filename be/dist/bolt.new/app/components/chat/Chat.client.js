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
exports.ChatImpl = void 0;
exports.Chat = Chat;
const react_1 = require("@nanostores/react");
const react_2 = require("ai/react");
const framer_motion_1 = require("framer-motion");
const react_3 = require("react");
const react_toastify_1 = require("react-toastify");
const hooks_1 = require("~/lib/hooks");
const persistence_1 = require("~/lib/persistence");
const chat_1 = require("~/lib/stores/chat");
const workbench_1 = require("~/lib/stores/workbench");
const diff_1 = require("~/utils/diff");
const easings_1 = require("~/utils/easings");
const logger_1 = require("~/utils/logger");
const BaseChat_1 = require("./BaseChat");
const toastAnimation = (0, react_toastify_1.cssTransition)({
    enter: 'animated fadeInRight',
    exit: 'animated fadeOutRight',
});
const logger = (0, logger_1.createScopedLogger)('Chat');
function Chat() {
    logger_1.renderLogger.trace('Chat');
    const { ready, initialMessages, storeMessageHistory } = (0, persistence_1.useChatHistory)();
    return (<>
      {ready && <exports.ChatImpl initialMessages={initialMessages} storeMessageHistory={storeMessageHistory}/>}
      <react_toastify_1.ToastContainer closeButton={({ closeToast }) => {
            return (<button className="Toastify__close-button" onClick={closeToast}>
              <div className="i-ph:x text-lg"/>
            </button>);
        }} icon={({ type }) => {
            /**
             * @todo Handle more types if we need them. This may require extra color palettes.
             */
            switch (type) {
                case 'success': {
                    return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl"/>;
                }
                case 'error': {
                    return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl"/>;
                }
            }
            return undefined;
        }} position="bottom-right" pauseOnFocusLoss transition={toastAnimation}/>
    </>);
}
exports.ChatImpl = (0, react_3.memo)(({ initialMessages, storeMessageHistory }) => {
    (0, hooks_1.useShortcuts)();
    const textareaRef = (0, react_3.useRef)(null);
    const [chatStarted, setChatStarted] = (0, react_3.useState)(initialMessages.length > 0);
    const { showChat } = (0, react_1.useStore)(chat_1.chatStore);
    const [animationScope, animate] = (0, framer_motion_1.useAnimate)();
    const { messages, isLoading, input, handleInputChange, setInput, stop, append } = (0, react_2.useChat)({
        api: '/api/chat',
        onError: (error) => {
            logger.error('Request failed\n\n', error);
            react_toastify_1.toast.error('There was an error processing your request');
        },
        onFinish: () => {
            logger.debug('Finished streaming');
        },
        initialMessages,
    });
    const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = (0, hooks_1.usePromptEnhancer)();
    const { parsedMessages, parseMessages } = (0, hooks_1.useMessageParser)();
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    (0, react_3.useEffect)(() => {
        chat_1.chatStore.setKey('started', initialMessages.length > 0);
    }, []);
    (0, react_3.useEffect)(() => {
        parseMessages(messages, isLoading);
        if (messages.length > initialMessages.length) {
            storeMessageHistory(messages).catch((error) => react_toastify_1.toast.error(error.message));
        }
    }, [messages, isLoading, parseMessages]);
    const scrollTextArea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.scrollTop = textarea.scrollHeight;
        }
    };
    const abort = () => {
        stop();
        chat_1.chatStore.setKey('aborted', true);
        workbench_1.workbenchStore.abortAllActions();
    };
    (0, react_3.useEffect)(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
            textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
        }
    }, [input, textareaRef]);
    const runAnimation = () => __awaiter(void 0, void 0, void 0, function* () {
        if (chatStarted) {
            return;
        }
        yield Promise.all([
            animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }),
            animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: easings_1.cubicEasingFn }),
        ]);
        chat_1.chatStore.setKey('started', true);
        setChatStarted(true);
    });
    const sendMessage = (_event, messageInput) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const _input = messageInput || input;
        if (_input.length === 0 || isLoading) {
            return;
        }
        /**
         * @note (delm) Usually saving files shouldn't take long but it may take longer if there
         * many unsaved files. In that case we need to block user input and show an indicator
         * of some kind so the user is aware that something is happening. But I consider the
         * happy case to be no unsaved files and I would expect users to save their changes
         * before they send another message.
         */
        yield workbench_1.workbenchStore.saveAllFiles();
        const fileModifications = workbench_1.workbenchStore.getFileModifcations();
        chat_1.chatStore.setKey('aborted', false);
        runAnimation();
        if (fileModifications !== undefined) {
            const diff = (0, diff_1.fileModificationsToHTML)(fileModifications);
            /**
             * If we have file modifications we append a new user message manually since we have to prefix
             * the user input with the file modifications and we don't want the new user input to appear
             * in the prompt. Using `append` is almost the same as `handleSubmit` except that we have to
             * manually reset the input and we'd have to manually pass in file attachments. However, those
             * aren't relevant here.
             */
            append({ role: 'user', content: `${diff}\n\n${_input}` });
            /**
             * After sending a new message we reset all modifications since the model
             * should now be aware of all the changes.
             */
            workbench_1.workbenchStore.resetAllFileModifications();
        }
        else {
            append({ role: 'user', content: _input });
        }
        setInput('');
        resetEnhancer();
        (_a = textareaRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    });
    const [messageRef, scrollRef] = (0, hooks_1.useSnapScroll)();
    return (<BaseChat_1.BaseChat ref={animationScope} textareaRef={textareaRef} input={input} showChat={showChat} chatStarted={chatStarted} isStreaming={isLoading} enhancingPrompt={enhancingPrompt} promptEnhanced={promptEnhanced} sendMessage={sendMessage} messageRef={messageRef} scrollRef={scrollRef} handleInputChange={handleInputChange} handleStop={abort} messages={messages.map((message, i) => {
            if (message.role === 'user') {
                return message;
            }
            return Object.assign(Object.assign({}, message), { content: parsedMessages[i] || '' });
        })} enhancePrompt={() => {
            enhancePrompt(input, (input) => {
                setInput(input);
                scrollTextArea();
            });
        }}/>);
});
