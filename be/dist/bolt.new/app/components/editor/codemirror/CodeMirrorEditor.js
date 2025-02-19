"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeMirrorEditor = void 0;
const autocomplete_1 = require("@codemirror/autocomplete");
const commands_1 = require("@codemirror/commands");
const language_1 = require("@codemirror/language");
const search_1 = require("@codemirror/search");
const state_1 = require("@codemirror/state");
const view_1 = require("@codemirror/view");
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
const debounce_1 = require("~/utils/debounce");
const logger_1 = require("~/utils/logger");
const BinaryContent_1 = require("./BinaryContent");
const cm_theme_1 = require("./cm-theme");
const indent_1 = require("./indent");
const languages_1 = require("./languages");
const logger = (0, logger_1.createScopedLogger)('CodeMirrorEditor');
const readOnlyTooltipStateEffect = state_1.StateEffect.define();
const editableTooltipField = state_1.StateField.define({
    create: () => [],
    update(_tooltips, transaction) {
        if (!transaction.state.readOnly) {
            return [];
        }
        for (const effect of transaction.effects) {
            if (effect.is(readOnlyTooltipStateEffect) && effect.value) {
                return getReadOnlyTooltip(transaction.state);
            }
        }
        return [];
    },
    provide: (field) => {
        return view_1.showTooltip.computeN([field], (state) => state.field(field));
    },
});
const editableStateEffect = state_1.StateEffect.define();
const editableStateField = state_1.StateField.define({
    create() {
        return true;
    },
    update(value, transaction) {
        for (const effect of transaction.effects) {
            if (effect.is(editableStateEffect)) {
                return effect.value;
            }
        }
        return value;
    },
});
exports.CodeMirrorEditor = (0, react_1.memo)(({ id, doc, debounceScroll = 100, debounceChange = 150, autoFocusOnDocumentChange = false, editable = true, onScroll, onChange, onSave, theme, settings, className = '', }) => {
    logger_1.renderLogger.trace('CodeMirrorEditor');
    const [languageCompartment] = (0, react_1.useState)(new state_1.Compartment());
    const containerRef = (0, react_1.useRef)(null);
    const viewRef = (0, react_1.useRef)();
    const themeRef = (0, react_1.useRef)();
    const docRef = (0, react_1.useRef)();
    const editorStatesRef = (0, react_1.useRef)();
    const onScrollRef = (0, react_1.useRef)(onScroll);
    const onChangeRef = (0, react_1.useRef)(onChange);
    const onSaveRef = (0, react_1.useRef)(onSave);
    /**
     * This effect is used to avoid side effects directly in the render function
     * and instead the refs are updated after each render.
     */
    (0, react_1.useEffect)(() => {
        onScrollRef.current = onScroll;
        onChangeRef.current = onChange;
        onSaveRef.current = onSave;
        docRef.current = doc;
        themeRef.current = theme;
    });
    (0, react_1.useEffect)(() => {
        const onUpdate = (0, debounce_1.debounce)((update) => {
            var _a;
            (_a = onChangeRef.current) === null || _a === void 0 ? void 0 : _a.call(onChangeRef, update);
        }, debounceChange);
        const view = new view_1.EditorView({
            parent: containerRef.current,
            dispatchTransactions(transactions) {
                const previousSelection = view.state.selection;
                view.update(transactions);
                const newSelection = view.state.selection;
                const selectionChanged = newSelection !== previousSelection &&
                    (newSelection === undefined || previousSelection === undefined || !newSelection.eq(previousSelection));
                if (docRef.current && (transactions.some((transaction) => transaction.docChanged) || selectionChanged)) {
                    onUpdate({
                        selection: view.state.selection,
                        content: view.state.doc.toString(),
                    });
                    editorStatesRef.current.set(docRef.current.filePath, view.state);
                }
            },
        });
        viewRef.current = view;
        return () => {
            var _a;
            (_a = viewRef.current) === null || _a === void 0 ? void 0 : _a.destroy();
            viewRef.current = undefined;
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!viewRef.current) {
            return;
        }
        viewRef.current.dispatch({
            effects: [(0, cm_theme_1.reconfigureTheme)(theme)],
        });
    }, [theme]);
    (0, react_1.useEffect)(() => {
        editorStatesRef.current = new Map();
    }, [id]);
    (0, react_1.useEffect)(() => {
        const editorStates = editorStatesRef.current;
        const view = viewRef.current;
        const theme = themeRef.current;
        if (!doc) {
            const state = newEditorState('', theme, settings, onScrollRef, debounceScroll, onSaveRef, [
                languageCompartment.of([]),
            ]);
            view.setState(state);
            setNoDocument(view);
            return;
        }
        if (doc.isBinary) {
            return;
        }
        if (doc.filePath === '') {
            logger.warn('File path should not be empty');
        }
        let state = editorStates.get(doc.filePath);
        if (!state) {
            state = newEditorState(doc.value, theme, settings, onScrollRef, debounceScroll, onSaveRef, [
                languageCompartment.of([]),
            ]);
            editorStates.set(doc.filePath, state);
        }
        view.setState(state);
        setEditorDocument(view, theme, editable, languageCompartment, autoFocusOnDocumentChange, doc);
    }, [doc === null || doc === void 0 ? void 0 : doc.value, editable, doc === null || doc === void 0 ? void 0 : doc.filePath, autoFocusOnDocumentChange]);
    return (<div className={(0, classNames_1.classNames)('relative h-full', className)}>
        {(doc === null || doc === void 0 ? void 0 : doc.isBinary) && <BinaryContent_1.BinaryContent />}
        <div className="h-full overflow-hidden" ref={containerRef}/>
      </div>);
});
exports.default = exports.CodeMirrorEditor;
exports.CodeMirrorEditor.displayName = 'CodeMirrorEditor';
function newEditorState(content, theme, settings, onScrollRef, debounceScroll, onFileSaveRef, extensions) {
    var _a;
    return state_1.EditorState.create({
        doc: content,
        extensions: [
            view_1.EditorView.domEventHandlers({
                scroll: (0, debounce_1.debounce)((event, view) => {
                    var _a;
                    if (event.target !== view.scrollDOM) {
                        return;
                    }
                    (_a = onScrollRef.current) === null || _a === void 0 ? void 0 : _a.call(onScrollRef, { left: view.scrollDOM.scrollLeft, top: view.scrollDOM.scrollTop });
                }, debounceScroll),
                keydown: (event, view) => {
                    if (view.state.readOnly) {
                        view.dispatch({
                            effects: [readOnlyTooltipStateEffect.of(event.key !== 'Escape')],
                        });
                        return true;
                    }
                    return false;
                },
            }),
            (0, cm_theme_1.getTheme)(theme, settings),
            (0, commands_1.history)(),
            view_1.keymap.of([
                ...commands_1.defaultKeymap,
                ...commands_1.historyKeymap,
                ...search_1.searchKeymap,
                { key: 'Tab', run: autocomplete_1.acceptCompletion },
                {
                    key: 'Mod-s',
                    preventDefault: true,
                    run: () => {
                        var _a;
                        (_a = onFileSaveRef.current) === null || _a === void 0 ? void 0 : _a.call(onFileSaveRef);
                        return true;
                    },
                },
                indent_1.indentKeyBinding,
            ]),
            language_1.indentUnit.of('\t'),
            (0, autocomplete_1.autocompletion)({
                closeOnBlur: false,
            }),
            (0, view_1.tooltips)({
                position: 'absolute',
                parent: document.body,
                tooltipSpace: (view) => {
                    const rect = view.dom.getBoundingClientRect();
                    return {
                        top: rect.top - 50,
                        left: rect.left,
                        bottom: rect.bottom,
                        right: rect.right + 10,
                    };
                },
            }),
            (0, autocomplete_1.closeBrackets)(),
            (0, view_1.lineNumbers)(),
            (0, view_1.scrollPastEnd)(),
            (0, view_1.dropCursor)(),
            (0, view_1.drawSelection)(),
            (0, language_1.bracketMatching)(),
            state_1.EditorState.tabSize.of((_a = settings === null || settings === void 0 ? void 0 : settings.tabSize) !== null && _a !== void 0 ? _a : 2),
            (0, language_1.indentOnInput)(),
            editableTooltipField,
            editableStateField,
            state_1.EditorState.readOnly.from(editableStateField, (editable) => !editable),
            (0, view_1.highlightActiveLineGutter)(),
            (0, view_1.highlightActiveLine)(),
            (0, language_1.foldGutter)({
                markerDOM: (open) => {
                    const icon = document.createElement('div');
                    icon.className = `fold-icon ${open ? 'i-ph-caret-down-bold' : 'i-ph-caret-right-bold'}`;
                    return icon;
                },
            }),
            ...extensions,
        ],
    });
}
function setNoDocument(view) {
    view.dispatch({
        selection: { anchor: 0 },
        changes: {
            from: 0,
            to: view.state.doc.length,
            insert: '',
        },
    });
    view.scrollDOM.scrollTo(0, 0);
}
function setEditorDocument(view, theme, editable, languageCompartment, autoFocus, doc) {
    if (doc.value !== view.state.doc.toString()) {
        view.dispatch({
            selection: { anchor: 0 },
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: doc.value,
            },
        });
    }
    view.dispatch({
        effects: [editableStateEffect.of(editable && !doc.isBinary)],
    });
    (0, languages_1.getLanguage)(doc.filePath).then((languageSupport) => {
        if (!languageSupport) {
            return;
        }
        view.dispatch({
            effects: [languageCompartment.reconfigure([languageSupport]), (0, cm_theme_1.reconfigureTheme)(theme)],
        });
        requestAnimationFrame(() => {
            var _a, _b, _c, _d;
            const currentLeft = view.scrollDOM.scrollLeft;
            const currentTop = view.scrollDOM.scrollTop;
            const newLeft = (_b = (_a = doc.scroll) === null || _a === void 0 ? void 0 : _a.left) !== null && _b !== void 0 ? _b : 0;
            const newTop = (_d = (_c = doc.scroll) === null || _c === void 0 ? void 0 : _c.top) !== null && _d !== void 0 ? _d : 0;
            const needsScrolling = currentLeft !== newLeft || currentTop !== newTop;
            if (autoFocus && editable) {
                if (needsScrolling) {
                    // we have to wait until the scroll position was changed before we can set the focus
                    view.scrollDOM.addEventListener('scroll', () => {
                        view.focus();
                    }, { once: true });
                }
                else {
                    // if the scroll position is still the same we can focus immediately
                    view.focus();
                }
            }
            view.scrollDOM.scrollTo(newLeft, newTop);
        });
    });
}
function getReadOnlyTooltip(state) {
    if (!state.readOnly) {
        return [];
    }
    return state.selection.ranges
        .filter((range) => {
        return range.empty;
    })
        .map((range) => {
        return {
            pos: range.head,
            above: true,
            strictSide: true,
            arrow: true,
            create: () => {
                const divElement = document.createElement('div');
                divElement.className = 'cm-readonly-tooltip';
                divElement.textContent = 'Cannot edit file while AI response is being generated';
                return { dom: divElement };
            },
        };
    });
}
