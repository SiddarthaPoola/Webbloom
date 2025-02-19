"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSnapScroll = useSnapScroll;
const react_1 = require("react");
function useSnapScroll() {
    const autoScrollRef = (0, react_1.useRef)(true);
    const scrollNodeRef = (0, react_1.useRef)();
    const onScrollRef = (0, react_1.useRef)();
    const observerRef = (0, react_1.useRef)();
    const messageRef = (0, react_1.useCallback)((node) => {
        var _a;
        if (node) {
            const observer = new ResizeObserver(() => {
                if (autoScrollRef.current && scrollNodeRef.current) {
                    const { scrollHeight, clientHeight } = scrollNodeRef.current;
                    const scrollTarget = scrollHeight - clientHeight;
                    scrollNodeRef.current.scrollTo({
                        top: scrollTarget,
                    });
                }
            });
            observer.observe(node);
        }
        else {
            (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.disconnect();
            observerRef.current = undefined;
        }
    }, []);
    const scrollRef = (0, react_1.useCallback)((node) => {
        var _a;
        if (node) {
            onScrollRef.current = () => {
                const { scrollTop, scrollHeight, clientHeight } = node;
                const scrollTarget = scrollHeight - clientHeight;
                autoScrollRef.current = Math.abs(scrollTop - scrollTarget) <= 10;
            };
            node.addEventListener('scroll', onScrollRef.current);
            scrollNodeRef.current = node;
        }
        else {
            if (onScrollRef.current) {
                (_a = scrollNodeRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('scroll', onScrollRef.current);
            }
            scrollNodeRef.current = undefined;
            onScrollRef.current = undefined;
        }
    }, []);
    return [messageRef, scrollRef];
}
