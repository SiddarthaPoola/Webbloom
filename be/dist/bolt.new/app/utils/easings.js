"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cubicEasingFn = void 0;
const framer_motion_1 = require("framer-motion");
exports.cubicEasingFn = (0, framer_motion_1.cubicBezier)(0.4, 0, 0.2, 1);
