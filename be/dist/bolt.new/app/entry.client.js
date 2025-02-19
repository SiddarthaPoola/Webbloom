"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remix-run/react");
const react_2 = require("react");
const client_1 = require("react-dom/client");
(0, react_2.startTransition)(() => {
    (0, client_1.hydrateRoot)(document.getElementById('root'), <react_1.RemixBrowser />);
});
