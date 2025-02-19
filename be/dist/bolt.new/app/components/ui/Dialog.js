"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialog = exports.DialogDescription = exports.DialogTitle = exports.DialogButton = exports.dialogVariants = exports.dialogBackdropVariants = exports.DialogRoot = exports.DialogClose = void 0;
const RadixDialog = __importStar(require("@radix-ui/react-dialog"));
const framer_motion_1 = require("framer-motion");
const react_1 = __importStar(require("react"));
const classNames_1 = require("~/utils/classNames");
const easings_1 = require("~/utils/easings");
const IconButton_1 = require("./IconButton");
var react_dialog_1 = require("@radix-ui/react-dialog");
Object.defineProperty(exports, "DialogClose", { enumerable: true, get: function () { return react_dialog_1.Close; } });
Object.defineProperty(exports, "DialogRoot", { enumerable: true, get: function () { return react_dialog_1.Root; } });
const transition = {
    duration: 0.15,
    ease: easings_1.cubicEasingFn,
};
exports.dialogBackdropVariants = {
    closed: {
        opacity: 0,
        transition,
    },
    open: {
        opacity: 1,
        transition,
    },
};
exports.dialogVariants = {
    closed: {
        x: '-50%',
        y: '-40%',
        scale: 0.96,
        opacity: 0,
        transition,
    },
    open: {
        x: '-50%',
        y: '-50%',
        scale: 1,
        opacity: 1,
        transition,
    },
};
exports.DialogButton = (0, react_1.memo)(({ type, children, onClick }) => {
    return (<button className={(0, classNames_1.classNames)('inline-flex h-[35px] items-center justify-center rounded-lg px-4 text-sm leading-none focus:outline-none', {
            'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover': type === 'primary',
            'bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text hover:bg-bolt-elements-button-secondary-backgroundHover': type === 'secondary',
            'bg-bolt-elements-button-danger-background text-bolt-elements-button-danger-text hover:bg-bolt-elements-button-danger-backgroundHover': type === 'danger',
        })} onClick={onClick}>
      {children}
    </button>);
});
exports.DialogTitle = (0, react_1.memo)((_a) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<RadixDialog.Title className={(0, classNames_1.classNames)('px-5 py-4 flex items-center justify-between border-b border-bolt-elements-borderColor text-lg font-semibold leading-6 text-bolt-elements-textPrimary', className)} {...props}>
      {children}
    </RadixDialog.Title>);
});
exports.DialogDescription = (0, react_1.memo)((_a) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<RadixDialog.Description className={(0, classNames_1.classNames)('px-5 py-4 text-bolt-elements-textPrimary text-md', className)} {...props}>
      {children}
    </RadixDialog.Description>);
});
exports.Dialog = (0, react_1.memo)(({ className, children, onBackdrop, onClose }) => {
    return (<RadixDialog.Portal>
      <RadixDialog.Overlay onClick={onBackdrop} asChild>
        <framer_motion_1.motion.div className="bg-black/50 fixed inset-0 z-max" initial="closed" animate="open" exit="closed" variants={exports.dialogBackdropVariants}/>
      </RadixDialog.Overlay>
      <RadixDialog.Content asChild>
        <framer_motion_1.motion.div className={(0, classNames_1.classNames)('fixed top-[50%] left-[50%] z-max max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-2 shadow-lg focus:outline-none overflow-hidden', className)} initial="closed" animate="open" exit="closed" variants={exports.dialogVariants}>
          {children}
          <RadixDialog.Close asChild onClick={onClose}>
            <IconButton_1.IconButton icon="i-ph:x" className="absolute top-[10px] right-[10px]"/>
          </RadixDialog.Close>
        </framer_motion_1.motion.div>
      </RadixDialog.Content>
    </RadixDialog.Portal>);
});
