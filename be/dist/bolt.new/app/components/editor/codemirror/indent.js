"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indentKeyBinding = void 0;
const commands_1 = require("@codemirror/commands");
const language_1 = require("@codemirror/language");
const state_1 = require("@codemirror/state");
exports.indentKeyBinding = {
    key: 'Tab',
    run: indentMore,
    shift: commands_1.indentLess,
};
function indentMore({ state, dispatch }) {
    if (state.readOnly) {
        return false;
    }
    dispatch(state.update(changeBySelectedLine(state, (from, to, changes) => {
        changes.push({ from, to, insert: state.facet(language_1.indentUnit) });
    }), { userEvent: 'input.indent' }));
    return true;
}
function changeBySelectedLine(state, cb) {
    return state.changeByRange((range) => {
        const changes = [];
        const line = state.doc.lineAt(range.from);
        // just insert single indent unit at the current cursor position
        if (range.from === range.to) {
            cb(range.from, undefined, changes, line);
        }
        // handle the case when multiple characters are selected in a single line
        else if (range.from < range.to && range.to <= line.to) {
            cb(range.from, range.to, changes, line);
        }
        else {
            let atLine = -1;
            // handle the case when selection spans multiple lines
            for (let pos = range.from; pos <= range.to;) {
                const line = state.doc.lineAt(pos);
                if (line.number > atLine && (range.empty || range.to > line.from)) {
                    cb(line.from, undefined, changes, line);
                    atLine = line.number;
                }
                pos = line.to + 1;
            }
        }
        const changeSet = state.changes(changes);
        return {
            changes,
            range: state_1.EditorSelection.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1)),
        };
    });
}
