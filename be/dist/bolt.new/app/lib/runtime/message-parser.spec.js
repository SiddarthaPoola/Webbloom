"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const message_parser_1 = require("./message-parser");
(0, vitest_1.describe)('StreamingMessageParser', () => {
    (0, vitest_1.it)('should pass through normal text', () => {
        const parser = new message_parser_1.StreamingMessageParser();
        (0, vitest_1.expect)(parser.parse('test_id', 'Hello, world!')).toBe('Hello, world!');
    });
    (0, vitest_1.it)('should allow normal HTML tags', () => {
        const parser = new message_parser_1.StreamingMessageParser();
        (0, vitest_1.expect)(parser.parse('test_id', 'Hello <strong>world</strong>!')).toBe('Hello <strong>world</strong>!');
    });
    (0, vitest_1.describe)('no artifacts', () => {
        vitest_1.it.each([
            ['Foo bar', 'Foo bar'],
            ['Foo bar <', 'Foo bar '],
            ['Foo bar <p', 'Foo bar <p'],
            [['Foo bar <', 's', 'p', 'an>some text</span>'], 'Foo bar <span>some text</span>'],
        ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
            runTest(input, expected);
        });
    });
    (0, vitest_1.describe)('invalid or incomplete artifacts', () => {
        vitest_1.it.each([
            ['Foo bar <b', 'Foo bar '],
            ['Foo bar <ba', 'Foo bar <ba'],
            ['Foo bar <bol', 'Foo bar '],
            ['Foo bar <bolt', 'Foo bar '],
            ['Foo bar <bolta', 'Foo bar <bolta'],
            ['Foo bar <boltA', 'Foo bar '],
            ['Foo bar <boltArtifacs></boltArtifact>', 'Foo bar <boltArtifacs></boltArtifact>'],
            ['Before <oltArtfiact>foo</boltArtifact> After', 'Before <oltArtfiact>foo</boltArtifact> After'],
            ['Before <boltArtifactt>foo</boltArtifact> After', 'Before <boltArtifactt>foo</boltArtifact> After'],
        ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
            runTest(input, expected);
        });
    });
    (0, vitest_1.describe)('valid artifacts without actions', () => {
        vitest_1.it.each([
            [
                'Some text before <boltArtifact title="Some title" id="artifact_1">foo bar</boltArtifact> Some more text',
                {
                    output: 'Some text before  Some more text',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
            [
                ['Some text before <boltArti', 'fact', ' title="Some title" id="artifact_1">foo</boltArtifact> Some more text'],
                {
                    output: 'Some text before  Some more text',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
            [
                [
                    'Some text before <boltArti',
                    'fac',
                    't title="Some title" id="artifact_1"',
                    ' ',
                    '>',
                    'foo</boltArtifact> Some more text',
                ],
                {
                    output: 'Some text before  Some more text',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
            [
                [
                    'Some text before <boltArti',
                    'fact',
                    ' title="Some title" id="artifact_1"',
                    ' >fo',
                    'o</boltArtifact> Some more text',
                ],
                {
                    output: 'Some text before  Some more text',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
            [
                [
                    'Some text before <boltArti',
                    'fact tit',
                    'le="Some ',
                    'title" id="artifact_1">fo',
                    'o',
                    '<',
                    '/boltArtifact> Some more text',
                ],
                {
                    output: 'Some text before  Some more text',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
            [
                [
                    'Some text before <boltArti',
                    'fact title="Some title" id="artif',
                    'act_1">fo',
                    'o<',
                    '/boltArtifact> Some more text',
                ],
                {
                    output: 'Some text before  Some more text',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
            [
                'Before <boltArtifact title="Some title" id="artifact_1">foo</boltArtifact> After',
                {
                    output: 'Before  After',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
                },
            ],
        ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
            runTest(input, expected);
        });
    });
    (0, vitest_1.describe)('valid artifacts with actions', () => {
        vitest_1.it.each([
            [
                'Before <boltArtifact title="Some title" id="artifact_1"><boltAction type="shell">npm install</boltAction></boltArtifact> After',
                {
                    output: 'Before  After',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 1, onActionClose: 1 },
                },
            ],
            [
                'Before <boltArtifact title="Some title" id="artifact_1"><boltAction type="shell">npm install</boltAction><boltAction type="file" filePath="index.js">some content</boltAction></boltArtifact> After',
                {
                    output: 'Before  After',
                    callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 2, onActionClose: 2 },
                },
            ],
        ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
            runTest(input, expected);
        });
    });
});
function runTest(input, outputOrExpectedResult) {
    var _a;
    let expected;
    if (typeof outputOrExpectedResult === 'string') {
        expected = { output: outputOrExpectedResult };
    }
    else {
        expected = outputOrExpectedResult;
    }
    const callbacks = {
        onArtifactOpen: vitest_1.vi.fn((data) => {
            (0, vitest_1.expect)(data).toMatchSnapshot('onArtifactOpen');
        }),
        onArtifactClose: vitest_1.vi.fn((data) => {
            (0, vitest_1.expect)(data).toMatchSnapshot('onArtifactClose');
        }),
        onActionOpen: vitest_1.vi.fn((data) => {
            (0, vitest_1.expect)(data).toMatchSnapshot('onActionOpen');
        }),
        onActionClose: vitest_1.vi.fn((data) => {
            (0, vitest_1.expect)(data).toMatchSnapshot('onActionClose');
        }),
    };
    const parser = new message_parser_1.StreamingMessageParser({
        artifactElement: () => '',
        callbacks,
    });
    let message = '';
    let result = '';
    const chunks = Array.isArray(input) ? input : input.split('');
    for (const chunk of chunks) {
        message += chunk;
        result += parser.parse('message_1', message);
    }
    for (const name in expected.callbacks) {
        const callbackName = name;
        (0, vitest_1.expect)(callbacks[callbackName]).toHaveBeenCalledTimes((_a = expected.callbacks[callbackName]) !== null && _a !== void 0 ? _a : 0);
    }
    (0, vitest_1.expect)(result).toEqual(expected.output);
}
