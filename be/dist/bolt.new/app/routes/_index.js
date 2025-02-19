"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = exports.meta = void 0;
exports.default = Index;
const cloudflare_1 = require("@remix-run/cloudflare");
const client_only_1 = require("remix-utils/client-only");
const BaseChat_1 = require("~/components/chat/BaseChat");
const Chat_client_1 = require("~/components/chat/Chat.client");
const Header_1 = require("~/components/header/Header");
const meta = () => {
    return [{ title: 'Bolt' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};
exports.meta = meta;
const loader = () => (0, cloudflare_1.json)({});
exports.loader = loader;
function Index() {
    return (<div className="flex flex-col h-full w-full">
      <Header_1.Header />
      <client_only_1.ClientOnly fallback={<BaseChat_1.BaseChat />}>{() => <Chat_client_1.Chat />}</client_only_1.ClientOnly>
    </div>);
}
