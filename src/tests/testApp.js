// Licensed under the MIT License
// https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE

/* eslint-disable id-length */

import {SchemaMarkdownDoc} from '../schema-markdown-doc/index.js';
import Window from 'window';
import test from 'ava';


test('MarkdownApp, constructor', (t) => {
    const window = new Window();
    const markdownApp = new SchemaMarkdownDoc(window, 'my-type-model.json');
    t.is(markdownApp.window, window);
    t.is(markdownApp.defaultTypeModelURL, 'my-type-model.json');
    t.is(markdownApp.params, null);
});


test('MarkdownApp.run, help command', async (t) => {
    const window = new Window();
    window.location.hash = '#cmd.help=1';
    const markdownApp = await SchemaMarkdownDoc.run(window);
    t.is(markdownApp.window, window);
    t.is(markdownApp.defaultTypeModelURL, null);
    t.deepEqual(markdownApp.params, {'cmd': {'help': 1}});
    t.is(window.document.title, 'SchemaMarkdownDoc');
    t.true(window.document.body.innerHTML.startsWith(
        '<h1 id="cmd.help=1&amp;type_SchemaMarkdownDoc"><a class="linktarget">SchemaMarkdownDoc</a></h1>'
    ));
});


test('MarkdownApp.run, hash parameter error', async (t) => {
    const window = new Window();
    window.location.hash = '#foo=bar';
    const markdownApp = await SchemaMarkdownDoc.run(window);
    t.is(markdownApp.window, window);
    t.is(markdownApp.defaultTypeModelURL, null);
    t.is(markdownApp.params, null);
    t.is(window.document.title, 'SchemaMarkdownDoc');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});
