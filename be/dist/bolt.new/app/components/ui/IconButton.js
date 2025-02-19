"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = void 0;
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
exports.IconButton = (0, react_1.memo)(({ icon, size = 'xl', className, iconClassName, disabledClassName, disabled = false, title, onClick, children, }) => {
    return (<button className={(0, classNames_1.classNames)('flex items-center text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive rounded-md p-1 enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed', {
            [(0, classNames_1.classNames)('opacity-30', disabledClassName)]: disabled,
        }, className)} title={title} disabled={disabled} onClick={(event) => {
            if (disabled) {
                return;
            }
            onClick === null || onClick === void 0 ? void 0 : onClick(event);
        }}>
        {children ? children : <div className={(0, classNames_1.classNames)(icon, getIconSize(size), iconClassName)}></div>}
      </button>);
});
function getIconSize(size) {
    if (size === 'sm') {
        return 'text-sm';
    }
    else if (size === 'md') {
        return 'text-md';
    }
    else if (size === 'lg') {
        return 'text-lg';
    }
    else if (size === 'xl') {
        return 'text-xl';
    }
    else {
        return 'text-2xl';
    }
}
