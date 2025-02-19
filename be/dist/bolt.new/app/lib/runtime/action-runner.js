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
var _ActionRunner_instances, _ActionRunner_webcontainer, _ActionRunner_currentExecutionPromise, _ActionRunner_executeAction, _ActionRunner_runShellAction, _ActionRunner_runFileAction, _ActionRunner_updateAction;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRunner = void 0;
const nanostores_1 = require("nanostores");
const nodePath = __importStar(require("node:path"));
const logger_1 = require("~/utils/logger");
const unreachable_1 = require("~/utils/unreachable");
const logger = (0, logger_1.createScopedLogger)('ActionRunner');
class ActionRunner {
    constructor(webcontainerPromise) {
        _ActionRunner_instances.add(this);
        _ActionRunner_webcontainer.set(this, void 0);
        _ActionRunner_currentExecutionPromise.set(this, Promise.resolve());
        this.actions = (0, nanostores_1.map)({});
        __classPrivateFieldSet(this, _ActionRunner_webcontainer, webcontainerPromise, "f");
    }
    addAction(data) {
        const { actionId } = data;
        const actions = this.actions.get();
        const action = actions[actionId];
        if (action) {
            // action already added
            return;
        }
        const abortController = new AbortController();
        this.actions.setKey(actionId, Object.assign(Object.assign({}, data.action), { status: 'pending', executed: false, abort: () => {
                abortController.abort();
                __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_updateAction).call(this, actionId, { status: 'aborted' });
            }, abortSignal: abortController.signal }));
        __classPrivateFieldGet(this, _ActionRunner_currentExecutionPromise, "f").then(() => {
            __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_updateAction).call(this, actionId, { status: 'running' });
        });
    }
    runAction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { actionId } = data;
            const action = this.actions.get()[actionId];
            if (!action) {
                (0, unreachable_1.unreachable)(`Action ${actionId} not found`);
            }
            if (action.executed) {
                return;
            }
            __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_updateAction).call(this, actionId, Object.assign(Object.assign(Object.assign({}, action), data.action), { executed: true }));
            __classPrivateFieldSet(this, _ActionRunner_currentExecutionPromise, __classPrivateFieldGet(this, _ActionRunner_currentExecutionPromise, "f")
                .then(() => {
                return __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_executeAction).call(this, actionId);
            })
                .catch((error) => {
                console.error('Action failed:', error);
            }), "f");
        });
    }
}
exports.ActionRunner = ActionRunner;
_ActionRunner_webcontainer = new WeakMap(), _ActionRunner_currentExecutionPromise = new WeakMap(), _ActionRunner_instances = new WeakSet(), _ActionRunner_executeAction = function _ActionRunner_executeAction(actionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const action = this.actions.get()[actionId];
        __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_updateAction).call(this, actionId, { status: 'running' });
        try {
            switch (action.type) {
                case 'shell': {
                    yield __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_runShellAction).call(this, action);
                    break;
                }
                case 'file': {
                    yield __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_runFileAction).call(this, action);
                    break;
                }
            }
            __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_updateAction).call(this, actionId, { status: action.abortSignal.aborted ? 'aborted' : 'complete' });
        }
        catch (error) {
            __classPrivateFieldGet(this, _ActionRunner_instances, "m", _ActionRunner_updateAction).call(this, actionId, { status: 'failed', error: 'Action failed' });
            // re-throw the error to be caught in the promise chain
            throw error;
        }
    });
}, _ActionRunner_runShellAction = function _ActionRunner_runShellAction(action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action.type !== 'shell') {
            (0, unreachable_1.unreachable)('Expected shell action');
        }
        const webcontainer = yield __classPrivateFieldGet(this, _ActionRunner_webcontainer, "f");
        const process = yield webcontainer.spawn('jsh', ['-c', action.content], {
            env: { npm_config_yes: true },
        });
        action.abortSignal.addEventListener('abort', () => {
            process.kill();
        });
        process.output.pipeTo(new WritableStream({
            write(data) {
                console.log(data);
            },
        }));
        const exitCode = yield process.exit;
        logger.debug(`Process terminated with code ${exitCode}`);
    });
}, _ActionRunner_runFileAction = function _ActionRunner_runFileAction(action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action.type !== 'file') {
            (0, unreachable_1.unreachable)('Expected file action');
        }
        const webcontainer = yield __classPrivateFieldGet(this, _ActionRunner_webcontainer, "f");
        let folder = nodePath.dirname(action.filePath);
        // remove trailing slashes
        folder = folder.replace(/\/+$/g, '');
        if (folder !== '.') {
            try {
                yield webcontainer.fs.mkdir(folder, { recursive: true });
                logger.debug('Created folder', folder);
            }
            catch (error) {
                logger.error('Failed to create folder\n\n', error);
            }
        }
        try {
            yield webcontainer.fs.writeFile(action.filePath, action.content);
            logger.debug(`File written ${action.filePath}`);
        }
        catch (error) {
            logger.error('Failed to write file\n\n', error);
        }
    });
}, _ActionRunner_updateAction = function _ActionRunner_updateAction(id, newState) {
    const actions = this.actions.get();
    this.actions.setKey(id, Object.assign(Object.assign({}, actions[id]), newState));
};
