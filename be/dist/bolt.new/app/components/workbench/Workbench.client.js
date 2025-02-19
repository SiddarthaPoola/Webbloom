"use strict";
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
exports.Workbench = void 0;
const react_1 = require("@nanostores/react");
const framer_motion_1 = require("framer-motion");
const nanostores_1 = require("nanostores");
const react_2 = require("react");
const react_toastify_1 = require("react-toastify");
const IconButton_1 = require("~/components/ui/IconButton");
const PanelHeaderButton_1 = require("~/components/ui/PanelHeaderButton");
const Slider_1 = require("~/components/ui/Slider");
const workbench_1 = require("~/lib/stores/workbench");
const classNames_1 = require("~/utils/classNames");
const easings_1 = require("~/utils/easings");
const logger_1 = require("~/utils/logger");
const EditorPanel_1 = require("./EditorPanel");
const Preview_1 = require("./Preview");
const viewTransition = { ease: easings_1.cubicEasingFn };
const sliderOptions = {
    left: {
        value: 'code',
        text: 'Code',
    },
    right: {
        value: 'preview',
        text: 'Preview',
    },
};
const workbenchVariants = {
    closed: {
        width: 0,
        transition: {
            duration: 0.2,
            ease: easings_1.cubicEasingFn,
        },
    },
    open: {
        width: 'var(--workbench-width)',
        transition: {
            duration: 0.2,
            ease: easings_1.cubicEasingFn,
        },
    },
};
exports.Workbench = (0, react_2.memo)(({ chatStarted, isStreaming }) => {
    logger_1.renderLogger.trace('Workbench');
    const hasPreview = (0, react_1.useStore)((0, nanostores_1.computed)(workbench_1.workbenchStore.previews, (previews) => previews.length > 0));
    const showWorkbench = (0, react_1.useStore)(workbench_1.workbenchStore.showWorkbench);
    const selectedFile = (0, react_1.useStore)(workbench_1.workbenchStore.selectedFile);
    const currentDocument = (0, react_1.useStore)(workbench_1.workbenchStore.currentDocument);
    const unsavedFiles = (0, react_1.useStore)(workbench_1.workbenchStore.unsavedFiles);
    const files = (0, react_1.useStore)(workbench_1.workbenchStore.files);
    const selectedView = (0, react_1.useStore)(workbench_1.workbenchStore.currentView);
    const setSelectedView = (view) => {
        workbench_1.workbenchStore.currentView.set(view);
    };
    (0, react_2.useEffect)(() => {
        if (hasPreview) {
            setSelectedView('preview');
        }
    }, [hasPreview]);
    (0, react_2.useEffect)(() => {
        workbench_1.workbenchStore.setDocuments(files);
    }, [files]);
    const onEditorChange = (0, react_2.useCallback)((update) => {
        workbench_1.workbenchStore.setCurrentDocumentContent(update.content);
    }, []);
    const onEditorScroll = (0, react_2.useCallback)((position) => {
        workbench_1.workbenchStore.setCurrentDocumentScrollPosition(position);
    }, []);
    const onFileSelect = (0, react_2.useCallback)((filePath) => {
        workbench_1.workbenchStore.setSelectedFile(filePath);
    }, []);
    const onFileSave = (0, react_2.useCallback)(() => {
        workbench_1.workbenchStore.saveCurrentDocument().catch(() => {
            react_toastify_1.toast.error('Failed to update file content');
        });
    }, []);
    const onFileReset = (0, react_2.useCallback)(() => {
        workbench_1.workbenchStore.resetCurrentDocument();
    }, []);
    return (chatStarted && (<framer_motion_1.motion.div initial="closed" animate={showWorkbench ? 'open' : 'closed'} variants={workbenchVariants} className="z-workbench">
        <div className={(0, classNames_1.classNames)('fixed top-[calc(var(--header-height)+1.5rem)] bottom-6 w-[var(--workbench-inner-width)] mr-4 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier', {
            'left-[var(--workbench-left)]': showWorkbench,
            'left-[100%]': !showWorkbench,
        })}>
          <div className="absolute inset-0 px-6">
            <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
              <div className="flex items-center px-3 py-2 border-b border-bolt-elements-borderColor">
                <Slider_1.Slider selected={selectedView} options={sliderOptions} setSelected={setSelectedView}/>
                <div className="ml-auto"/>
                {selectedView === 'code' && (<PanelHeaderButton_1.PanelHeaderButton className="mr-1 text-sm" onClick={() => {
                workbench_1.workbenchStore.toggleTerminal(!workbench_1.workbenchStore.showTerminal.get());
            }}>
                    <div className="i-ph:terminal"/>
                    Toggle Terminal
                  </PanelHeaderButton_1.PanelHeaderButton>)}
                <IconButton_1.IconButton icon="i-ph:x-circle" className="-mr-1" size="xl" onClick={() => {
            workbench_1.workbenchStore.showWorkbench.set(false);
        }}/>
              </div>
              <div className="relative flex-1 overflow-hidden">
                <View initial={{ x: selectedView === 'code' ? 0 : '-100%' }} animate={{ x: selectedView === 'code' ? 0 : '-100%' }}>
                  <EditorPanel_1.EditorPanel editorDocument={currentDocument} isStreaming={isStreaming} selectedFile={selectedFile} files={files} unsavedFiles={unsavedFiles} onFileSelect={onFileSelect} onEditorScroll={onEditorScroll} onEditorChange={onEditorChange} onFileSave={onFileSave} onFileReset={onFileReset}/>
                </View>
                <View initial={{ x: selectedView === 'preview' ? 0 : '100%' }} animate={{ x: selectedView === 'preview' ? 0 : '100%' }}>
                  <Preview_1.Preview />
                </View>
              </div>
            </div>
          </div>
        </div>
      </framer_motion_1.motion.div>));
});
const View = (0, react_2.memo)((_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (<framer_motion_1.motion.div className="absolute inset-0" transition={viewTransition} {...props}>
      {children}
    </framer_motion_1.motion.div>);
});
