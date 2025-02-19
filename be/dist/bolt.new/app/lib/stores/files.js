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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FilesStore_instances, _FilesStore_webcontainer, _FilesStore_size, _FilesStore_modifiedFiles, _FilesStore_init, _FilesStore_processEventBuffer, _FilesStore_decodeFileContent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesStore = void 0;
const istextorbinary_1 = require("istextorbinary");
const nanostores_1 = require("nanostores");
const node_buffer_1 = require("node:buffer");
const nodePath = __importStar(require("node:path"));
const buffer_1 = require("~/utils/buffer");
const constants_1 = require("~/utils/constants");
const diff_1 = require("~/utils/diff");
const logger_1 = require("~/utils/logger");
const unreachable_1 = require("~/utils/unreachable");
const logger = (0, logger_1.createScopedLogger)('FilesStore');
const utf8TextDecoder = new TextDecoder('utf8', { fatal: true });
class FilesStore {
    get filesCount() {
        return __classPrivateFieldGet(this, _FilesStore_size, "f");
    }
    constructor(webcontainerPromise) {
        var _a, _b, _c, _d;
        _FilesStore_instances.add(this);
        _FilesStore_webcontainer.set(this, void 0);
        /**
         * Tracks the number of files without folders.
         */
        _FilesStore_size.set(this, 0);
        /**
         * @note Keeps track all modified files with their original content since the last user message.
         * Needs to be reset when the user sends another message and all changes have to be submitted
         * for the model to be aware of the changes.
         */
        _FilesStore_modifiedFiles.set(this, (_b = (_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.data.modifiedFiles) !== null && _b !== void 0 ? _b : new Map());
        /**
         * Map of files that matches the state of WebContainer.
         */
        this.files = (_d = (_c = import.meta.hot) === null || _c === void 0 ? void 0 : _c.data.files) !== null && _d !== void 0 ? _d : (0, nanostores_1.map)({});
        __classPrivateFieldSet(this, _FilesStore_webcontainer, webcontainerPromise, "f");
        if (import.meta.hot) {
            import.meta.hot.data.files = this.files;
            import.meta.hot.data.modifiedFiles = __classPrivateFieldGet(this, _FilesStore_modifiedFiles, "f");
        }
        __classPrivateFieldGet(this, _FilesStore_instances, "m", _FilesStore_init).call(this);
    }
    getFile(filePath) {
        const dirent = this.files.get()[filePath];
        if ((dirent === null || dirent === void 0 ? void 0 : dirent.type) !== 'file') {
            return undefined;
        }
        return dirent;
    }
    getFileModifications() {
        return (0, diff_1.computeFileModifications)(this.files.get(), __classPrivateFieldGet(this, _FilesStore_modifiedFiles, "f"));
    }
    resetFileModifications() {
        __classPrivateFieldGet(this, _FilesStore_modifiedFiles, "f").clear();
    }
    saveFile(filePath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const webcontainer = yield __classPrivateFieldGet(this, _FilesStore_webcontainer, "f");
            try {
                const relativePath = nodePath.relative(webcontainer.workdir, filePath);
                if (!relativePath) {
                    throw new Error(`EINVAL: invalid file path, write '${relativePath}'`);
                }
                const oldContent = (_a = this.getFile(filePath)) === null || _a === void 0 ? void 0 : _a.content;
                if (!oldContent) {
                    (0, unreachable_1.unreachable)('Expected content to be defined');
                }
                yield webcontainer.fs.writeFile(relativePath, content);
                if (!__classPrivateFieldGet(this, _FilesStore_modifiedFiles, "f").has(filePath)) {
                    __classPrivateFieldGet(this, _FilesStore_modifiedFiles, "f").set(filePath, oldContent);
                }
                // we immediately update the file and don't rely on the `change` event coming from the watcher
                this.files.setKey(filePath, { type: 'file', content, isBinary: false });
                logger.info('File updated');
            }
            catch (error) {
                logger.error('Failed to update file content\n\n', error);
                throw error;
            }
        });
    }
}
exports.FilesStore = FilesStore;
_FilesStore_webcontainer = new WeakMap(), _FilesStore_size = new WeakMap(), _FilesStore_modifiedFiles = new WeakMap(), _FilesStore_instances = new WeakSet(), _FilesStore_init = function _FilesStore_init() {
    return __awaiter(this, void 0, void 0, function* () {
        const webcontainer = yield __classPrivateFieldGet(this, _FilesStore_webcontainer, "f");
        webcontainer.internal.watchPaths({ include: [`${constants_1.WORK_DIR}/**`], exclude: ['**/node_modules', '.git'], includeContent: true }, (0, buffer_1.bufferWatchEvents)(100, __classPrivateFieldGet(this, _FilesStore_instances, "m", _FilesStore_processEventBuffer).bind(this)));
    });
}, _FilesStore_processEventBuffer = function _FilesStore_processEventBuffer(events) {
    var _a, _b;
    const watchEvents = events.flat(2);
    for (const { type, path, buffer } of watchEvents) {
        // remove any trailing slashes
        const sanitizedPath = path.replace(/\/+$/g, '');
        switch (type) {
            case 'add_dir': {
                // we intentionally add a trailing slash so we can distinguish files from folders in the file tree
                this.files.setKey(sanitizedPath, { type: 'folder' });
                break;
            }
            case 'remove_dir': {
                this.files.setKey(sanitizedPath, undefined);
                for (const [direntPath] of Object.entries(this.files)) {
                    if (direntPath.startsWith(sanitizedPath)) {
                        this.files.setKey(direntPath, undefined);
                    }
                }
                break;
            }
            case 'add_file':
            case 'change': {
                if (type === 'add_file') {
                    __classPrivateFieldSet(this, _FilesStore_size, (_a = __classPrivateFieldGet(this, _FilesStore_size, "f"), _a++, _a), "f");
                }
                let content = '';
                /**
                 * @note This check is purely for the editor. The way we detect this is not
                 * bullet-proof and it's a best guess so there might be false-positives.
                 * The reason we do this is because we don't want to display binary files
                 * in the editor nor allow to edit them.
                 */
                const isBinary = isBinaryFile(buffer);
                if (!isBinary) {
                    content = __classPrivateFieldGet(this, _FilesStore_instances, "m", _FilesStore_decodeFileContent).call(this, buffer);
                }
                this.files.setKey(sanitizedPath, { type: 'file', content, isBinary });
                break;
            }
            case 'remove_file': {
                __classPrivateFieldSet(this, _FilesStore_size, (_b = __classPrivateFieldGet(this, _FilesStore_size, "f"), _b--, _b), "f");
                this.files.setKey(sanitizedPath, undefined);
                break;
            }
            case 'update_directory': {
                // we don't care about these events
                break;
            }
        }
    }
}, _FilesStore_decodeFileContent = function _FilesStore_decodeFileContent(buffer) {
    if (!buffer || buffer.byteLength === 0) {
        return '';
    }
    try {
        return utf8TextDecoder.decode(buffer);
    }
    catch (error) {
        console.log(error);
        return '';
    }
};
function isBinaryFile(buffer) {
    if (buffer === undefined) {
        return false;
    }
    return (0, istextorbinary_1.getEncoding)(convertToBuffer(buffer), { chunkLength: 100 }) === 'binary';
}
/**
 * Converts a `Uint8Array` into a Node.js `Buffer` by copying the prototype.
 * The goal is to  avoid expensive copies. It does create a new typed array
 * but that's generally cheap as long as it uses the same underlying
 * array buffer.
 */
function convertToBuffer(view) {
    const buffer = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    Object.setPrototypeOf(buffer, node_buffer_1.Buffer.prototype);
    return buffer;
}
