"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingDots = void 0;
const react_1 = require("react");
exports.LoadingDots = (0, react_1.memo)(({ text }) => {
    const [dotCount, setDotCount] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setDotCount((prevDotCount) => (prevDotCount + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return (<div className="flex justify-center items-center h-full">
      <div className="relative">
        <span>{text}</span>
        <span className="absolute left-[calc(100%-12px)]">{'.'.repeat(dotCount)}</span>
        <span className="invisible">...</span>
      </div>
    </div>);
});
