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
exports.openDatabase = openDatabase;
exports.getAll = getAll;
exports.setMessages = setMessages;
exports.getMessages = getMessages;
exports.getMessagesByUrlId = getMessagesByUrlId;
exports.getMessagesById = getMessagesById;
exports.deleteById = deleteById;
exports.getNextId = getNextId;
exports.getUrlId = getUrlId;
const logger_1 = require("~/utils/logger");
const logger = (0, logger_1.createScopedLogger)('ChatHistory');
// this is used at the top level and never rejects
function openDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const request = indexedDB.open('boltHistory', 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('chats')) {
                    const store = db.createObjectStore('chats', { keyPath: 'id' });
                    store.createIndex('id', 'id', { unique: true });
                    store.createIndex('urlId', 'urlId', { unique: true });
                }
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = (event) => {
                resolve(undefined);
                logger.error(event.target.error);
            };
        });
    });
}
function getAll(db) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}
function setMessages(db, id, messages, urlId, description) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.put({
                id,
                messages,
                urlId,
                description,
                timestamp: new Date().toISOString(),
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    });
}
function getMessages(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getMessagesById(db, id)) || (yield getMessagesByUrlId(db, id));
    });
}
function getMessagesByUrlId(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const index = store.index('urlId');
            const request = index.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}
function getMessagesById(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}
function deleteById(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.delete(id);
            request.onsuccess = () => resolve(undefined);
            request.onerror = () => reject(request.error);
        });
    });
}
function getNextId(db) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const request = store.getAllKeys();
            request.onsuccess = () => {
                const highestId = request.result.reduce((cur, acc) => Math.max(+cur, +acc), 0);
                resolve(String(+highestId + 1));
            };
            request.onerror = () => reject(request.error);
        });
    });
}
function getUrlId(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const idList = yield getUrlIds(db);
        if (!idList.includes(id)) {
            return id;
        }
        else {
            let i = 2;
            while (idList.includes(`${id}-${i}`)) {
                i++;
            }
            return `${id}-${i}`;
        }
    });
}
function getUrlIds(db) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const idList = [];
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    idList.push(cursor.value.urlId);
                    cursor.continue();
                }
                else {
                    resolve(idList);
                }
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    });
}
