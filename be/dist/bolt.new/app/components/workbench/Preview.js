"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preview = void 0;
const react_1 = require("@nanostores/react");
const react_2 = require("react");
const IconButton_1 = require("~/components/ui/IconButton");
const workbench_1 = require("~/lib/stores/workbench");
const PortDropdown_1 = require("./PortDropdown");
exports.Preview = (0, react_2.memo)(() => {
    const iframeRef = (0, react_2.useRef)(null);
    const inputRef = (0, react_2.useRef)(null);
    const [activePreviewIndex, setActivePreviewIndex] = (0, react_2.useState)(0);
    const [isPortDropdownOpen, setIsPortDropdownOpen] = (0, react_2.useState)(false);
    const hasSelectedPreview = (0, react_2.useRef)(false);
    const previews = (0, react_1.useStore)(workbench_1.workbenchStore.previews);
    const activePreview = previews[activePreviewIndex];
    const [url, setUrl] = (0, react_2.useState)('');
    const [iframeUrl, setIframeUrl] = (0, react_2.useState)();
    (0, react_2.useEffect)(() => {
        if (!activePreview) {
            setUrl('');
            setIframeUrl(undefined);
            return;
        }
        const { baseUrl } = activePreview;
        setUrl(baseUrl);
        setIframeUrl(baseUrl);
    }, [activePreview, iframeUrl]);
    const validateUrl = (0, react_2.useCallback)((value) => {
        if (!activePreview) {
            return false;
        }
        const { baseUrl } = activePreview;
        if (value === baseUrl) {
            return true;
        }
        else if (value.startsWith(baseUrl)) {
            return ['/', '?', '#'].includes(value.charAt(baseUrl.length));
        }
        return false;
    }, [activePreview]);
    const findMinPortIndex = (0, react_2.useCallback)((minIndex, preview, index, array) => {
        return preview.port < array[minIndex].port ? index : minIndex;
    }, []);
    // when previews change, display the lowest port if user hasn't selected a preview
    (0, react_2.useEffect)(() => {
        if (previews.length > 1 && !hasSelectedPreview.current) {
            const minPortIndex = previews.reduce(findMinPortIndex, 0);
            setActivePreviewIndex(minPortIndex);
        }
    }, [previews]);
    const reloadPreview = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };
    return (<div className="w-full h-full flex flex-col">
      {isPortDropdownOpen && (<div className="z-iframe-overlay w-full h-full absolute" onClick={() => setIsPortDropdownOpen(false)}/>)}
      <div className="bg-bolt-elements-background-depth-2 p-2 flex items-center gap-1.5">
        <IconButton_1.IconButton icon="i-ph:arrow-clockwise" onClick={reloadPreview}/>
        <div className="flex items-center gap-1 flex-grow bg-bolt-elements-preview-addressBar-background border border-bolt-elements-borderColor text-bolt-elements-preview-addressBar-text rounded-full px-3 py-1 text-sm hover:bg-bolt-elements-preview-addressBar-backgroundHover hover:focus-within:bg-bolt-elements-preview-addressBar-backgroundActive focus-within:bg-bolt-elements-preview-addressBar-backgroundActive
        focus-within-border-bolt-elements-borderColorActive focus-within:text-bolt-elements-preview-addressBar-textActive">
          <input ref={inputRef} className="w-full bg-transparent outline-none" type="text" value={url} onChange={(event) => {
            setUrl(event.target.value);
        }} onKeyDown={(event) => {
            if (event.key === 'Enter' && validateUrl(url)) {
                setIframeUrl(url);
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            }
        }}/>
        </div>
        {previews.length > 1 && (<PortDropdown_1.PortDropdown activePreviewIndex={activePreviewIndex} setActivePreviewIndex={setActivePreviewIndex} isDropdownOpen={isPortDropdownOpen} setHasSelectedPreview={(value) => (hasSelectedPreview.current = value)} setIsDropdownOpen={setIsPortDropdownOpen} previews={previews}/>)}
      </div>
      <div className="flex-1 border-t border-bolt-elements-borderColor">
        {activePreview ? (<iframe ref={iframeRef} className="border-none w-full h-full bg-white" src={iframeUrl}/>) : (<div className="flex w-full h-full justify-center items-center bg-white">No preview available</div>)}
      </div>
    </div>);
});
