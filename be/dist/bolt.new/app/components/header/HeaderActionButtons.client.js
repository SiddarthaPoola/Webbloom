"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderActionButtons = HeaderActionButtons;
const react_1 = require("@nanostores/react");
const chat_1 = require("~/lib/stores/chat");
const workbench_1 = require("~/lib/stores/workbench");
const classNames_1 = require("~/utils/classNames");
function HeaderActionButtons({}) {
    const showWorkbench = (0, react_1.useStore)(workbench_1.workbenchStore.showWorkbench);
    const { showChat } = (0, react_1.useStore)(chat_1.chatStore);
    const canHideChat = showWorkbench || !showChat;
    return (<div className="flex">
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button active={showChat} disabled={!canHideChat} onClick={() => {
            if (canHideChat) {
                chat_1.chatStore.setKey('showChat', !showChat);
            }
        }}>
          <div className="i-bolt:chat text-sm"/>
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor"/>
        <Button active={showWorkbench} onClick={() => {
            if (showWorkbench && !showChat) {
                chat_1.chatStore.setKey('showChat', true);
            }
            workbench_1.workbenchStore.showWorkbench.set(!showWorkbench);
        }}>
          <div className="i-ph:code-bold"/>
        </Button>
      </div>
    </div>);
}
function Button({ active = false, disabled = false, children, onClick }) {
    return (<button className={(0, classNames_1.classNames)('flex items-center p-1.5', {
            'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary': !active,
            'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': active && !disabled,
            'bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed': disabled,
        })} onClick={onClick}>
      {children}
    </button>);
}
