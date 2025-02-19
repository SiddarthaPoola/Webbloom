"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const classNames_1 = require("~/utils/classNames");
const easings_1 = require("~/utils/easings");
const react_2 = require("~/utils/react");
exports.Slider = (0, react_2.genericMemo)(({ selected, options, setSelected }) => {
    const isLeftSelected = selected === options.left.value;
    return (<div className="flex items-center flex-wrap shrink-0 gap-1 bg-bolt-elements-background-depth-1 overflow-hidden rounded-full p-1">
      <SliderButton selected={isLeftSelected} setSelected={() => setSelected === null || setSelected === void 0 ? void 0 : setSelected(options.left.value)}>
        {options.left.text}
      </SliderButton>
      <SliderButton selected={!isLeftSelected} setSelected={() => setSelected === null || setSelected === void 0 ? void 0 : setSelected(options.right.value)}>
        {options.right.text}
      </SliderButton>
    </div>);
});
const SliderButton = (0, react_1.memo)(({ selected, children, setSelected }) => {
    return (<button onClick={setSelected} className={(0, classNames_1.classNames)('bg-transparent text-sm px-2.5 py-0.5 rounded-full relative', selected
            ? 'text-bolt-elements-item-contentAccent'
            : 'text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive')}>
      <span className="relative z-10">{children}</span>
      {selected && (<framer_motion_1.motion.span layoutId="pill-tab" transition={{ duration: 0.2, ease: easings_1.cubicEasingFn }} className="absolute inset-0 z-0 bg-bolt-elements-item-backgroundAccent rounded-full"></framer_motion_1.motion.span>)}
    </button>);
});
