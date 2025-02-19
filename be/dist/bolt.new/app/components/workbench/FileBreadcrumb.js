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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBreadcrumb = void 0;
const DropdownMenu = __importStar(require("@radix-ui/react-dropdown-menu"));
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
const constants_1 = require("~/utils/constants");
const easings_1 = require("~/utils/easings");
const logger_1 = require("~/utils/logger");
const FileTree_1 = __importDefault(require("./FileTree"));
const WORK_DIR_REGEX = new RegExp(`^${constants_1.WORK_DIR.split('/').slice(0, -1).join('/').replaceAll('/', '\\/')}/`);
const contextMenuVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.15,
            ease: easings_1.cubicEasingFn,
        },
    },
    close: {
        y: 6,
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: easings_1.cubicEasingFn,
        },
    },
};
exports.FileBreadcrumb = (0, react_1.memo)(({ files, pathSegments = [], onFileSelect }) => {
    logger_1.renderLogger.trace('FileBreadcrumb');
    const [activeIndex, setActiveIndex] = (0, react_1.useState)(null);
    const contextMenuRef = (0, react_1.useRef)(null);
    const segmentRefs = (0, react_1.useRef)([]);
    const handleSegmentClick = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    (0, react_1.useEffect)(() => {
        const handleOutsideClick = (event) => {
            var _a;
            if (activeIndex !== null &&
                !((_a = contextMenuRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)) &&
                !segmentRefs.current.some((ref) => ref === null || ref === void 0 ? void 0 : ref.contains(event.target))) {
                setActiveIndex(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [activeIndex]);
    if (files === undefined || pathSegments.length === 0) {
        return null;
    }
    return (<div className="flex">
      {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = pathSegments.slice(0, index).join('/');
            if (!WORK_DIR_REGEX.test(path)) {
                return null;
            }
            const isActive = activeIndex === index;
            return (<div key={index} className="relative flex items-center">
            <DropdownMenu.Root open={isActive} modal={false}>
              <DropdownMenu.Trigger asChild>
                <span ref={(ref) => (segmentRefs.current[index] = ref)} className={(0, classNames_1.classNames)('flex items-center gap-1.5 cursor-pointer shrink-0', {
                    'text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary': !isActive,
                    'text-bolt-elements-textPrimary underline': isActive,
                    'pr-4': isLast,
                })} onClick={() => handleSegmentClick(index)}>
                  {isLast && <div className="i-ph:file-duotone"/>}
                  {segment}
                </span>
              </DropdownMenu.Trigger>
              {index > 0 && !isLast && <span className="i-ph:caret-right inline-block mx-1"/>}
              <framer_motion_1.AnimatePresence>
                {isActive && (<DropdownMenu.Portal>
                    <DropdownMenu.Content className="z-file-tree-breadcrumb" asChild align="start" side="bottom" avoidCollisions={false}>
                      <framer_motion_1.motion.div ref={contextMenuRef} initial="close" animate="open" exit="close" variants={contextMenuVariants}>
                        <div className="rounded-lg overflow-hidden">
                          <div className="max-h-[50vh] min-w-[300px] overflow-scroll bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor shadow-sm rounded-lg">
                            <FileTree_1.default files={files} hideRoot rootFolder={path} collapsed allowFolderSelection selectedFile={`${path}/${segment}`} onFileSelect={(filePath) => {
                        setActiveIndex(null);
                        onFileSelect === null || onFileSelect === void 0 ? void 0 : onFileSelect(filePath);
                    }}/>
                          </div>
                        </div>
                        <DropdownMenu.Arrow className="fill-bolt-elements-borderColor"/>
                      </framer_motion_1.motion.div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>)}
              </framer_motion_1.AnimatePresence>
            </DropdownMenu.Root>
          </div>);
        })}
    </div>);
});
