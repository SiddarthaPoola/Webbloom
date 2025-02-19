"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terminal = void 0;
const addon_fit_1 = require("@xterm/addon-fit");
const addon_web_links_1 = require("@xterm/addon-web-links");
const xterm_1 = require("@xterm/xterm");
const react_1 = require("react");
const logger_1 = require("~/utils/logger");
const theme_1 = require("./theme");
const logger = (0, logger_1.createScopedLogger)('Terminal');
exports.Terminal = (0, react_1.memo)((0, react_1.forwardRef)(({ className, theme, readonly, onTerminalReady, onTerminalResize }, ref) => {
    const terminalElementRef = (0, react_1.useRef)(null);
    const terminalRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const element = terminalElementRef.current;
        const fitAddon = new addon_fit_1.FitAddon();
        const webLinksAddon = new addon_web_links_1.WebLinksAddon();
        const terminal = new xterm_1.Terminal({
            cursorBlink: true,
            convertEol: true,
            disableStdin: readonly,
            theme: (0, theme_1.getTerminalTheme)(readonly ? { cursor: '#00000000' } : {}),
            fontSize: 12,
            fontFamily: 'Menlo, courier-new, courier, monospace',
        });
        terminalRef.current = terminal;
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);
        terminal.open(element);
        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
            onTerminalResize === null || onTerminalResize === void 0 ? void 0 : onTerminalResize(terminal.cols, terminal.rows);
        });
        resizeObserver.observe(element);
        logger.info('Attach terminal');
        onTerminalReady === null || onTerminalReady === void 0 ? void 0 : onTerminalReady(terminal);
        return () => {
            resizeObserver.disconnect();
            terminal.dispose();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        const terminal = terminalRef.current;
        // we render a transparent cursor in case the terminal is readonly
        terminal.options.theme = (0, theme_1.getTerminalTheme)(readonly ? { cursor: '#00000000' } : {});
        terminal.options.disableStdin = readonly;
    }, [theme, readonly]);
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            reloadStyles: () => {
                const terminal = terminalRef.current;
                terminal.options.theme = (0, theme_1.getTerminalTheme)(readonly ? { cursor: '#00000000' } : {});
            },
        };
    }, []);
    return <div className={className} ref={terminalElementRef}/>;
}));
