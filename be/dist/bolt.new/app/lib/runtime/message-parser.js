"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _StreamingMessageParser_instances, _StreamingMessageParser_messages, _StreamingMessageParser_parseActionTag, _StreamingMessageParser_extractAttribute;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingMessageParser = void 0;
const logger_1 = require("~/utils/logger");
const unreachable_1 = require("~/utils/unreachable");
const ARTIFACT_TAG_OPEN = '<boltArtifact';
const ARTIFACT_TAG_CLOSE = '</boltArtifact>';
const ARTIFACT_ACTION_TAG_OPEN = '<boltAction';
const ARTIFACT_ACTION_TAG_CLOSE = '</boltAction>';
const logger = (0, logger_1.createScopedLogger)('MessageParser');
class StreamingMessageParser {
    constructor(_options = {}) {
        _StreamingMessageParser_instances.add(this);
        this._options = _options;
        _StreamingMessageParser_messages.set(this, new Map());
    }
    parse(messageId, input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let state = __classPrivateFieldGet(this, _StreamingMessageParser_messages, "f").get(messageId);
        if (!state) {
            state = {
                position: 0,
                insideAction: false,
                insideArtifact: false,
                currentAction: { content: '' },
                actionId: 0,
            };
            __classPrivateFieldGet(this, _StreamingMessageParser_messages, "f").set(messageId, state);
        }
        let output = '';
        let i = state.position;
        let earlyBreak = false;
        while (i < input.length) {
            if (state.insideArtifact) {
                const currentArtifact = state.currentArtifact;
                if (currentArtifact === undefined) {
                    (0, unreachable_1.unreachable)('Artifact not initialized');
                }
                if (state.insideAction) {
                    const closeIndex = input.indexOf(ARTIFACT_ACTION_TAG_CLOSE, i);
                    const currentAction = state.currentAction;
                    if (closeIndex !== -1) {
                        currentAction.content += input.slice(i, closeIndex);
                        let content = currentAction.content.trim();
                        if ('type' in currentAction && currentAction.type === 'file') {
                            content += '\n';
                        }
                        currentAction.content = content;
                        (_b = (_a = this._options.callbacks) === null || _a === void 0 ? void 0 : _a.onActionClose) === null || _b === void 0 ? void 0 : _b.call(_a, {
                            artifactId: currentArtifact.id,
                            messageId,
                            /**
                             * We decrement the id because it's been incremented already
                             * when `onActionOpen` was emitted to make sure the ids are
                             * the same.
                             */
                            actionId: String(state.actionId - 1),
                            action: currentAction,
                        });
                        state.insideAction = false;
                        state.currentAction = { content: '' };
                        i = closeIndex + ARTIFACT_ACTION_TAG_CLOSE.length;
                    }
                    else {
                        break;
                    }
                }
                else {
                    const actionOpenIndex = input.indexOf(ARTIFACT_ACTION_TAG_OPEN, i);
                    const artifactCloseIndex = input.indexOf(ARTIFACT_TAG_CLOSE, i);
                    if (actionOpenIndex !== -1 && (artifactCloseIndex === -1 || actionOpenIndex < artifactCloseIndex)) {
                        const actionEndIndex = input.indexOf('>', actionOpenIndex);
                        if (actionEndIndex !== -1) {
                            state.insideAction = true;
                            state.currentAction = __classPrivateFieldGet(this, _StreamingMessageParser_instances, "m", _StreamingMessageParser_parseActionTag).call(this, input, actionOpenIndex, actionEndIndex);
                            (_d = (_c = this._options.callbacks) === null || _c === void 0 ? void 0 : _c.onActionOpen) === null || _d === void 0 ? void 0 : _d.call(_c, {
                                artifactId: currentArtifact.id,
                                messageId,
                                actionId: String(state.actionId++),
                                action: state.currentAction,
                            });
                            i = actionEndIndex + 1;
                        }
                        else {
                            break;
                        }
                    }
                    else if (artifactCloseIndex !== -1) {
                        (_f = (_e = this._options.callbacks) === null || _e === void 0 ? void 0 : _e.onArtifactClose) === null || _f === void 0 ? void 0 : _f.call(_e, Object.assign({ messageId }, currentArtifact));
                        state.insideArtifact = false;
                        state.currentArtifact = undefined;
                        i = artifactCloseIndex + ARTIFACT_TAG_CLOSE.length;
                    }
                    else {
                        break;
                    }
                }
            }
            else if (input[i] === '<' && input[i + 1] !== '/') {
                let j = i;
                let potentialTag = '';
                while (j < input.length && potentialTag.length < ARTIFACT_TAG_OPEN.length) {
                    potentialTag += input[j];
                    if (potentialTag === ARTIFACT_TAG_OPEN) {
                        const nextChar = input[j + 1];
                        if (nextChar && nextChar !== '>' && nextChar !== ' ') {
                            output += input.slice(i, j + 1);
                            i = j + 1;
                            break;
                        }
                        const openTagEnd = input.indexOf('>', j);
                        if (openTagEnd !== -1) {
                            const artifactTag = input.slice(i, openTagEnd + 1);
                            const artifactTitle = __classPrivateFieldGet(this, _StreamingMessageParser_instances, "m", _StreamingMessageParser_extractAttribute).call(this, artifactTag, 'title');
                            const artifactId = __classPrivateFieldGet(this, _StreamingMessageParser_instances, "m", _StreamingMessageParser_extractAttribute).call(this, artifactTag, 'id');
                            if (!artifactTitle) {
                                logger.warn('Artifact title missing');
                            }
                            if (!artifactId) {
                                logger.warn('Artifact id missing');
                            }
                            state.insideArtifact = true;
                            const currentArtifact = {
                                id: artifactId,
                                title: artifactTitle,
                            };
                            state.currentArtifact = currentArtifact;
                            (_h = (_g = this._options.callbacks) === null || _g === void 0 ? void 0 : _g.onArtifactOpen) === null || _h === void 0 ? void 0 : _h.call(_g, Object.assign({ messageId }, currentArtifact));
                            const artifactFactory = (_j = this._options.artifactElement) !== null && _j !== void 0 ? _j : createArtifactElement;
                            output += artifactFactory({ messageId });
                            i = openTagEnd + 1;
                        }
                        else {
                            earlyBreak = true;
                        }
                        break;
                    }
                    else if (!ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
                        output += input.slice(i, j + 1);
                        i = j + 1;
                        break;
                    }
                    j++;
                }
                if (j === input.length && ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
                    break;
                }
            }
            else {
                output += input[i];
                i++;
            }
            if (earlyBreak) {
                break;
            }
        }
        state.position = i;
        return output;
    }
    reset() {
        __classPrivateFieldGet(this, _StreamingMessageParser_messages, "f").clear();
    }
}
exports.StreamingMessageParser = StreamingMessageParser;
_StreamingMessageParser_messages = new WeakMap(), _StreamingMessageParser_instances = new WeakSet(), _StreamingMessageParser_parseActionTag = function _StreamingMessageParser_parseActionTag(input, actionOpenIndex, actionEndIndex) {
    const actionTag = input.slice(actionOpenIndex, actionEndIndex + 1);
    const actionType = __classPrivateFieldGet(this, _StreamingMessageParser_instances, "m", _StreamingMessageParser_extractAttribute).call(this, actionTag, 'type');
    const actionAttributes = {
        type: actionType,
        content: '',
    };
    if (actionType === 'file') {
        const filePath = __classPrivateFieldGet(this, _StreamingMessageParser_instances, "m", _StreamingMessageParser_extractAttribute).call(this, actionTag, 'filePath');
        if (!filePath) {
            logger.debug('File path not specified');
        }
        actionAttributes.filePath = filePath;
    }
    else if (actionType !== 'shell') {
        logger.warn(`Unknown action type '${actionType}'`);
    }
    return actionAttributes;
}, _StreamingMessageParser_extractAttribute = function _StreamingMessageParser_extractAttribute(tag, attributeName) {
    const match = tag.match(new RegExp(`${attributeName}="([^"]*)"`, 'i'));
    return match ? match[1] : undefined;
};
const createArtifactElement = (props) => {
    const elementProps = [
        'class="__boltArtifact__"',
        ...Object.entries(props).map(([key, value]) => {
            return `data-${camelToDashCase(key)}=${JSON.stringify(value)}`;
        }),
    ];
    return `<div ${elementProps.join(' ')}></div>`;
};
function camelToDashCase(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
