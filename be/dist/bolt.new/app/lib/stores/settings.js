"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsStore = exports.shortcutsStore = void 0;
const nanostores_1 = require("nanostores");
const workbench_1 = require("./workbench");
exports.shortcutsStore = (0, nanostores_1.map)({
    toggleTerminal: {
        key: 'j',
        ctrlOrMetaKey: true,
        action: () => workbench_1.workbenchStore.toggleTerminal(),
    },
});
exports.settingsStore = (0, nanostores_1.map)({
    shortcuts: exports.shortcutsStore.get(),
});
exports.shortcutsStore.subscribe((shortcuts) => {
    exports.settingsStore.set(Object.assign(Object.assign({}, exports.settingsStore.get()), { shortcuts }));
});
