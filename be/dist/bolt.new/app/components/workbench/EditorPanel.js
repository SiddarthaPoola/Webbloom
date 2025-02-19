"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPanel = void 0;
const react_1 = require("@nanostores/react");
const react_2 = require("react");
const react_resizable_panels_1 = require("react-resizable-panels");
const CodeMirrorEditor_1 = require("~/components/editor/codemirror/CodeMirrorEditor");
const IconButton_1 = require("~/components/ui/IconButton");
const PanelHeader_1 = require("~/components/ui/PanelHeader");
const PanelHeaderButton_1 = require("~/components/ui/PanelHeaderButton");
const hooks_1 = require("~/lib/hooks");
const theme_1 = require("~/lib/stores/theme");
const workbench_1 = require("~/lib/stores/workbench");
const classNames_1 = require("~/utils/classNames");
const constants_1 = require("~/utils/constants");
const logger_1 = require("~/utils/logger");
const mobile_1 = require("~/utils/mobile");
const FileBreadcrumb_1 = require("./FileBreadcrumb");
const FileTree_1 = require("./FileTree");
const Terminal_1 = require("./terminal/Terminal");
const MAX_TERMINALS = 3;
const DEFAULT_TERMINAL_SIZE = 25;
const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;
const editorSettings = { tabSize: 2 };
exports.EditorPanel = (0, react_2.memo)(({ files, unsavedFiles, editorDocument, selectedFile, isStreaming, onFileSelect, onEditorChange, onEditorScroll, onFileSave, onFileReset, }) => {
    logger_1.renderLogger.trace('EditorPanel');
    const theme = (0, react_1.useStore)(theme_1.themeStore);
    const showTerminal = (0, react_1.useStore)(workbench_1.workbenchStore.showTerminal);
    const terminalRefs = (0, react_2.useRef)([]);
    const terminalPanelRef = (0, react_2.useRef)(null);
    const terminalToggledByShortcut = (0, react_2.useRef)(false);
    const [activeTerminal, setActiveTerminal] = (0, react_2.useState)(0);
    const [terminalCount, setTerminalCount] = (0, react_2.useState)(1);
    const activeFileSegments = (0, react_2.useMemo)(() => {
        if (!editorDocument) {
            return undefined;
        }
        return editorDocument.filePath.split('/');
    }, [editorDocument]);
    const activeFileUnsaved = (0, react_2.useMemo)(() => {
        return editorDocument !== undefined && (unsavedFiles === null || unsavedFiles === void 0 ? void 0 : unsavedFiles.has(editorDocument.filePath));
    }, [editorDocument, unsavedFiles]);
    (0, react_2.useEffect)(() => {
        const unsubscribeFromEventEmitter = hooks_1.shortcutEventEmitter.on('toggleTerminal', () => {
            terminalToggledByShortcut.current = true;
        });
        const unsubscribeFromThemeStore = theme_1.themeStore.subscribe(() => {
            for (const ref of Object.values(terminalRefs.current)) {
                ref === null || ref === void 0 ? void 0 : ref.reloadStyles();
            }
        });
        return () => {
            unsubscribeFromEventEmitter();
            unsubscribeFromThemeStore();
        };
    }, []);
    (0, react_2.useEffect)(() => {
        const { current: terminal } = terminalPanelRef;
        if (!terminal) {
            return;
        }
        const isCollapsed = terminal.isCollapsed();
        if (!showTerminal && !isCollapsed) {
            terminal.collapse();
        }
        else if (showTerminal && isCollapsed) {
            terminal.resize(DEFAULT_TERMINAL_SIZE);
        }
        terminalToggledByShortcut.current = false;
    }, [showTerminal]);
    const addTerminal = () => {
        if (terminalCount < MAX_TERMINALS) {
            setTerminalCount(terminalCount + 1);
            setActiveTerminal(terminalCount);
        }
    };
    return (<react_resizable_panels_1.PanelGroup direction="vertical">
        <react_resizable_panels_1.Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <react_resizable_panels_1.PanelGroup direction="horizontal">
            <react_resizable_panels_1.Panel defaultSize={20} minSize={10} collapsible>
              <div className="flex flex-col border-r border-bolt-elements-borderColor h-full">
                <PanelHeader_1.PanelHeader>
                  <div className="i-ph:tree-structure-duotone shrink-0"/>
                  Files
                </PanelHeader_1.PanelHeader>
                <FileTree_1.FileTree className="h-full" files={files} hideRoot unsavedFiles={unsavedFiles} rootFolder={constants_1.WORK_DIR} selectedFile={selectedFile} onFileSelect={onFileSelect}/>
              </div>
            </react_resizable_panels_1.Panel>
            <react_resizable_panels_1.PanelResizeHandle />
            <react_resizable_panels_1.Panel className="flex flex-col" defaultSize={80} minSize={20}>
              <PanelHeader_1.PanelHeader className="overflow-x-auto">
                {(activeFileSegments === null || activeFileSegments === void 0 ? void 0 : activeFileSegments.length) && (<div className="flex items-center flex-1 text-sm">
                    <FileBreadcrumb_1.FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect}/>
                    {activeFileUnsaved && (<div className="flex gap-1 ml-auto -mr-1.5">
                        <PanelHeaderButton_1.PanelHeaderButton onClick={onFileSave}>
                          <div className="i-ph:floppy-disk-duotone"/>
                          Save
                        </PanelHeaderButton_1.PanelHeaderButton>
                        <PanelHeaderButton_1.PanelHeaderButton onClick={onFileReset}>
                          <div className="i-ph:clock-counter-clockwise-duotone"/>
                          Reset
                        </PanelHeaderButton_1.PanelHeaderButton>
                      </div>)}
                  </div>)}
              </PanelHeader_1.PanelHeader>
              <div className="h-full flex-1 overflow-hidden">
                <CodeMirrorEditor_1.CodeMirrorEditor theme={theme} editable={!isStreaming && editorDocument !== undefined} settings={editorSettings} doc={editorDocument} autoFocusOnDocumentChange={!(0, mobile_1.isMobile)()} onScroll={onEditorScroll} onChange={onEditorChange} onSave={onFileSave}/>
              </div>
            </react_resizable_panels_1.Panel>
          </react_resizable_panels_1.PanelGroup>
        </react_resizable_panels_1.Panel>
        <react_resizable_panels_1.PanelResizeHandle />
        <react_resizable_panels_1.Panel ref={terminalPanelRef} defaultSize={showTerminal ? DEFAULT_TERMINAL_SIZE : 0} minSize={10} collapsible onExpand={() => {
            if (!terminalToggledByShortcut.current) {
                workbench_1.workbenchStore.toggleTerminal(true);
            }
        }} onCollapse={() => {
            if (!terminalToggledByShortcut.current) {
                workbench_1.workbenchStore.toggleTerminal(false);
            }
        }}>
          <div className="h-full">
            <div className="bg-bolt-elements-terminals-background h-full flex flex-col">
              <div className="flex items-center bg-bolt-elements-background-depth-2 border-y border-bolt-elements-borderColor gap-1.5 min-h-[34px] p-2">
                {Array.from({ length: terminalCount }, (_, index) => {
            const isActive = activeTerminal === index;
            return (<button key={index} className={(0, classNames_1.classNames)('flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full', {
                    'bg-bolt-elements-terminals-buttonBackground text-bolt-elements-textPrimary': isActive,
                    'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-terminals-buttonBackground': !isActive,
                })} onClick={() => setActiveTerminal(index)}>
                      <div className="i-ph:terminal-window-duotone text-lg"/>
                      Terminal {terminalCount > 1 && index + 1}
                    </button>);
        })}
                {terminalCount < MAX_TERMINALS && <IconButton_1.IconButton icon="i-ph:plus" size="md" onClick={addTerminal}/>}
                <IconButton_1.IconButton className="ml-auto" icon="i-ph:caret-down" title="Close" size="md" onClick={() => workbench_1.workbenchStore.toggleTerminal(false)}/>
              </div>
              {Array.from({ length: terminalCount }, (_, index) => {
            const isActive = activeTerminal === index;
            return (<Terminal_1.Terminal key={index} className={(0, classNames_1.classNames)('h-full overflow-hidden', {
                    hidden: !isActive,
                })} ref={(ref) => {
                    terminalRefs.current.push(ref);
                }} onTerminalReady={(terminal) => workbench_1.workbenchStore.attachTerminal(terminal)} onTerminalResize={(cols, rows) => workbench_1.workbenchStore.onTerminalResize(cols, rows)} theme={theme}/>);
        })}
            </div>
          </div>
        </react_resizable_panels_1.Panel>
      </react_resizable_panels_1.PanelGroup>);
});
