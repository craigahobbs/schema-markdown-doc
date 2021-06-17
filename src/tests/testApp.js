// Licensed under the MIT License
// https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE

/* eslint-disable id-length */

import {SchemaMarkdownDoc} from '../schema-markdown-doc/index.js';
import {SchemaMarkdownParser} from 'schema-markdown/index.js';
import Window from 'window';
import test from 'ava';


test('SchemaMarkdownDoc, constructor', (t) => {
    const window = new Window();
    const app = new SchemaMarkdownDoc(window, 'my-type-model.json');
    t.is(app.window, window);
    t.is(app.defaultTypeModelURL, 'my-type-model.json');
    t.is(app.params, null);
});


test('SchemaMarkdownDoc.run, help command', async (t) => {
    const window = new Window();
    window.location.hash = '#cmd.help=1';
    const app = await SchemaMarkdownDoc.run(window);
    t.is(app.window, window);
    t.is(app.defaultTypeModelURL, null);
    t.deepEqual(app.params, {'cmd': {'help': 1}});
    t.is(window.document.title, 'SchemaMarkdownDoc');
    t.true(window.document.body.innerHTML.startsWith(
        '<h1 id="cmd.help=1&amp;type_SchemaMarkdownDoc"><a class="linktarget">SchemaMarkdownDoc</a></h1>'
    ));
});


