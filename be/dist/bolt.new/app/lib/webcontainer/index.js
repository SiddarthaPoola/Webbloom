"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.webcontainer = exports.webcontainerContext = void 0;
const api_1 = require("@webcontainer/api");
const constants_1 = require("~/utils/constants");
exports.webcontainerContext = (_b = (_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.data.webcontainerContext) !== null && _b !== void 0 ? _b : {
    loaded: false,
};
if (import.meta.hot) {
    import.meta.hot.data.webcontainerContext = exports.webcontainerContext;
}
exports.webcontainer = new Promise(() => {
    // noop for ssr
});
if (!import.meta.env.SSR) {
    exports.webcontainer =
        (_d = (_c = import.meta.hot) === null || _c === void 0 ? void 0 : _c.data.webcontainer) !== null && _d !== void 0 ? _d : Promise.resolve()
            .then(() => {
            return api_1.WebContainer.boot({ workdirName: constants_1.WORK_DIR_NAME });
        })
            .then((webcontainer) => {
            exports.webcontainerContext.loaded = true;
            return webcontainer;
        });
    if (import.meta.hot) {
        import.meta.hot.data.webcontainer = exports.webcontainer;
    }
}
