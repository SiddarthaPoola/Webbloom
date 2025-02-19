"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeStore = exports.DEFAULT_THEME = exports.kTheme = void 0;
exports.themeIsDark = themeIsDark;
exports.toggleTheme = toggleTheme;
const nanostores_1 = require("nanostores");
exports.kTheme = 'bolt_theme';
function themeIsDark() {
    return exports.themeStore.get() === 'dark';
}
exports.DEFAULT_THEME = 'light';
exports.themeStore = (0, nanostores_1.atom)(initStore());
function initStore() {
    var _a, _b;
    if (!import.meta.env.SSR) {
        const persistedTheme = localStorage.getItem(exports.kTheme);
        const themeAttribute = (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-theme');
        return (_b = persistedTheme !== null && persistedTheme !== void 0 ? persistedTheme : themeAttribute) !== null && _b !== void 0 ? _b : exports.DEFAULT_THEME;
    }
    return exports.DEFAULT_THEME;
}
function toggleTheme() {
    var _a;
    const currentTheme = exports.themeStore.get();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    exports.themeStore.set(newTheme);
    localStorage.setItem(exports.kTheme, newTheme);
    (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-theme', newTheme);
}