test('SchemaMarkdownDoc.run, hash parameter error', async (t) => {
    const window = new Window();
    window.location.hash = '#foo=bar';
    const app = await SchemaMarkdownDoc.run(window);
    t.is(app.window, window);
    t.is(app.defaultTypeModelURL, null);
    t.is(app.params, null);
    t.is(window.document.title, 'SchemaMarkdownDoc');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('SchemaMarkdownDoc.appElements, index', async (t) => {
    const testModelSMD = `\
typedef int TestType
struct TestStruct
enum TestEnum
action TestAction
group "Group1"
typedef string TestType2
struct TestStruct2
group "Group2"
enum TestEnum2
action TestAction2
`;
    const testModel = {
        'title': 'Test',
        'types': (new SchemaMarkdownParser(testModelSMD)).types
    };

    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'testModel.json');
        return {'ok': true, 'json': () => new Promise((resolve) => {
            resolve(testModel);
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'testModel.json');
    app.updateParams('');
    t.deepEqual(
        await app.appElements('SchemaMarkdownDoc'),
        [
            'Test',
            [
                {'html': 'h1', 'elem': {'text': 'Test'}},
                [
                    [
                        {'html': 'h2', 'elem': {'text': 'Actions'}},
                        {
                            'html': 'ul',
                            'attr': {'class': 'smd-index-list'},
                            'elem': {
                                'html': 'li',
                                'elem': {
                                    'html': 'ul',
                                    'elem': [
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestAction'}, 'elem': {'text': 'TestAction'}}
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    [
                        {'html': 'h2', 'elem': {'text': 'Enumerations'}},
                        {
                            'html': 'ul',
                            'attr': {'class': 'smd-index-list'},
                            'elem': {
                                'html': 'li',
                                'elem': {
                                    'html': 'ul',
                                    'elem': [
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestEnum'}, 'elem': {'text': 'TestEnum'}}
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    [
                        {'html': 'h2', 'elem': {'text': 'Group1'}},
                        {
                            'html': 'ul',
                            'attr': {'class': 'smd-index-list'},
                            'elem': {
                                'html': 'li',
                                'elem': {
                                    'html': 'ul',
                                    'elem': [
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestStruct2'}, 'elem': {'text': 'TestStruct2'}}
                                        },
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestType2'}, 'elem': {'text': 'TestType2'}}
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    [
                        {'html': 'h2', 'elem': {'text': 'Group2'}},
                        {
                            'html': 'ul',
                            'attr': {'class': 'smd-index-list'},
                            'elem': {
                                'html': 'li',
                                'elem': {
                                    'html': 'ul',
                                    'elem': [
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestAction2'}, 'elem': {'text': 'TestAction2'}}
                                        },
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestEnum2'}, 'elem': {'text': 'TestEnum2'}}
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    [
                        {'html': 'h2', 'elem': {'text': 'Structs'}},
                        {
                            'html': 'ul',
                            'attr': {'class': 'smd-index-list'},
                            'elem': {
                                'html': 'li',
                                'elem': {
                                    'html': 'ul',
                                    'elem': [
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestStruct'}, 'elem': {'text': 'TestStruct'}}
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    [
                        {'html': 'h2', 'elem': {'text': 'Typedefs'}},
                        {
                            'html': 'ul',
                            'attr': {'class': 'smd-index-list'},
                            'elem': {
                                'html': 'li',
                                'elem': {
                                    'html': 'ul',
                                    'elem': [
                                        {
                                            'html': 'li',
                                            'elem': {'html': 'a', 'attr': {'href': '#name=TestType'}, 'elem': {'text': 'TestType'}}
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ]
            ]
        ]
    );
});


test('SchemaMarkdownDoc.appElements, type page', async (t) => {
    const testModelSMD = `\
typedef int TestType
`;
    const testModel = {
        'title': 'Test',
        'types': (new SchemaMarkdownParser(testModelSMD)).types
    };

    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'testModel.json');
        return {'ok': true, 'json': () => new Promise((resolve) => {
            resolve(testModel);
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'testModel.json');
    app.updateParams('name=TestType');
    t.deepEqual(
        await app.appElements('SchemaMarkdownDoc'),
        [
            'Test',
            [
                {
                    'html': 'p',
                    'elem': {
                        'html': 'a',
                        'attr': {'href': '#'},
                        'elem': {'text': 'Back to documentation index'}
                    }
                },
                [
                    [
                        {
                            'html': 'h1',
                            'attr': {'id': 'name=TestType&type_TestType'},
                            'elem': {
                                'html': 'a',
                                'attr': {'class': 'linktarget'},
                                'elem': {'text': 'TestType'}
                            }
                        },
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {'html': 'tr', 'elem': [{'html': 'th', 'elem': {'text': 'Type'}}, null]},
                                {'html': 'tr', 'elem': [{'html': 'td', 'elem': {'text': 'int'}}, null]}
                            ]
                        }
                    ],
                    null
                ]
            ]
        ]
    );
});


test('SchemaMarkdownDoc.appElements, fetch error', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'testModel.json');
        return {'ok': false, 'statusText': 'Not Found'};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'testModel.json');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.appElements('SchemaMarkdownDoc');
    } catch (error) { /* c8 ignore next */
        t.true(error instanceof Error);
        errorMessage = error.message;
    }
    t.is(errorMessage, "Could not fetch 'testModel.json', 'Not Found'");
});


test('SchemaMarkdownDoc.appElements, url and json error', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'otherTestModel.json');
        return {'ok': true, 'json': () => new Promise(() => {
            throw new Error('Bad JSON');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'testModel.json');
    app.updateParams('url=otherTestModel.json');
    let errorMessage = null;
    try {
        await app.appElements('SchemaMarkdownDoc');
    } catch (error) { /* c8 ignore next */
        t.true(error instanceof Error);
        errorMessage = error.message;
    }
    t.is(errorMessage, 'Bad JSON');
});


test('SchemaMarkdownDoc.appElements, unknown type error', async (t) => {
    const testModelSMD = `\
typedef int TestType
`;
    const testModel = {
        'title': 'Test',
        'types': (new SchemaMarkdownParser(testModelSMD)).types
    };

    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'testModel.json');
        return {'ok': true, 'json': () => new Promise((resolve) => {
            resolve(testModel);
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'testModel.json');
    app.updateParams('name=UnknownType');
    let errorMessage = null;
    try {
        await app.appElements('SchemaMarkdownDoc');
    } catch (error) { /* c8 ignore next */
        t.true(error instanceof Error);
        errorMessage = error.message;
    }
    t.is(errorMessage, "Unknown type name 'UnknownType'");
});
