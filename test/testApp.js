// Licensed under the MIT License
// https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE

/* eslint-disable id-length */

import {ElementApplication} from 'element-app/lib/app.js';
import {JSDOM} from 'jsdom/lib/api.js';
import {SchemaMarkdownDoc} from '../lib/app.js';
import {SchemaMarkdownParser} from 'schema-markdown/lib/parser.js';
import {UserTypeElements} from '../lib/userTypeElements.js';
import test from 'ava';


test('SchemaMarkdownDoc, constructor', (t) => {
    const {window} = new JSDOM();
    const app = new SchemaMarkdownDoc(window, 'my-type-model.json');
    t.is(app.window, window);
    t.is(app.params, null);
    t.is(app.defaultURL, 'my-type-model.json');
});


test('SchemaMarkdownDoc.main, help', async (t) => {
    const {window} = new JSDOM();
    const app = new SchemaMarkdownDoc(window);
    app.updateParams('help=1');
    t.deepEqual(
        ElementApplication.validateMain(await app.main()),
        {
            'elements': new UserTypeElements(app.params).getElements(app.hashTypes, app.hashType)
        }
    );
});


test('SchemaMarkdownDoc.main', async (t) => {
    const {window} = new JSDOM();
    const app = new SchemaMarkdownDoc(window);
    app.updateParams('');
    const result = ElementApplication.validateMain(await app.main());
    result.elements.length = 1;
    t.deepEqual(result, {
        'title': 'The Schema Markdown Type Model',
        'elements': [
            {'html': 'h1', 'elem': {'text': 'The Schema Markdown Type Model'}}
        ]
    });
});


test('SchemaMarkdownDoc.main, url', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'other.json');
        return {'ok': true, 'json': () => new Promise((resolve) => {
            resolve({'title': 'Title', 'types': {'IntType': {'typedef': {'name': 'IntType', 'type': {'builtin': 'int'}}}}});
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'model.json');
    app.updateParams('url=other.json');
    t.deepEqual(
        ElementApplication.validateMain(await app.main()),
        {
            'title': 'Title',
            'elements': [
                {'html': 'h1', 'elem': {'text': 'Title'}},
                [
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
                                            'elem': {
                                                'html': 'a',
                                                'attr': {'href': '#name=IntType&url=other.json'},
                                                'elem': {'text': 'IntType'}
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ]
            ]
        }
    );
});


test('SchemaMarkdownDoc.main, fetch error', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'model.json');
        return {'ok': false, 'statusText': 'Not Found'};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'model.json');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "model.json", "Not Found"');
});


test('SchemaMarkdownDoc.main, fetch error no status text', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'model.json');
        return {'ok': false, 'statusText': ''};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new SchemaMarkdownDoc(window, 'model.json');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "model.json"');
});


test('SchemaMarkdownDoc.main, index', async (t) => {
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

    const {window} = new JSDOM();
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
        ElementApplication.validateMain(await app.main()),
        {
            'title': 'Test',
            'elements': [
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
        }
    );
});


test('SchemaMarkdownDoc.main, type page', async (t) => {
    const testModelSMD = `\
typedef int TestType
`;
    const testModel = {
        'title': 'Test',
        'types': (new SchemaMarkdownParser(testModelSMD)).types
    };

    const {window} = new JSDOM();
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
        ElementApplication.validateMain(await app.main()),
        {
            'title': 'Test',
            'elements': [
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
                            'elem': {'text': 'TestType'}
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
        }
    );
});


test('SchemaMarkdownDoc.main, url and json error', async (t) => {
    const {window} = new JSDOM();
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
        await app.main();
    } catch (error) { /* c8 ignore next */
        t.true(error instanceof Error);
        errorMessage = error.message;
    }
    t.is(errorMessage, 'Bad JSON');
});


test('SchemaMarkdownDoc.main, unknown type error', async (t) => {
    const testModelSMD = `\
typedef int TestType
`;
    const testModel = {
        'title': 'Test',
        'types': (new SchemaMarkdownParser(testModelSMD)).types
    };

    const {window} = new JSDOM();
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
        await app.main();
    } catch (error) { /* c8 ignore next */
        t.true(error instanceof Error);
        errorMessage = error.message;
    }
    t.is(errorMessage, "Unknown type name 'UnknownType'");
});
