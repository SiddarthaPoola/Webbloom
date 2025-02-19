"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Head = exports.links = void 0;
exports.Layout = Layout;
exports.default = App;
const react_1 = require("@nanostores/react");
const react_2 = require("@remix-run/react");
const tailwind_compat_css_url_1 = __importDefault(require("@unocss/reset/tailwind-compat.css?url"));
const theme_1 = require("./lib/stores/theme");
const stripIndent_1 = require("./utils/stripIndent");
const remix_island_1 = require("remix-island");
const react_3 = require("react");
const ReactToastify_css_url_1 = __importDefault(require("react-toastify/dist/ReactToastify.css?url"));
const index_scss_url_1 = __importDefault(require("./styles/index.scss?url"));
const xterm_css_url_1 = __importDefault(require("@xterm/xterm/css/xterm.css?url"));
require("virtual:uno.css");
const links = () => [
    {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
    },
    { rel: 'stylesheet', href: ReactToastify_css_url_1.default },
    { rel: 'stylesheet', href: tailwind_compat_css_url_1.default },
    { rel: 'stylesheet', href: index_scss_url_1.default },
    { rel: 'stylesheet', href: xterm_css_url_1.default },
    {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
    },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
];
exports.links = links;
const inlineThemeCode = (0, stripIndent_1.stripIndents) `
  setTutorialKitTheme();

  function setTutorialKitTheme() {
    let theme = localStorage.getItem('bolt_theme');

    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.querySelector('html')?.setAttribute('data-theme', theme);
  }
`;
exports.Head = (0, remix_island_1.createHead)(() => (<>
    <meta charSet="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <react_2.Meta />
    <react_2.Links />
    <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }}/>
  </>));
function Layout({ children }) {
    const theme = (0, react_1.useStore)(theme_1.themeStore);
    (0, react_3.useEffect)(() => {
        var _a;
        (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-theme', theme);
    }, [theme]);
    return (<>
      {children}
      <react_2.ScrollRestoration />
      <react_2.Scripts />
    </>);
}
function App() {
    return <react_2.Outlet />;
}
