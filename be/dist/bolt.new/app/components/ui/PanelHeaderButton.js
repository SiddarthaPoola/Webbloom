"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelHeaderButton = void 0;
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
exports.PanelHeaderButton = (0, react_1.memo)(({ className, disabledClassName, disabled = false, children, onClick }) => {
    return (<button className={(0, classNames_1.classNames)('flex items-center shrink-0 gap-1.5 px-1.5 rounded-md py-0.5 text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed', {
            [(0, classNames_1.classNames)('opacity-30', disabledClassName)]: disabled,
        }, className)} disabled={disabled} onClick={(event) => {
            if (disabled) {
                return;
            }
            onClick === null || onClick === void 0 ? void 0 : onClick(event);
        }}>
        {children}
      </button>);
});
