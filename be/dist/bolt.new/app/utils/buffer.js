"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferWatchEvents = bufferWatchEvents;
function bufferWatchEvents(timeInMs, cb) {
    let timeoutId;
    let events = [];
    // keep track of the processing of the previous batch so we can wait for it
    let processing = Promise.resolve();
    const scheduleBufferTick = () => {
        timeoutId = self.setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            // we wait until the previous batch is entirely processed so events are processed in order
            yield processing;
            if (events.length > 0) {
                processing = Promise.resolve(cb(events));
            }
            timeoutId = undefined;
            events = [];
        }), timeInMs);
    };
    return (...args) => {
        events.push(args);
        if (!timeoutId) {
            scheduleBufferTick();
        }
    };
}
