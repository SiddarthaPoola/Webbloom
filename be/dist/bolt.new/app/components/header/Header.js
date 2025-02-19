"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
const react_1 = require("@nanostores/react");
const client_only_1 = require("remix-utils/client-only");
const chat_1 = require("~/lib/stores/chat");
const classNames_1 = require("~/utils/classNames");
const HeaderActionButtons_client_1 = require("./HeaderActionButtons.client");
const ChatDescription_client_1 = require("~/lib/persistence/ChatDescription.client");
function Header() {
    const chat = (0, react_1.useStore)(chat_1.chatStore);
    return (<header className={(0, classNames_1.classNames)('flex items-center bg-bolt-elements-background-depth-1 p-5 border-b h-[var(--header-height)]', {
            'border-transparent': !chat.started,
            'border-bolt-elements-borderColor': chat.started,
        })}>
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl"/>
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <span className="i-bolt:logo-text?mask w-[46px] inline-block"/>
        </a>
      </div>
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <client_only_1.ClientOnly>{() => <ChatDescription_client_1.ChatDescription />}</client_only_1.ClientOnly>
      </span>
      {chat.started && (<client_only_1.ClientOnly>
          {() => (<div className="mr-1">
              <HeaderActionButtons_client_1.HeaderActionButtons />
            </div>)}
        </client_only_1.ClientOnly>)}
    </header>);
}
