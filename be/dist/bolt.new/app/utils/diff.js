"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modificationsRegex = void 0;
exports.computeFileModifications = computeFileModifications;
exports.diffFiles = diffFiles;
exports.fileModificationsToHTML = fileModificationsToHTML;
const diff_1 = require("diff");
const constants_1 = require("./constants");
exports.modificationsRegex = new RegExp(`^<${constants_1.MODIFICATIONS_TAG_NAME}>[\\s\\S]*?<\\/${constants_1.MODIFICATIONS_TAG_NAME}>\\s+`, 'g');
function computeFileModifications(files, modifiedFiles) {
    const modifications = {};
    let hasModifiedFiles = false;
    for (const [filePath, originalContent] of modifiedFiles) {
        const file = files[filePath];
        if ((file === null || file === void 0 ? void 0 : file.type) !== 'file') {
            continue;
        }
        const unifiedDiff = diffFiles(filePath, originalContent, file.content);
        if (!unifiedDiff) {
            // files are identical
            continue;
        }
        hasModifiedFiles = true;
        if (unifiedDiff.length > file.content.length) {
            // if there are lots of changes we simply grab the current file content since it's smaller than the diff
            modifications[filePath] = { type: 'file', content: file.content };
        }
        else {
            // otherwise we use the diff since it's smaller
            modifications[filePath] = { type: 'diff', content: unifiedDiff };
        }
    }
    if (!hasModifiedFiles) {
        return undefined;
    }
    return modifications;
}
/**
 * Computes a diff in the unified format. The only difference is that the header is omitted
 * because it will always assume that you're comparing two versions of the same file and
 * it allows us to avoid the extra characters we send back to the llm.
 *
 * @see https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html
 */
function diffFiles(fileName, oldFileContent, newFileContent) {
    let unifiedDiff = (0, diff_1.createTwoFilesPatch)(fileName, fileName, oldFileContent, newFileContent);
    const patchHeaderEnd = `--- ${fileName}\n+++ ${fileName}\n`;
    const headerEndIndex = unifiedDiff.indexOf(patchHeaderEnd);
    if (headerEndIndex >= 0) {
        unifiedDiff = unifiedDiff.slice(headerEndIndex + patchHeaderEnd.length);
    }
    if (unifiedDiff === '') {
        return undefined;
    }
    return unifiedDiff;
}
/**
 * Converts the unified diff to HTML.
 *
 * Example:
 *
 * ```html
 * <bolt_file_modifications>
 * <diff path="/home/project/index.js">
 * - console.log('Hello, World!');
 * + console.log('Hello, Bolt!');
 * </diff>
 * </bolt_file_modifications>
 * ```
 */
function fileModificationsToHTML(modifications) {
    const entries = Object.entries(modifications);
    if (entries.length === 0) {
        return undefined;
    }
    const result = [`<${constants_1.MODIFICATIONS_TAG_NAME}>`];
    for (const [filePath, { type, content }] of entries) {
        result.push(`<${type} path=${JSON.stringify(filePath)}>`, content, `</${type}>`);
    }
    result.push(`</${constants_1.MODIFICATIONS_TAG_NAME}>`);
    return result.join('\n');
}
