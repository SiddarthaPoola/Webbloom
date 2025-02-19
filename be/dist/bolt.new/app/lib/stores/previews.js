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
var _PreviewsStore_instances, _PreviewsStore_availablePreviews, _PreviewsStore_webcontainer, _PreviewsStore_init;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewsStore = void 0;
const nanostores_1 = require("nanostores");
class PreviewsStore {
    constructor(webcontainerPromise) {
        _PreviewsStore_instances.add(this);
        _PreviewsStore_availablePreviews.set(this, new Map());
        _PreviewsStore_webcontainer.set(this, void 0);
        this.previews = (0, nanostores_1.atom)([]);
        __classPrivateFieldSet(this, _PreviewsStore_webcontainer, webcontainerPromise, "f");
        __classPrivateFieldGet(this, _PreviewsStore_instances, "m", _PreviewsStore_init).call(this);
    }
}
exports.PreviewsStore = PreviewsStore;
_PreviewsStore_availablePreviews = new WeakMap(), _PreviewsStore_webcontainer = new WeakMap(), _PreviewsStore_instances = new WeakSet(), _PreviewsStore_init = function _PreviewsStore_init() {
    return __awaiter(this, void 0, void 0, function* () {
        const webcontainer = yield __classPrivateFieldGet(this, _PreviewsStore_webcontainer, "f");
        webcontainer.on('port', (port, type, url) => {
            let previewInfo = __classPrivateFieldGet(this, _PreviewsStore_availablePreviews, "f").get(port);
            if (type === 'close' && previewInfo) {
                __classPrivateFieldGet(this, _PreviewsStore_availablePreviews, "f").delete(port);
                this.previews.set(this.previews.get().filter((preview) => preview.port !== port));
                return;
            }
            const previews = this.previews.get();
            if (!previewInfo) {
                previewInfo = { port, ready: type === 'open', baseUrl: url };
                __classPrivateFieldGet(this, _PreviewsStore_availablePreviews, "f").set(port, previewInfo);
                previews.push(previewInfo);
            }
            previewInfo.ready = type === 'open';
            previewInfo.baseUrl = url;
            this.previews.set([...previews]);
        });
    });
};
