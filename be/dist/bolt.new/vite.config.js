"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("@remix-run/dev");
const vite_1 = __importDefault(require("unocss/vite"));
const vite_2 = require("vite");
const vite_plugin_node_polyfills_1 = require("vite-plugin-node-polyfills");
const vite_plugin_optimize_css_modules_1 = require("vite-plugin-optimize-css-modules");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, vite_2.defineConfig)((config) => {
    return {
        build: {
            target: 'esnext',
        },
        plugins: [
            (0, vite_plugin_node_polyfills_1.nodePolyfills)({
                include: ['path', 'buffer'],
            }),
            config.mode !== 'test' && (0, dev_1.cloudflareDevProxyVitePlugin)(),
            (0, dev_1.vitePlugin)({
                future: {
                    v3_fetcherPersist: true,
                    v3_relativeSplatPath: true,
                    v3_throwAbortReason: true,
                },
            }),
            (0, vite_1.default)(),
            (0, vite_tsconfig_paths_1.default)(),
            chrome129IssuePlugin(),
            config.mode === 'production' && (0, vite_plugin_optimize_css_modules_1.optimizeCssModules)({ apply: 'build' }),
        ],
    };
});
function chrome129IssuePlugin() {
    return {
        name: 'chrome129IssuePlugin',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                var _a;
                const raw = (_a = req.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.match(/Chrom(e|ium)\/([0-9]+)\./);
                if (raw) {
                    const version = parseInt(raw[2], 10);
                    if (version === 129) {
                        res.setHeader('content-type', 'text/html');
                        res.end('<body><h1>Please use Chrome Canary for testing.</h1><p>Chrome 129 has an issue with JavaScript modules & Vite local development, see <a href="https://github.com/stackblitz/bolt.new/issues/86#issuecomment-2395519258">for more information.</a></p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>');
                        return;
                    }
                }
                next();
            });
        },
    };
}
