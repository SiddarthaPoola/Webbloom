"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = debounce;
function debounce(fn, delay = 100) {
    if (delay === 0) {
        return fn;
    }
    let timer;
    return function (...args) {
        const context = this;
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}
