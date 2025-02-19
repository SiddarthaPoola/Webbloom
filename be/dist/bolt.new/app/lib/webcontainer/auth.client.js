"use strict";
/**
 * This client-only module that contains everything related to auth and is used
 * to avoid importing `@webcontainer/api` in the server bundle.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var api_1 = require("@webcontainer/api");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return api_1.auth; } });
