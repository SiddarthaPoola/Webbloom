"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendButton = SendButton;
const framer_motion_1 = require("framer-motion");
const customEasingFn = (0, framer_motion_1.cubicBezier)(0.4, 0, 0.2, 1);
function SendButton({ show, isStreaming, onClick }) {
    return (<framer_motion_1.AnimatePresence>
      {show ? (<framer_motion_1.motion.button className="absolute flex justify-center items-center top-[18px] right-[22px] p-1 bg-accent-500 hover:brightness-94 color-white rounded-md w-[34px] h-[34px] transition-theme" transition={{ ease: customEasingFn, duration: 0.17 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={(event) => {
                event.preventDefault();
                onClick === null || onClick === void 0 ? void 0 : onClick(event);
            }}>
          <div className="text-lg">
            {!isStreaming ? <div className="i-ph:arrow-right"></div> : <div className="i-ph:stop-circle-bold"></div>}
          </div>
        </framer_motion_1.motion.button>) : null}
    </framer_motion_1.AnimatePresence>);
}
