"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelHeader = void 0;
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
exports.PanelHeader = (0, react_1.memo)(({ className, children }) => {
    return (<div className={(0, classNames_1.classNames)('flex items-center gap-2 bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary border-b border-bolt-elements-borderColor px-4 py-1 min-h-[34px] text-sm', className)}>
      {children}
    </div>);
});
