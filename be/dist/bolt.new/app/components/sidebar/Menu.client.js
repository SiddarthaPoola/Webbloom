"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = Menu;
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const react_toastify_1 = require("react-toastify");
const Dialog_1 = require("~/components/ui/Dialog");
const ThemeSwitch_1 = require("~/components/ui/ThemeSwitch");
const persistence_1 = require("~/lib/persistence");
const easings_1 = require("~/utils/easings");
const logger_1 = require("~/utils/logger");
const HistoryItem_1 = require("./HistoryItem");
const date_binning_1 = require("./date-binning");
const menuVariants = {
    closed: {
        opacity: 0,
        visibility: 'hidden',
        left: '-150px',
        transition: {
            duration: 0.2,
            ease: easings_1.cubicEasingFn,
        },
    },
    open: {
        opacity: 1,
        visibility: 'initial',
        left: 0,
        transition: {
            duration: 0.2,
            ease: easings_1.cubicEasingFn,
        },
    },
};
function Menu() {
    const menuRef = (0, react_1.useRef)(null);
    const [list, setList] = (0, react_1.useState)([]);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [dialogContent, setDialogContent] = (0, react_1.useState)(null);
    const loadEntries = (0, react_1.useCallback)(() => {
        if (persistence_1.db) {
            (0, persistence_1.getAll)(persistence_1.db)
                .then((list) => list.filter((item) => item.urlId && item.description))
                .then(setList)
                .catch((error) => react_toastify_1.toast.error(error.message));
        }
    }, []);
    const deleteItem = (0, react_1.useCallback)((event, item) => {
        event.preventDefault();
        if (persistence_1.db) {
            (0, persistence_1.deleteById)(persistence_1.db, item.id)
                .then(() => {
                loadEntries();
                if (persistence_1.chatId.get() === item.id) {
                    // hard page navigation to clear the stores
                    window.location.pathname = '/';
                }
            })
                .catch((error) => {
                react_toastify_1.toast.error('Failed to delete conversation');
                logger_1.logger.error(error);
            });
        }
    }, []);
    const closeDialog = () => {
        setDialogContent(null);
    };
    (0, react_1.useEffect)(() => {
        if (open) {
            loadEntries();
        }
    }, [open]);
    (0, react_1.useEffect)(() => {
        const enterThreshold = 40;
        const exitThreshold = 40;
        function onMouseMove(event) {
            if (event.pageX < enterThreshold) {
                setOpen(true);
            }
            if (menuRef.current && event.clientX > menuRef.current.getBoundingClientRect().right + exitThreshold) {
                setOpen(false);
            }
        }
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);
    return (<framer_motion_1.motion.div ref={menuRef} initial="closed" animate={open ? 'open' : 'closed'} variants={menuVariants} className="flex flex-col side-menu fixed top-0 w-[350px] h-full bg-bolt-elements-background-depth-2 border-r rounded-r-3xl border-bolt-elements-borderColor z-sidebar shadow-xl shadow-bolt-elements-sidebar-dropdownShadow text-sm">
      <div className="flex items-center h-[var(--header-height)]">{/* Placeholder */}</div>
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <div className="p-4">
          <a href="/" className="flex gap-2 items-center bg-bolt-elements-sidebar-buttonBackgroundDefault text-bolt-elements-sidebar-buttonText hover:bg-bolt-elements-sidebar-buttonBackgroundHover rounded-md p-2 transition-theme">
            <span className="inline-block i-bolt:chat scale-110"/>
            Start new chat
          </a>
        </div>
        <div className="text-bolt-elements-textPrimary font-medium pl-6 pr-5 my-2">Your Chats</div>
        <div className="flex-1 overflow-scroll pl-4 pr-5 pb-5">
          {list.length === 0 && <div className="pl-2 text-bolt-elements-textTertiary">No previous conversations</div>}
          <Dialog_1.DialogRoot open={dialogContent !== null}>
            {(0, date_binning_1.binDates)(list).map(({ category, items }) => (<div key={category} className="mt-4 first:mt-0 space-y-1">
                <div className="text-bolt-elements-textTertiary sticky top-0 z-1 bg-bolt-elements-background-depth-2 pl-2 pt-2 pb-1">
                  {category}
                </div>
                {items.map((item) => (<HistoryItem_1.HistoryItem key={item.id} item={item} onDelete={() => setDialogContent({ type: 'delete', item })}/>))}
              </div>))}
            <Dialog_1.Dialog onBackdrop={closeDialog} onClose={closeDialog}>
              {(dialogContent === null || dialogContent === void 0 ? void 0 : dialogContent.type) === 'delete' && (<>
                  <Dialog_1.DialogTitle>Delete Chat?</Dialog_1.DialogTitle>
                  <Dialog_1.DialogDescription asChild>
                    <div>
                      <p>
                        You are about to delete <strong>{dialogContent.item.description}</strong>.
                      </p>
                      <p className="mt-1">Are you sure you want to delete this chat?</p>
                    </div>
                  </Dialog_1.DialogDescription>
                  <div className="px-5 pb-4 bg-bolt-elements-background-depth-2 flex gap-2 justify-end">
                    <Dialog_1.DialogButton type="secondary" onClick={closeDialog}>
                      Cancel
                    </Dialog_1.DialogButton>
                    <Dialog_1.DialogButton type="danger" onClick={(event) => {
                deleteItem(event, dialogContent.item);
                closeDialog();
            }}>
                      Delete
                    </Dialog_1.DialogButton>
                  </div>
                </>)}
            </Dialog_1.Dialog>
          </Dialog_1.DialogRoot>
        </div>
        <div className="flex items-center border-t border-bolt-elements-borderColor p-4">
          <ThemeSwitch_1.ThemeSwitch className="ml-auto"/>
        </div>
      </div>
    </framer_motion_1.motion.div>);
}
