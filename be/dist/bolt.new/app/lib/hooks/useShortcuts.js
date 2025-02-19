"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ShortcutEventEmitter_emitter;
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcutEventEmitter = void 0;
exports.useShortcuts = useShortcuts;
const react_1 = require("@nanostores/react");
const react_2 = require("react");
const settings_1 = require("~/lib/stores/settings");
class ShortcutEventEmitter {
    constructor() {
        _ShortcutEventEmitter_emitter.set(this, new EventTarget());
    }
    dispatch(type) {
        __classPrivateFieldGet(this, _ShortcutEventEmitter_emitter, "f").dispatchEvent(new Event(type));
    }
    on(type, cb) {
        __classPrivateFieldGet(this, _ShortcutEventEmitter_emitter, "f").addEventListener(type, cb);
        return () => {
            __classPrivateFieldGet(this, _ShortcutEventEmitter_emitter, "f").removeEventListener(type, cb);
        };
    }
}
_ShortcutEventEmitter_emitter = new WeakMap();
exports.shortcutEventEmitter = new ShortcutEventEmitter();
function useShortcuts() {
    const shortcuts = (0, react_1.useStore)(settings_1.shortcutsStore);
    (0, react_2.useEffect)(() => {
        const handleKeyDown = (event) => {
            const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
            for (const name in shortcuts) {
                const shortcut = shortcuts[name];
                if (shortcut.key.toLowerCase() === key.toLowerCase() &&
                    (shortcut.ctrlOrMetaKey
                        ? ctrlKey || metaKey
                        : (shortcut.ctrlKey === undefined || shortcut.ctrlKey === ctrlKey) &&
                            (shortcut.metaKey === undefined || shortcut.metaKey === metaKey)) &&
                    (shortcut.shiftKey === undefined || shortcut.shiftKey === shiftKey) &&
                    (shortcut.altKey === undefined || shortcut.altKey === altKey)) {
                    exports.shortcutEventEmitter.dispatch(name);
                    event.preventDefault();
                    event.stopPropagation();
                    shortcut.action();
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]);
}
