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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WorkbenchStore_instances, _WorkbenchStore_previewsStore, _WorkbenchStore_filesStore, _WorkbenchStore_editorStore, _WorkbenchStore_terminalStore, _WorkbenchStore_getArtifact;
Object.defineProperty(exports, "__esModule", { value: true });
exports.workbenchStore = exports.WorkbenchStore = void 0;
const nanostores_1 = require("nanostores");
const action_runner_1 = require("~/lib/runtime/action-runner");
const webcontainer_1 = require("~/lib/webcontainer");
const unreachable_1 = require("~/utils/unreachable");
const editor_1 = require("./editor");
const files_1 = require("./files");
const previews_1 = require("./previews");
const terminal_1 = require("./terminal");
class WorkbenchStore {
    constructor() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _WorkbenchStore_instances.add(this);
        _WorkbenchStore_previewsStore.set(this, new previews_1.PreviewsStore(webcontainer_1.webcontainer));
        _WorkbenchStore_filesStore.set(this, new files_1.FilesStore(webcontainer_1.webcontainer));
        _WorkbenchStore_editorStore.set(this, new editor_1.EditorStore(__classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f")));
        _WorkbenchStore_terminalStore.set(this, new terminal_1.TerminalStore(webcontainer_1.webcontainer));
        this.artifacts = (_b = (_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.data.artifacts) !== null && _b !== void 0 ? _b : (0, nanostores_1.map)({});
        this.showWorkbench = (_d = (_c = import.meta.hot) === null || _c === void 0 ? void 0 : _c.data.showWorkbench) !== null && _d !== void 0 ? _d : (0, nanostores_1.atom)(false);
        this.currentView = (_f = (_e = import.meta.hot) === null || _e === void 0 ? void 0 : _e.data.currentView) !== null && _f !== void 0 ? _f : (0, nanostores_1.atom)('code');
        this.unsavedFiles = (_h = (_g = import.meta.hot) === null || _g === void 0 ? void 0 : _g.data.unsavedFiles) !== null && _h !== void 0 ? _h : (0, nanostores_1.atom)(new Set());
        this.modifiedFiles = new Set();
        this.artifactIdList = [];
        if (import.meta.hot) {
            import.meta.hot.data.artifacts = this.artifacts;
            import.meta.hot.data.unsavedFiles = this.unsavedFiles;
            import.meta.hot.data.showWorkbench = this.showWorkbench;
            import.meta.hot.data.currentView = this.currentView;
        }
    }
    get previews() {
        return __classPrivateFieldGet(this, _WorkbenchStore_previewsStore, "f").previews;
    }
    get files() {
        return __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").files;
    }
    get currentDocument() {
        return __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").currentDocument;
    }
    get selectedFile() {
        return __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").selectedFile;
    }
    get firstArtifact() {
        return __classPrivateFieldGet(this, _WorkbenchStore_instances, "m", _WorkbenchStore_getArtifact).call(this, this.artifactIdList[0]);
    }
    get filesCount() {
        return __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").filesCount;
    }
    get showTerminal() {
        return __classPrivateFieldGet(this, _WorkbenchStore_terminalStore, "f").showTerminal;
    }
    toggleTerminal(value) {
        __classPrivateFieldGet(this, _WorkbenchStore_terminalStore, "f").toggleTerminal(value);
    }
    attachTerminal(terminal) {
        __classPrivateFieldGet(this, _WorkbenchStore_terminalStore, "f").attachTerminal(terminal);
    }
    onTerminalResize(cols, rows) {
        __classPrivateFieldGet(this, _WorkbenchStore_terminalStore, "f").onTerminalResize(cols, rows);
    }
    setDocuments(files) {
        __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").setDocuments(files);
        if (__classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").filesCount > 0 && this.currentDocument.get() === undefined) {
            // we find the first file and select it
            for (const [filePath, dirent] of Object.entries(files)) {
                if ((dirent === null || dirent === void 0 ? void 0 : dirent.type) === 'file') {
                    this.setSelectedFile(filePath);
                    break;
                }
            }
        }
    }
    setShowWorkbench(show) {
        this.showWorkbench.set(show);
    }
    setCurrentDocumentContent(newContent) {
        var _a, _b;
        const filePath = (_a = this.currentDocument.get()) === null || _a === void 0 ? void 0 : _a.filePath;
        if (!filePath) {
            return;
        }
        const originalContent = (_b = __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").getFile(filePath)) === null || _b === void 0 ? void 0 : _b.content;
        const unsavedChanges = originalContent !== undefined && originalContent !== newContent;
        __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").updateFile(filePath, newContent);
        const currentDocument = this.currentDocument.get();
        if (currentDocument) {
            const previousUnsavedFiles = this.unsavedFiles.get();
            if (unsavedChanges && previousUnsavedFiles.has(currentDocument.filePath)) {
                return;
            }
            const newUnsavedFiles = new Set(previousUnsavedFiles);
            if (unsavedChanges) {
                newUnsavedFiles.add(currentDocument.filePath);
            }
            else {
                newUnsavedFiles.delete(currentDocument.filePath);
            }
            this.unsavedFiles.set(newUnsavedFiles);
        }
    }
    setCurrentDocumentScrollPosition(position) {
        const editorDocument = this.currentDocument.get();
        if (!editorDocument) {
            return;
        }
        const { filePath } = editorDocument;
        __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").updateScrollPosition(filePath, position);
    }
    setSelectedFile(filePath) {
        __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").setSelectedFile(filePath);
    }
    saveFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = __classPrivateFieldGet(this, _WorkbenchStore_editorStore, "f").documents.get();
            const document = documents[filePath];
            if (document === undefined) {
                return;
            }
            yield __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").saveFile(filePath, document.value);
            const newUnsavedFiles = new Set(this.unsavedFiles.get());
            newUnsavedFiles.delete(filePath);
            this.unsavedFiles.set(newUnsavedFiles);
        });
    }
    saveCurrentDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDocument = this.currentDocument.get();
            if (currentDocument === undefined) {
                return;
            }
            yield this.saveFile(currentDocument.filePath);
        });
    }
    resetCurrentDocument() {
        const currentDocument = this.currentDocument.get();
        if (currentDocument === undefined) {
            return;
        }
        const { filePath } = currentDocument;
        const file = __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").getFile(filePath);
        if (!file) {
            return;
        }
        this.setCurrentDocumentContent(file.content);
    }
    saveAllFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const filePath of this.unsavedFiles.get()) {
                yield this.saveFile(filePath);
            }
        });
    }
    getFileModifcations() {
        return __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").getFileModifications();
    }
    resetAllFileModifications() {
        __classPrivateFieldGet(this, _WorkbenchStore_filesStore, "f").resetFileModifications();
    }
    abortAllActions() {
        // TODO: what do we wanna do and how do we wanna recover from this?
    }
    addArtifact({ messageId, title, id }) {
        const artifact = __classPrivateFieldGet(this, _WorkbenchStore_instances, "m", _WorkbenchStore_getArtifact).call(this, messageId);
        if (artifact) {
            return;
        }
        if (!this.artifactIdList.includes(messageId)) {
            this.artifactIdList.push(messageId);
        }
        this.artifacts.setKey(messageId, {
            id,
            title,
            closed: false,
            runner: new action_runner_1.ActionRunner(webcontainer_1.webcontainer),
        });
    }
    updateArtifact({ messageId }, state) {
        const artifact = __classPrivateFieldGet(this, _WorkbenchStore_instances, "m", _WorkbenchStore_getArtifact).call(this, messageId);
        if (!artifact) {
            return;
        }
        this.artifacts.setKey(messageId, Object.assign(Object.assign({}, artifact), state));
    }
    addAction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId } = data;
            const artifact = __classPrivateFieldGet(this, _WorkbenchStore_instances, "m", _WorkbenchStore_getArtifact).call(this, messageId);
            if (!artifact) {
                (0, unreachable_1.unreachable)('Artifact not found');
            }
            artifact.runner.addAction(data);
        });
    }
    runAction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId } = data;
            const artifact = __classPrivateFieldGet(this, _WorkbenchStore_instances, "m", _WorkbenchStore_getArtifact).call(this, messageId);
            if (!artifact) {
                (0, unreachable_1.unreachable)('Artifact not found');
            }
            artifact.runner.runAction(data);
        });
    }
}
exports.WorkbenchStore = WorkbenchStore;
_WorkbenchStore_previewsStore = new WeakMap(), _WorkbenchStore_filesStore = new WeakMap(), _WorkbenchStore_editorStore = new WeakMap(), _WorkbenchStore_terminalStore = new WeakMap(), _WorkbenchStore_instances = new WeakSet(), _WorkbenchStore_getArtifact = function _WorkbenchStore_getArtifact(id) {
    const artifacts = this.artifacts.get();
    return artifacts[id];
};
exports.workbenchStore = new WorkbenchStore();
