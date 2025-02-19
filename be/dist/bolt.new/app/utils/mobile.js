"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = isMobile;
function isMobile() {
    // we use sm: as the breakpoint for mobile. It's currently set to 640px
    return globalThis.innerWidth < 640;
}
