"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSwitch = void 0;
const react_1 = require("@nanostores/react");
const react_2 = require("react");
const theme_1 = require("~/lib/stores/theme");
const IconButton_1 = require("./IconButton");
exports.ThemeSwitch = (0, react_2.memo)(({ className }) => {
    const theme = (0, react_1.useStore)(theme_1.themeStore);
    const [domLoaded, setDomLoaded] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        setDomLoaded(true);
    }, []);
    return (domLoaded && (<IconButton_1.IconButton className={className} icon={theme === 'dark' ? 'i-ph-sun-dim-duotone' : 'i-ph-moon-stars-duotone'} size="xl" title="Toggle Theme" onClick={theme_1.toggleTheme}/>));
});
