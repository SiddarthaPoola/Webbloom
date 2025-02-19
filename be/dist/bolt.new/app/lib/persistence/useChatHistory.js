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
exports.description = exports.chatId = exports.db = void 0;
exports.useChatHistory = useChatHistory;
const react_1 = require("@remix-run/react");
const react_2 = require("react");
const nanostores_1 = require("nanostores");
const react_toastify_1 = require("react-toastify");
const workbench_1 = require("~/lib/stores/workbench");
const db_1 = require("./db");
const persistenceEnabled = !import.meta.env.VITE_DISABLE_PERSISTENCE;
exports.db = persistenceEnabled ? await (0, db_1.openDatabase)() : undefined;
exports.chatId = (0, nanostores_1.atom)(undefined);
exports.description = (0, nanostores_1.atom)(undefined);
function useChatHistory() {
    const navigate = (0, react_1.useNavigate)();
    const { id: mixedId } = (0, react_1.useLoaderData)();
    const [initialMessages, setInitialMessages] = (0, react_2.useState)([]);
    const [ready, setReady] = (0, react_2.useState)(false);
    const [urlId, setUrlId] = (0, react_2.useState)();
    (0, react_2.useEffect)(() => {
        if (!exports.db) {
            setReady(true);
            if (persistenceEnabled) {
                react_toastify_1.toast.error(`Chat persistence is unavailable`);
            }
            return;
        }
        if (mixedId) {
            (0, db_1.getMessages)(exports.db, mixedId)
                .then((storedMessages) => {
                if (storedMessages && storedMessages.messages.length > 0) {
                    setInitialMessages(storedMessages.messages);
                    setUrlId(storedMessages.urlId);
                    exports.description.set(storedMessages.description);
                    exports.chatId.set(storedMessages.id);
                }
                else {
                    navigate(`/`, { replace: true });
                }
                setReady(true);
            })
                .catch((error) => {
                react_toastify_1.toast.error(error.message);
            });
        }
    }, []);
    return {
        ready: !mixedId || ready,
        initialMessages,
        storeMessageHistory: (messages) => __awaiter(this, void 0, void 0, function* () {
            if (!exports.db || messages.length === 0) {
                return;
            }
            const { firstArtifact } = workbench_1.workbenchStore;
            if (!urlId && (firstArtifact === null || firstArtifact === void 0 ? void 0 : firstArtifact.id)) {
                const urlId = yield (0, db_1.getUrlId)(exports.db, firstArtifact.id);
                navigateChat(urlId);
                setUrlId(urlId);
            }
            if (!exports.description.get() && (firstArtifact === null || firstArtifact === void 0 ? void 0 : firstArtifact.title)) {
                exports.description.set(firstArtifact === null || firstArtifact === void 0 ? void 0 : firstArtifact.title);
            }
            if (initialMessages.length === 0 && !exports.chatId.get()) {
                const nextId = yield (0, db_1.getNextId)(exports.db);
                exports.chatId.set(nextId);
                if (!urlId) {
                    navigateChat(nextId);
                }
            }
            yield (0, db_1.setMessages)(exports.db, exports.chatId.get(), messages, urlId, exports.description.get());
        }),
    };
}
function navigateChat(nextId) {
    /**
     * FIXME: Using the intended navigate function causes a rerender for <Chat /> that breaks the app.
     *
     * `navigate(`/chat/${nextId}`, { replace: true });`
     */
    const url = new URL(window.location.href);
    url.pathname = `/chat/${nextId}`;
    window.history.replaceState({}, '', url);
}
