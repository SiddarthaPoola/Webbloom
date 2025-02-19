"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTree = void 0;
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
const logger_1 = require("~/utils/logger");
const logger = (0, logger_1.createScopedLogger)('FileTree');
const NODE_PADDING_LEFT = 8;
const DEFAULT_HIDDEN_FILES = [/\/node_modules\//, /\/\.next/, /\/\.astro/];
exports.FileTree = (0, react_1.memo)(({ files = {}, onFileSelect, selectedFile, rootFolder, hideRoot = false, collapsed = false, allowFolderSelection = false, hiddenFiles, className, unsavedFiles, }) => {
    logger_1.renderLogger.trace('FileTree');
    const computedHiddenFiles = (0, react_1.useMemo)(() => [...DEFAULT_HIDDEN_FILES, ...(hiddenFiles !== null && hiddenFiles !== void 0 ? hiddenFiles : [])], [hiddenFiles]);
    const fileList = (0, react_1.useMemo)(() => {
        return buildFileList(files, rootFolder, hideRoot, computedHiddenFiles);
    }, [files, rootFolder, hideRoot, computedHiddenFiles]);
    const [collapsedFolders, setCollapsedFolders] = (0, react_1.useState)(() => {
        return collapsed
            ? new Set(fileList.filter((item) => item.kind === 'folder').map((item) => item.fullPath))
            : new Set();
    });
    (0, react_1.useEffect)(() => {
        if (collapsed) {
            setCollapsedFolders(new Set(fileList.filter((item) => item.kind === 'folder').map((item) => item.fullPath)));
            return;
        }
        setCollapsedFolders((prevCollapsed) => {
            const newCollapsed = new Set();
            for (const folder of fileList) {
                if (folder.kind === 'folder' && prevCollapsed.has(folder.fullPath)) {
                    newCollapsed.add(folder.fullPath);
                }
            }
            return newCollapsed;
        });
    }, [fileList, collapsed]);
    const filteredFileList = (0, react_1.useMemo)(() => {
        const list = [];
        let lastDepth = Number.MAX_SAFE_INTEGER;
        for (const fileOrFolder of fileList) {
            const depth = fileOrFolder.depth;
            // if the depth is equal we reached the end of the collaped group
            if (lastDepth === depth) {
                lastDepth = Number.MAX_SAFE_INTEGER;
            }
            // ignore collapsed folders
            if (collapsedFolders.has(fileOrFolder.fullPath)) {
                lastDepth = Math.min(lastDepth, depth);
            }
            // ignore files and folders below the last collapsed folder
            if (lastDepth < depth) {
                continue;
            }
            list.push(fileOrFolder);
        }
        return list;
    }, [fileList, collapsedFolders]);
    const toggleCollapseState = (fullPath) => {
        setCollapsedFolders((prevSet) => {
            const newSet = new Set(prevSet);
            if (newSet.has(fullPath)) {
                newSet.delete(fullPath);
            }
            else {
                newSet.add(fullPath);
            }
            return newSet;
        });
    };
    return (<div className={(0, classNames_1.classNames)('text-sm', className)}>
        {filteredFileList.map((fileOrFolder) => {
            switch (fileOrFolder.kind) {
                case 'file': {
                    return (<File key={fileOrFolder.id} selected={selectedFile === fileOrFolder.fullPath} file={fileOrFolder} unsavedChanges={unsavedFiles === null || unsavedFiles === void 0 ? void 0 : unsavedFiles.has(fileOrFolder.fullPath)} onClick={() => {
                            onFileSelect === null || onFileSelect === void 0 ? void 0 : onFileSelect(fileOrFolder.fullPath);
                        }}/>);
                }
                case 'folder': {
                    return (<Folder key={fileOrFolder.id} folder={fileOrFolder} selected={allowFolderSelection && selectedFile === fileOrFolder.fullPath} collapsed={collapsedFolders.has(fileOrFolder.fullPath)} onClick={() => {
                            toggleCollapseState(fileOrFolder.fullPath);
                        }}/>);
                }
                default: {
                    return undefined;
                }
            }
        })}
      </div>);
});
exports.default = exports.FileTree;
function Folder({ folder: { depth, name }, collapsed, selected = false, onClick }) {
    return (<NodeButton className={(0, classNames_1.classNames)('group', {
            'bg-transparent text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive hover:bg-bolt-elements-item-backgroundActive': !selected,
            'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': selected,
        })} depth={depth} iconClasses={(0, classNames_1.classNames)({
            'i-ph:caret-right scale-98': collapsed,
            'i-ph:caret-down scale-98': !collapsed,
        })} onClick={onClick}>
      {name}
    </NodeButton>);
}
function File({ file: { depth, name }, onClick, selected, unsavedChanges = false }) {
    return (<NodeButton className={(0, classNames_1.classNames)('group', {
            'bg-transparent hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-item-contentDefault': !selected,
            'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': selected,
        })} depth={depth} iconClasses={(0, classNames_1.classNames)('i-ph:file-duotone scale-98', {
            'group-hover:text-bolt-elements-item-contentActive': !selected,
        })} onClick={onClick}>
      <div className={(0, classNames_1.classNames)('flex items-center', {
            'group-hover:text-bolt-elements-item-contentActive': !selected,
        })}>
        <div className="flex-1 truncate pr-2">{name}</div>
        {unsavedChanges && <span className="i-ph:circle-fill scale-68 shrink-0 text-orange-500"/>}
      </div>
    </NodeButton>);
}
function NodeButton({ depth, iconClasses, onClick, className, children }) {
    return (<button className={(0, classNames_1.classNames)('flex items-center gap-1.5 w-full pr-2 border-2 border-transparent text-faded py-0.5', className)} style={{ paddingLeft: `${6 + depth * NODE_PADDING_LEFT}px` }} onClick={() => onClick === null || onClick === void 0 ? void 0 : onClick()}>
      <div className={(0, classNames_1.classNames)('scale-120 shrink-0', iconClasses)}></div>
      <div className="truncate w-full text-left">{children}</div>
    </button>);
}
function buildFileList(files, rootFolder = '/', hideRoot, hiddenFiles) {
    const folderPaths = new Set();
    const fileList = [];
    let defaultDepth = 0;
    if (rootFolder === '/' && !hideRoot) {
        defaultDepth = 1;
        fileList.push({ kind: 'folder', name: '/', depth: 0, id: 0, fullPath: '/' });
    }
    for (const [filePath, dirent] of Object.entries(files)) {
        const segments = filePath.split('/').filter((segment) => segment);
        const fileName = segments.at(-1);
        if (!fileName || isHiddenFile(filePath, fileName, hiddenFiles)) {
            continue;
        }
        let currentPath = '';
        let i = 0;
        let depth = 0;
        while (i < segments.length) {
            const name = segments[i];
            const fullPath = (currentPath += `/${name}`);
            if (!fullPath.startsWith(rootFolder) || (hideRoot && fullPath === rootFolder)) {
                i++;
                continue;
            }
            if (i === segments.length - 1 && (dirent === null || dirent === void 0 ? void 0 : dirent.type) === 'file') {
                fileList.push({
                    kind: 'file',
                    id: fileList.length,
                    name,
                    fullPath,
                    depth: depth + defaultDepth,
                });
            }
            else if (!folderPaths.has(fullPath)) {
                folderPaths.add(fullPath);
                fileList.push({
                    kind: 'folder',
                    id: fileList.length,
                    name,
                    fullPath,
                    depth: depth + defaultDepth,
                });
            }
            i++;
            depth++;
        }
    }
    return sortFileList(rootFolder, fileList, hideRoot);
}
function isHiddenFile(filePath, fileName, hiddenFiles) {
    return hiddenFiles.some((pathOrRegex) => {
        if (typeof pathOrRegex === 'string') {
            return fileName === pathOrRegex;
        }
        return pathOrRegex.test(filePath);
    });
}
/**
 * Sorts the given list of nodes into a tree structure (still a flat list).
 *
 * This function organizes the nodes into a hierarchical structure based on their paths,
 * with folders appearing before files and all items sorted alphabetically within their level.
 *
 * @note This function mutates the given `nodeList` array for performance reasons.
 *
 * @param rootFolder - The path of the root folder to start the sorting from.
 * @param nodeList - The list of nodes to be sorted.
 *
 * @returns A new array of nodes sorted in depth-first order.
 */
function sortFileList(rootFolder, nodeList, hideRoot) {
    var _a;
    logger.trace('sortFileList');
    const nodeMap = new Map();
    const childrenMap = new Map();
    // pre-sort nodes by name and type
    nodeList.sort((a, b) => compareNodes(a, b));
    for (const node of nodeList) {
        nodeMap.set(node.fullPath, node);
        const parentPath = node.fullPath.slice(0, node.fullPath.lastIndexOf('/'));
        if (parentPath !== rootFolder.slice(0, rootFolder.lastIndexOf('/'))) {
            if (!childrenMap.has(parentPath)) {
                childrenMap.set(parentPath, []);
            }
            (_a = childrenMap.get(parentPath)) === null || _a === void 0 ? void 0 : _a.push(node);
        }
    }
    const sortedList = [];
    const depthFirstTraversal = (path) => {
        const node = nodeMap.get(path);
        if (node) {
            sortedList.push(node);
        }
        const children = childrenMap.get(path);
        if (children) {
            for (const child of children) {
                if (child.kind === 'folder') {
                    depthFirstTraversal(child.fullPath);
                }
                else {
                    sortedList.push(child);
                }
            }
        }
    };
    if (hideRoot) {
        // if root is hidden, start traversal from its immediate children
        const rootChildren = childrenMap.get(rootFolder) || [];
        for (const child of rootChildren) {
            depthFirstTraversal(child.fullPath);
        }
    }
    else {
        depthFirstTraversal(rootFolder);
    }
    return sortedList;
}
function compareNodes(a, b) {
    if (a.kind !== b.kind) {
        return a.kind === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}
