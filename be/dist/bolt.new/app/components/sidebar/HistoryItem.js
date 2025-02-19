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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryItem = HistoryItem;
const Dialog = __importStar(require("@radix-ui/react-dialog"));
const react_1 = require("react");
function HistoryItem({ item, onDelete }) {
    const [hovering, setHovering] = (0, react_1.useState)(false);
    const hoverRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        let timeout;
        function mouseEnter() {
            setHovering(true);
            if (timeout) {
                clearTimeout(timeout);
            }
        }
        function mouseLeave() {
            setHovering(false);
        }
        (_a = hoverRef.current) === null || _a === void 0 ? void 0 : _a.addEventListener('mouseenter', mouseEnter);
        (_b = hoverRef.current) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseleave', mouseLeave);
        return () => {
            var _a, _b;
            (_a = hoverRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('mouseenter', mouseEnter);
            (_b = hoverRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseleave', mouseLeave);
        };
    }, []);
    return (<div ref={hoverRef} className="group rounded-md text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3 overflow-hidden flex justify-between items-center px-2 py-1">
      <a href={`/chat/${item.urlId}`} className="flex w-full relative truncate block">
        {item.description}
        <div className="absolute right-0 z-1 top-0 bottom-0 bg-gradient-to-l from-bolt-elements-background-depth-2 group-hover:from-bolt-elements-background-depth-3 to-transparent w-10 flex justify-end group-hover:w-15 group-hover:from-45%">
          {hovering && (<div className="flex items-center p-1 text-bolt-elements-textSecondary hover:text-bolt-elements-item-contentDanger">
              <Dialog.Trigger asChild>
                <button className="i-ph:trash scale-110" onClick={(event) => {
                // we prevent the default so we don't trigger the anchor above
                event.preventDefault();
                onDelete === null || onDelete === void 0 ? void 0 : onDelete(event);
            }}/>
              </Dialog.Trigger>
            </div>)}
        </div>
      </a>
    </div>);
}
