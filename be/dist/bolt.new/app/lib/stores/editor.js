"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _EditorStore_filesStore;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorStore = void 0;
const nanostores_1 = require("nanostores");
class EditorStore {
    constructor(filesStore) {
        var _a, _b, _c, _d;
        _EditorStore_filesStore.set(this, void 0);
        this.selectedFile = (_b = (_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.data.selectedFile) !== null && _b !== void 0 ? _b : (0, nanostores_1.atom)();
        this.documents = (_d = (_c = import.meta.hot) === null || _c === void 0 ? void 0 : _c.data.documents) !== null && _d !== void 0 ? _d : (0, nanostores_1.map)({});
        this.currentDocument = (0, nanostores_1.computed)([this.documents, this.selectedFile], (documents, selectedFile) => {
            if (!selectedFile) {
                return undefined;
            }
            return documents[selectedFile];
        });
        __classPrivateFieldSet(this, _EditorStore_filesStore, filesStore, "f");
        if (import.meta.hot) {
            import.meta.hot.data.documents = this.documents;
            import.meta.hot.data.selectedFile = this.selectedFile;
        }
    }
    setDocuments(files) {
        const previousDocuments = this.documents.value;
        this.documents.set(Object.fromEntries(Object.entries(files)
            .map(([filePath, dirent]) => {
            if (dirent === undefined || dirent.type === 'folder') {
                return undefined;
            }
            const previousDocument = previousDocuments === null || previousDocuments === void 0 ? void 0 : previousDocuments[filePath];
            return [
                filePath,
                {
                    value: dirent.content,
                    filePath,
                    scroll: previousDocument === null || previousDocument === void 0 ? void 0 : previousDocument.scroll,
                },
            ];
        })
            .filter(Boolean)));
    }
    setSelectedFile(filePath) {
        this.selectedFile.set(filePath);
    }
    updateScrollPosition(filePath, position) {
        const documents = this.documents.get();
        const documentState = documents[filePath];
        if (!documentState) {
            return;
        }
        this.documents.setKey(filePath, Object.assign(Object.assign({}, documentState), { scroll: position }));
    }
    updateFile(filePath, newContent) {
        const documents = this.documents.get();
        const documentState = documents[filePath];
        if (!documentState) {
            return;
        }
        const currentContent = documentState.value;
        const contentChanged = currentContent !== newContent;
        if (contentChanged) {
            this.documents.setKey(filePath, Object.assign(Object.assign({}, documentState), { value: newContent }));
        }
    }
}
exports.EditorStore = EditorStore;
_EditorStore_filesStore = new WeakMap();
