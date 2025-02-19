"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageParser = useMessageParser;
const react_1 = require("react");
const message_parser_1 = require("~/lib/runtime/message-parser");
const workbench_1 = require("~/lib/stores/workbench");
const logger_1 = require("~/utils/logger");
const logger = (0, logger_1.createScopedLogger)('useMessageParser');
const messageParser = new message_parser_1.StreamingMessageParser({
    callbacks: {
        onArtifactOpen: (data) => {
            logger.trace('onArtifactOpen', data);
            workbench_1.workbenchStore.showWorkbench.set(true);
            workbench_1.workbenchStore.addArtifact(data);
        },
        onArtifactClose: (data) => {
            logger.trace('onArtifactClose');
            workbench_1.workbenchStore.updateArtifact(data, { closed: true });
        },
        onActionOpen: (data) => {
            logger.trace('onActionOpen', data.action);
            // we only add shell actions when when the close tag got parsed because only then we have the content
            if (data.action.type !== 'shell') {
                workbench_1.workbenchStore.addAction(data);
            }
        },
        onActionClose: (data) => {
            logger.trace('onActionClose', data.action);
            if (data.action.type === 'shell') {
                workbench_1.workbenchStore.addAction(data);
            }
            workbench_1.workbenchStore.runAction(data);
        },
    },
});
function useMessageParser() {
    const [parsedMessages, setParsedMessages] = (0, react_1.useState)({});
    const parseMessages = (0, react_1.useCallback)((messages, isLoading) => {
        let reset = false;
        if (import.meta.env.DEV && !isLoading) {
            reset = true;
            messageParser.reset();
        }
        for (const [index, message] of messages.entries()) {
            if (message.role === 'assistant') {
                const newParsedContent = messageParser.parse(message.id, message.content);
                setParsedMessages((prevParsed) => (Object.assign(Object.assign({}, prevParsed), { [index]: !reset ? (prevParsed[index] || '') + newParsedContent : newParsedContent })));
            }
        }
    }, []);
    return { parsedMessages, parseMessages };
}
