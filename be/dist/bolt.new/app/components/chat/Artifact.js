"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artifact = void 0;
const react_1 = require("@nanostores/react");
const framer_motion_1 = require("framer-motion");
const nanostores_1 = require("nanostores");
const react_2 = require("react");
const shiki_1 = require("shiki");
const workbench_1 = require("~/lib/stores/workbench");
const classNames_1 = require("~/utils/classNames");
const easings_1 = require("~/utils/easings");
const highlighterOptions = {
    langs: ['shell'],
    themes: ['light-plus', 'dark-plus'],
};
const shellHighlighter = (_b = (_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.data.shellHighlighter) !== null && _b !== void 0 ? _b : (await (0, shiki_1.createHighlighter)(highlighterOptions));
if (import.meta.hot) {
    import.meta.hot.data.shellHighlighter = shellHighlighter;
}
exports.Artifact = (0, react_2.memo)(({ messageId }) => {
    const userToggledActions = (0, react_2.useRef)(false);
    const [showActions, setShowActions] = (0, react_2.useState)(false);
    const artifacts = (0, react_1.useStore)(workbench_1.workbenchStore.artifacts);
    const artifact = artifacts[messageId];
    const actions = (0, react_1.useStore)((0, nanostores_1.computed)(artifact.runner.actions, (actions) => {
        return Object.values(actions);
    }));
    const toggleActions = () => {
        userToggledActions.current = true;
        setShowActions(!showActions);
    };
    (0, react_2.useEffect)(() => {
        if (actions.length && !showActions && !userToggledActions.current) {
            setShowActions(true);
        }
    }, [actions]);
    return (<div className="artifact border border-bolt-elements-borderColor flex flex-col overflow-hidden rounded-lg w-full transition-border duration-150">
      <div className="flex">
        <button className="flex items-stretch bg-bolt-elements-artifacts-background hover:bg-bolt-elements-artifacts-backgroundHover w-full overflow-hidden" onClick={() => {
            const showWorkbench = workbench_1.workbenchStore.showWorkbench.get();
            workbench_1.workbenchStore.showWorkbench.set(!showWorkbench);
        }}>
          <div className="px-5 p-3.5 w-full text-left">
            <div className="w-full text-bolt-elements-textPrimary font-medium leading-5 text-sm">{artifact === null || artifact === void 0 ? void 0 : artifact.title}</div>
            <div className="w-full w-full text-bolt-elements-textSecondary text-xs mt-0.5">Click to open Workbench</div>
          </div>
        </button>
        <div className="bg-bolt-elements-artifacts-borderColor w-[1px]"/>
        <framer_motion_1.AnimatePresence>
          {actions.length && (<framer_motion_1.motion.button initial={{ width: 0 }} animate={{ width: 'auto' }} exit={{ width: 0 }} transition={{ duration: 0.15, ease: easings_1.cubicEasingFn }} className="bg-bolt-elements-artifacts-background hover:bg-bolt-elements-artifacts-backgroundHover" onClick={toggleActions}>
              <div className="p-4">
                <div className={showActions ? 'i-ph:caret-up-bold' : 'i-ph:caret-down-bold'}></div>
              </div>
            </framer_motion_1.motion.button>)}
        </framer_motion_1.AnimatePresence>
      </div>
      <framer_motion_1.AnimatePresence>
        {showActions && actions.length > 0 && (<framer_motion_1.motion.div className="actions" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: '0px' }} transition={{ duration: 0.15 }}>
            <div className="bg-bolt-elements-artifacts-borderColor h-[1px]"/>
            <div className="p-5 text-left bg-bolt-elements-actions-background">
              <ActionList actions={actions}/>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </div>);
});
function ShellCodeBlock({ classsName, code }) {
    return (<div className={(0, classNames_1.classNames)('text-xs', classsName)} dangerouslySetInnerHTML={{
            __html: shellHighlighter.codeToHtml(code, {
                lang: 'shell',
                theme: 'dark-plus',
            }),
        }}></div>);
}
const actionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};
const ActionList = (0, react_2.memo)(({ actions }) => {
    return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <ul className="list-none space-y-2.5">
        {actions.map((action, index) => {
            const { status, type, content } = action;
            const isLast = index === actions.length - 1;
            return (<framer_motion_1.motion.li key={index} variants={actionVariants} initial="hidden" animate="visible" transition={{
                    duration: 0.2,
                    ease: easings_1.cubicEasingFn,
                }}>
              <div className="flex items-center gap-1.5 text-sm">
                <div className={(0, classNames_1.classNames)('text-lg', getIconColor(action.status))}>
                  {status === 'running' ? (<div className="i-svg-spinners:90-ring-with-bg"></div>) : status === 'pending' ? (<div className="i-ph:circle-duotone"></div>) : status === 'complete' ? (<div className="i-ph:check"></div>) : status === 'failed' || status === 'aborted' ? (<div className="i-ph:x"></div>) : null}
                </div>
                {type === 'file' ? (<div>
                    Create{' '}
                    <code className="bg-bolt-elements-artifacts-inlineCode-background text-bolt-elements-artifacts-inlineCode-text px-1.5 py-1 rounded-md">
                      {action.filePath}
                    </code>
                  </div>) : type === 'shell' ? (<div className="flex items-center w-full min-h-[28px]">
                    <span className="flex-1">Run command</span>
                  </div>) : null}
              </div>
              {type === 'shell' && (<ShellCodeBlock classsName={(0, classNames_1.classNames)('mt-1', {
                        'mb-3.5': !isLast,
                    })} code={content}/>)}
            </framer_motion_1.motion.li>);
        })}
      </ul>
    </framer_motion_1.motion.div>);
});
function getIconColor(status) {
    switch (status) {
        case 'pending': {
            return 'text-bolt-elements-textTertiary';
        }
        case 'running': {
            return 'text-bolt-elements-loader-progress';
        }
        case 'complete': {
            return 'text-bolt-elements-icon-success';
        }
        case 'aborted': {
            return 'text-bolt-elements-textSecondary';
        }
        case 'failed': {
            return 'text-bolt-elements-icon-error';
        }
        default: {
            return undefined;
        }
    }
}
