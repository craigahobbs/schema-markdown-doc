// Licensed under the MIT License
// https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE

/* eslint-disable id-length */
/* eslint-disable max-len */

import {schemaMarkdownDoc} from '../lib/schemaMarkdownDoc.js';
import test from 'ava';
import {validateElements} from 'element-model/lib/elementModel.js';
import {validateTypeModel} from 'schema-markdown/lib/schema.js';


// Non-breaking space character
const nbsp = String.fromCharCode(160);


test('schemaMarkdownDoc, struct', (t) => {
    const types = {
        'MyStruct': {
            'struct': {
                'name': 'MyStruct',
                'doc': ['This is my struct'],
                'members': [
                    {'name': 'a', 'type': {'builtin': 'int'}, 'doc': ['The "a" member']},
                    {'name': 'b', 'type': {'builtin': 'float'}, 'optional': true},
                    {'name': 'c', 'type': {'user': 'MyStructEmpty'}},
                    {'name': 'd', 'type': {'user': 'MyStructNoAttr'}}
                ]
            }
        },
        'MyStructEmpty': {
            'struct': {
                'name': 'MyStructEmpty'
            }
        },
        'MyStructNoAttr': {
            'struct': {
                'name': 'MyStructNoAttr',
                'members': [
                    {'name': 'a', 'type': {'builtin': 'int'}}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyStruct')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyStruct'},
                    'elem': {'text': 'MyStruct'}
                },
                null,
                [
                    {'html': 'p', 'elem': [{'text': 'This is my struct'}]}
                ],
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Name'}},
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                {'html': 'th', 'elem': {'text': 'Attributes'}},
                                {'html': 'th', 'elem': {'text': 'Description'}}
                            ]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'a'}},
                                    {'html': 'td', 'elem': {'text': 'int'}},
                                    {'html': 'td', 'elem': null},
                                    {'html': 'td', 'elem': [
                                        {'html': 'p', 'elem': [{'text': 'The "a" member'}]}
                                    ]}
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'b'}},
                                    {'html': 'td', 'elem': {'text': 'float'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': 'optional'}]
                                    ]},
                                    {'html': 'td', 'elem': null}
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'c'}},
                                    {
                                        'html': 'td',
                                        'elem': {'html': 'a', 'attr': {'href': '#type_MyStructEmpty'}, 'elem': {'text': 'MyStructEmpty'}}
                                    },
                                    {'html': 'td', 'elem': null},
                                    {'html': 'td', 'elem': null}
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'd'}},
                                    {
                                        'html': 'td',
                                        'elem': {'html': 'a', 'attr': {'href': '#type_MyStructNoAttr'}, 'elem': {'text': 'MyStructNoAttr'}}
                                    },
                                    {'html': 'td', 'elem': null},
                                    {'html': 'td', 'elem': null}
                                ]
                            }
                        ]
                    ]
                }
            ],
            [
                {'html': 'hr'},
                {'html': 'h2', 'elem': {'text': 'Referenced Types'}},
                [
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyStructEmpty'},
                            'elem': {'text': 'struct MyStructEmpty'}
                        },
                        null,
                        null,
                        [
                            {'html': 'p', 'elem': [{'text': 'The struct is empty.'}]}
                        ]
                    ],
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyStructNoAttr'},
                            'elem': {'text': 'struct MyStructNoAttr'}
                        },
                        null,
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'th', 'elem': {'text': 'Name'}},
                                        {'html': 'th', 'elem': {'text': 'Type'}},
                                        null,
                                        null
                                    ]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [
                                            {'html': 'td', 'elem': {'text': 'a'}},
                                            {'html': 'td', 'elem': {'text': 'int'}},
                                            null,
                                            null
                                        ]
                                    }
                                ]
                            ]
                        }
                    ]
                ]
            ]
        ]
    );
});


test('schemaMarkdownDoc, struct empty', (t) => {
    const types = {
        'MyStruct': {
            'struct': {
                'name': 'MyStruct'
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyStruct')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyStruct'},
                    'elem': {'text': 'MyStruct'}
                },
                null,
                null,
                [
                    {'html': 'p', 'elem': [{'text': 'The struct is empty.'}]}
                ]
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, struct bases', (t) => {
    const types = {
        'MyStruct': {
            'struct': {
                'name': 'MyStruct',
                'bases': ['MyStruct2', 'MyStruct3'],
                'members': [
                    {'name': 'a', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyStruct2': {
            'struct': {
                'name': 'MyStruct2',
                'bases': ['MyStruct4'],
                'members': [
                    {'name': 'b', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyStruct3': {
            'struct': {
                'name': 'MyStruct3',
                'members': [
                    {'name': 'c', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyStruct4': {
            'struct': {
                'name': 'MyStruct4',
                'members': [
                    {'name': 'd', 'type': {'builtin': 'int'}}
                ]
            }
        }
    };
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyStruct')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyStruct'},
                    'elem': {'text': 'MyStruct'}
                },
                {'html': 'p', 'elem': [
                    {'text': 'Bases: '},
                    [
                        [
                            null,
                            {'html': 'a', 'attr': {'href': '#type_MyStruct2'}, 'elem': {'text': 'MyStruct2'}}
                        ],
                        [
                            {'text': ', '},
                            {'html': 'a', 'attr': {'href': '#type_MyStruct3'}, 'elem': {'text': 'MyStruct3'}}
                        ]
                    ]
                ]},
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Name'}},
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                null,
                                null
                            ]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'd'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                            },
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'b'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                            },
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'c'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                            },
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'a'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                            }
                        ]
                    ]
                }
            ],
            [
                {'html': 'hr'},
                {'html': 'h2', 'elem': {'text': 'Referenced Types'}},
                [
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyStruct2'},
                            'elem': {'text': 'struct MyStruct2'}
                        },
                        {'html': 'p', 'elem': [
                            {'text': 'Bases: '},
                            [
                                [
                                    null,
                                    {'html': 'a', 'attr': {'href': '#type_MyStruct4'}, 'elem': {'text': 'MyStruct4'}}
                                ]
                            ]
                        ]},
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'th', 'elem': {'text': 'Name'}},
                                        {'html': 'th', 'elem': {'text': 'Type'}},
                                        null,
                                        null
                                    ]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'd'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                                    },
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'b'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                                    }
                                ]
                            ]
                        }
                    ],
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyStruct3'},
                            'elem': {'text': 'struct MyStruct3'}
                        },
                        null,
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'th', 'elem': {'text': 'Name'}},
                                        {'html': 'th', 'elem': {'text': 'Type'}},
                                        null,
                                        null
                                    ]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'c'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                                    }
                                ]
                            ]
                        }
                    ],
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyStruct4'},
                            'elem': {'text': 'struct MyStruct4'}
                        },
                        null,
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'th', 'elem': {'text': 'Name'}},
                                        {'html': 'th', 'elem': {'text': 'Type'}},
                                        null,
                                        null
                                    ]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'd'}}, {'html': 'td', 'elem': {'text': 'int'}}, null, null]
                                    }
                                ]
                            ]
                        }
                    ]
                ]
            ]
        ]
    );
});


test('schemaMarkdownDoc, struct union', (t) => {
    const types = {
        'MyUnion': {
            'struct': {
                'name': 'MyUnion',
                'union': true
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyUnion')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyUnion'},
                    'elem': {'text': 'union MyUnion'}
                },
                null,
                null,
                [
                    {'html': 'p', 'elem': [{'text': 'The struct is empty.'}]}
                ]
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, struct collections', (t) => {
    const types = {
        'MyStruct': {
            'struct': {
                'name': 'MyStruct',
                'members': [
                    {'name': 'a', 'type': {'array': {'type': {'builtin': 'int'}}}},
                    {'name': 'b', 'type': {'dict': {'type': {'builtin': 'int'}}}},
                    {'name': 'c', 'type': {
                        'array': {
                            'type': {'builtin': 'int'},
                            'attr': {'gt': 0}
                        }
                    }},
                    {'name': 'd', 'type': {
                        'dict': {
                            'type': {'builtin': 'int'},
                            'attr': {'gt': 0},
                            'keyAttr': {'lenGT': 0}
                        }
                    }},
                    {'name': 'e', 'type': {
                        'dict': {
                            'type': {'builtin': 'int'},
                            'attr': {'gt': 0},
                            'keyType': {'user': 'MyEnum'}
                        }
                    }},
                    {'name': 'f', 'type': {
                        'dict': {
                            'type': {'builtin': 'int'},
                            'attr': {'gt': 0},
                            'keyType': {'builtin': 'string'},
                            'keyAttr': {'lenGT': 0}
                        }
                    }}
                ]
            }
        },
        'MyEnum': {
            'enum': {
                'name': 'MyEnum'
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyStruct')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyStruct'},
                    'elem': {'text': 'MyStruct'}
                },
                null,
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Name'}},
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                {'html': 'th', 'elem': {'text': 'Attributes'}},
                                null
                            ]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'a'}},
                                    {'html': 'td', 'elem': [
                                        {'text': 'int'},
                                        {'text': `${nbsp}[]`}
                                    ]},
                                    {'html': 'td', 'elem': null},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'b'}},
                                    {'html': 'td', 'elem': [
                                        null,
                                        {'text': 'int'},
                                        {'text': `${nbsp}{}`}
                                    ]},
                                    {'html': 'td', 'elem': null},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'c'}},
                                    {'html': 'td', 'elem': [
                                        {'text': 'int'},
                                        {'text': `${nbsp}[]`}
                                    ]},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `value${nbsp}>${nbsp}0`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'd'}},
                                    {'html': 'td', 'elem': [
                                        null,
                                        {'text': 'int'},
                                        {'text': `${nbsp}{}`}
                                    ]},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `len(key)${nbsp}>${nbsp}0`}],
                                        [{'html': 'br'}, {'text': `value${nbsp}>${nbsp}0`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'e'}},
                                    {'html': 'td', 'elem': [
                                        [
                                            {'html': 'a', 'attr': {'href': '#type_MyEnum'}, 'elem': {'text': 'MyEnum'}},
                                            {'text': `${nbsp}:${nbsp}`}
                                        ],
                                        {'text': 'int'},
                                        {'text': `${nbsp}{}`}
                                    ]},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `value${nbsp}>${nbsp}0`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'f'}},
                                    {'html': 'td', 'elem': [
                                        null,
                                        {'text': 'int'},
                                        {'text': `${nbsp}{}`}
                                    ]},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `len(key)${nbsp}>${nbsp}0`}],
                                        [{'html': 'br'}, {'text': `value${nbsp}>${nbsp}0`}]
                                    ]},
                                    null
                                ]
                            }
                        ]
                    ]
                }
            ],
            [
                {'html': 'hr'},
                {'html': 'h2', 'elem': {'text': 'Referenced Types'}},
                [
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyEnum'},
                            'elem': {'text': 'enum MyEnum'}
                        },
                        null,
                        null,
                        null,
                        [
                            {'html': 'p', 'elem': [{'text': 'The enum is empty.'}]}
                        ]
                    ]
                ]
            ]
        ]
    );
});


test('schemaMarkdownDoc, struct attrs', (t) => {
    const types = {
        'MyStruct': {
            'struct': {
                'name': 'MyStruct',
                'members': [
                    {'name': 'a', 'type': {'builtin': 'int'}, 'attr': {'gt': 0, 'lt': 10}},
                    {'name': 'b', 'type': {'builtin': 'int'}, 'attr': {'gte': 0, 'lte': 10}},
                    {'name': 'c', 'type': {'builtin': 'int'}, 'attr': {'eq': 10}},
                    {'name': 'd', 'type': {'builtin': 'string'}, 'attr': {'lenGT': 0, 'lenLT': 10}},
                    {'name': 'e', 'type': {'builtin': 'string'}, 'attr': {'lenGTE': 0, 'lenLTE': 10}},
                    {'name': 'f', 'type': {'builtin': 'string'}, 'attr': {'lenEq': 10}},
                    {'name': 'g', 'type': {'builtin': 'int'}, 'attr': {'nullable': true}}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyStruct')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyStruct'},
                    'elem': {'text': 'MyStruct'}
                },
                null,
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Name'}},
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                {'html': 'th', 'elem': {'text': 'Attributes'}},
                                null
                            ]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'a'}},
                                    {'html': 'td', 'elem': {'text': 'int'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `value${nbsp}>${nbsp}0`}],
                                        [{'html': 'br'}, {'text': `value${nbsp}<${nbsp}10`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'b'}},
                                    {'html': 'td', 'elem': {'text': 'int'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `value${nbsp}>=${nbsp}0`}],
                                        [{'html': 'br'}, {'text': `value${nbsp}<=${nbsp}10`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'c'}},
                                    {'html': 'td', 'elem': {'text': 'int'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `value${nbsp}==${nbsp}10`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'd'}},
                                    {'html': 'td', 'elem': {'text': 'string'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `len(value)${nbsp}>${nbsp}0`}],
                                        [{'html': 'br'}, {'text': `len(value)${nbsp}<${nbsp}10`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'e'}},
                                    {'html': 'td', 'elem': {'text': 'string'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `len(value)${nbsp}>=${nbsp}0`}],
                                        [{'html': 'br'}, {'text': `len(value)${nbsp}<=${nbsp}10`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'f'}},
                                    {'html': 'td', 'elem': {'text': 'string'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': `len(value)${nbsp}==${nbsp}10`}]
                                    ]},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'g'}},
                                    {'html': 'td', 'elem': {'text': 'int'}},
                                    {'html': 'td', 'elem': [
                                        [null, {'text': 'nullable'}]
                                    ]},
                                    null
                                ]
                            }
                        ]
                    ]
                }
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, enum', (t) => {
    const types = {
        'MyEnum': {
            'enum': {
                'name': 'MyEnum',
                'values': [
                    {'name': 'A', 'doc': ['The "A" value']},
                    {'name': 'B'}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyEnum')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyEnum'},
                    'elem': {'text': 'MyEnum'}
                },
                null,
                null,
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Value'}},
                                {'html': 'th', 'elem': {'text': 'Description'}}
                            ]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'A'}},
                                    {'html': 'td', 'elem': [{'html': 'p', 'elem': [{'text': 'The "A" value'}]}]}
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'B'}},
                                    {'html': 'td', 'elem': null}
                                ]
                            }
                        ]
                    ]
                }
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, enum no doc', (t) => {
    const types = {
        'MyEnum': {
            'enum': {
                'name': 'MyEnum',
                'values': [
                    {'name': 'A'},
                    {'name': 'B'}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyEnum')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyEnum'},
                    'elem': {'text': 'MyEnum'}
                },
                null,
                null,
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Value'}},
                                null
                            ]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'A'}},
                                    null
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'elem': {'text': 'B'}},
                                    null
                                ]
                            }
                        ]
                    ]
                }
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, enum empty', (t) => {
    const types = {
        'MyEnum': {
            'enum': {
                'name': 'MyEnum'
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyEnum')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyEnum'},
                    'elem': {'text': 'MyEnum'}
                },
                null,
                null,
                null,
                [
                    {'html': 'p', 'elem': [{'text': 'The enum is empty.'}]}
                ]
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, enum bases', (t) => {
    const types = {
        'MyEnum': {
            'enum': {
                'name': 'MyEnum',
                'bases': ['MyEnum2', 'MyEnum3'],
                'values': [
                    {'name': 'A'}
                ]
            }
        },
        'MyEnum2': {
            'enum': {
                'name': 'MyEnum2',
                'bases': ['MyEnum4'],
                'values': [
                    {'name': 'B'}
                ]
            }
        },
        'MyEnum3': {
            'enum': {
                'name': 'MyEnum3',
                'values': [
                    {'name': 'C'}
                ]
            }
        },
        'MyEnum4': {
            'enum': {
                'name': 'MyEnum4',
                'values': [
                    {'name': 'D'}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyEnum')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyEnum'},
                    'elem': {'text': 'MyEnum'}
                },
                {'html': 'p', 'elem': [
                    {'text': 'Bases: '},
                    [
                        {'html': 'a', 'attr': {'href': '#type_MyEnum2'}, 'elem': {'text': 'MyEnum2'}},
                        {'html': 'a', 'attr': {'href': '#type_MyEnum3'}, 'elem': {'text': 'MyEnum3'}}
                    ]
                ]},
                null,
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [{'html': 'th', 'elem': {'text': 'Value'}}, null]
                        },
                        [
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'D'}}, null]
                            },
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'B'}}, null]
                            },
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'C'}}, null]
                            },
                            {
                                'html': 'tr',
                                'elem': [{'html': 'td', 'elem': {'text': 'A'}}, null]
                            }
                        ]
                    ]
                }
            ],
            [
                {'html': 'hr'},
                {'html': 'h2', 'elem': {'text': 'Referenced Types'}},
                [
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyEnum2'},
                            'elem': {'text': 'enum MyEnum2'}
                        },
                        {'html': 'p', 'elem': [
                            {'text': 'Bases: '},
                            [
                                {'html': 'a', 'attr': {'href': '#type_MyEnum4'}, 'elem': {'text': 'MyEnum4'}}
                            ]
                        ]},
                        null,
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [{'html': 'th', 'elem': {'text': 'Value'}}, null]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'D'}}, null]
                                    },
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'B'}}, null]
                                    }
                                ]
                            ]
                        }
                    ],
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyEnum3'},
                            'elem': {'text': 'enum MyEnum3'}
                        },
                        null,
                        null,
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [{'html': 'th', 'elem': {'text': 'Value'}}, null]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'C'}}, null]
                                    }
                                ]
                            ]
                        }
                    ],
                    [
                        {
                            'html': 'h3',
                            'attr': {'id': 'type_MyEnum4'},
                            'elem': {'text': 'enum MyEnum4'}
                        },
                        null,
                        null,
                        null,
                        {
                            'html': 'table',
                            'elem': [
                                {
                                    'html': 'tr',
                                    'elem': [{'html': 'th', 'elem': {'text': 'Value'}}, null]
                                },
                                [
                                    {
                                        'html': 'tr',
                                        'elem': [{'html': 'td', 'elem': {'text': 'D'}}, null]
                                    }
                                ]
                            ]
                        }
                    ]
                ]
            ]
        ]
    );
});


test('schemaMarkdownDoc, typedef', (t) => {
    const types = {
        'MyTypedef': {
            'typedef': {
                'name': 'MyTypedef',
                'type': {'builtin': 'int'},
                'attr': {'gt': 0},
                'doc': ['This is my typedef']
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyTypedef')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyTypedef'},
                    'elem': {'text': 'MyTypedef'}
                },
                [
                    {'html': 'p', 'elem': [{'text': 'This is my typedef'}]}
                ],
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                {'html': 'th', 'elem': {'text': 'Attributes'}}
                            ]
                        },
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'td', 'elem': {'text': 'int'}},
                                {'html': 'td', 'elem': [
                                    [null, {'text': `value${nbsp}>${nbsp}0`}]
                                ]}
                            ]
                        }
                    ]
                }
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, typedef no attr', (t) => {
    const types = {
        'MyTypedef': {
            'typedef': {
                'name': 'MyTypedef',
                'type': {'builtin': 'int'}
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyTypedef')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyTypedef'},
                    'elem': {'text': 'MyTypedef'}
                },
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                null
                            ]
                        },
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'td', 'elem': {'text': 'int'}},
                                null
                            ]
                        }
                    ]
                }
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, typedef attr gt lt', (t) => {
    const types = {
        'MyTypedef': {
            'typedef': {
                'name': 'MyTypedef',
                'type': {'builtin': 'int'},
                'attr': {'gt': 0, 'lt': 10}
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyTypedef')),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'type_MyTypedef'},
                    'elem': {'text': 'MyTypedef'}
                },
                null,
                {
                    'html': 'table',
                    'elem': [
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'elem': {'text': 'Type'}},
                                {'html': 'th', 'elem': {'text': 'Attributes'}}
                            ]
                        },
                        {
                            'html': 'tr',
                            'elem': [
                                {'html': 'td', 'elem': {'text': 'int'}},
                                {'html': 'td', 'elem': [
                                    [null, {'text': `value${nbsp}>${nbsp}0`}],
                                    [{'html': 'br'}, {'text': `value${nbsp}<${nbsp}10`}]
                                ]}
                            ]
                        }
                    ]
                }
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, action', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction',
                'urls': [
                    {},
                    {'method': 'GET'},
                    {'path': '/my_action'},
                    {'method': 'GET', 'path': '/my_alias'}
                ],
                'path': 'MyAction_path',
                'query': 'MyAction_query',
                'input': 'MyAction_input',
                'output': 'MyAction_output',
                'errors': 'MyAction_errors'
            }
        },
        'MyAction_path': {
            'struct': {
                'name': 'MyAction_path',
                'members': [
                    {'name': 'a', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyAction_query': {
            'struct': {
                'name': 'MyAction_query',
                'members': [
                    {'name': 'b', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyAction_input': {
            'struct': {
                'name': 'MyAction_input',
                'members': [
                    {'name': 'c', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyAction_output': {
            'struct': {
                'name': 'MyAction_output',
                'members': [
                    {'name': 'd', 'type': {'builtin': 'int'}}
                ]
            }
        },
        'MyAction_errors': {
            'enum': {
                'name': 'MyAction_errors',
                'values': [
                    {'name': 'MyError', 'doc': ['My error']}
                ]
            }
        }
    };
    validateTypeModel(types);
    const actionErrorValuesOrig = [...types.MyAction_errors.enum.values];
    const elements = validateElements(schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction'}));
    t.deepEqual(types.MyAction_errors.enum.values, actionErrorValuesOrig);
    t.deepEqual(
        elements,
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                [
                    {'html': 'p', 'elem': [
                        {'html': 'b', 'elem': {'text': 'Note: '}},
                        {'text': 'The request is exposed at the following URLs:'}
                    ]},
                    [
                        {'html': 'p', 'elem': [
                            {'text': `${nbsp}${nbsp}`},
                            {'html': 'a', 'attr': {'href': '/MyAction'}, 'elem': {'text': '/MyAction'}}
                        ]},
                        {'html': 'p', 'elem': [
                            {'text': `${nbsp}${nbsp}`},
                            {'attr': {'href': '/MyAction'}, 'elem': {'text': 'GET /MyAction'}, 'html': 'a'}
                        ]},
                        {'html': 'p', 'elem': [
                            {'text': `${nbsp}${nbsp}`},
                            {'attr': {'href': '/my_action'}, 'elem': {'text': '/my_action'}, 'html': 'a'}
                        ]},
                        {'html': 'p', 'elem': [
                            {'text': `${nbsp}${nbsp}`},
                            {'attr': {'href': '/my_alias'}, 'elem': {'text': 'GET /my_alias'}, 'html': 'a'}
                        ]}
                    ]
                ],
                [
                    {
                        'html': 'h2',
                        'attr': {'id': 'name=MyAction&type_MyAction_path'},
                        'elem': {'text': 'Path Parameters'}
                    },
                    null,
                    null,
                    {
                        'html': 'table',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'th', 'elem': {'text': 'Name'}},
                                    {'html': 'th', 'elem': {'text': 'Type'}},
                                    null,
                                    null
                                ]
                            },
                            [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'td', 'elem': {'text': 'a'}},
                                        {'html': 'td', 'elem': {'text': 'int'}},
                                        null,
                                        null
                                    ]
                                }
                            ]
                        ]
                    }
                ],
                [
                    {
                        'html': 'h2',
                        'attr': {'id': 'name=MyAction&type_MyAction_query'},
                        'elem': {'text': 'Query Parameters'}
                    },
                    null,
                    null,
                    {
                        'html': 'table',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'th', 'elem': {'text': 'Name'}},
                                    {'html': 'th', 'elem': {'text': 'Type'}},
                                    null,
                                    null
                                ]
                            },
                            [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'td', 'elem': {'text': 'b'}},
                                        {'html': 'td', 'elem': {'text': 'int'}},
                                        null,
                                        null
                                    ]
                                }
                            ]
                        ]
                    }
                ],
                [
                    {
                        'html': 'h2',
                        'attr': {'id': 'name=MyAction&type_MyAction_input'},
                        'elem': {'text': 'Input Parameters'}
                    },
                    null,
                    null,
                    {
                        'html': 'table',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'th', 'elem': {'text': 'Name'}},
                                    {'html': 'th', 'elem': {'text': 'Type'}},
                                    null,
                                    null
                                ]
                            },
                            [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'td', 'elem': {'text': 'c'}},
                                        {'html': 'td', 'elem': {'text': 'int'}},
                                        null,
                                        null
                                    ]
                                }
                            ]
                        ]
                    }
                ],
                [
                    {
                        'html': 'h2',
                        'attr': {'id': 'name=MyAction&type_MyAction_output'},
                        'elem': {'text': 'Output Parameters'}
                    },
                    null,
                    null,
                    {
                        'html': 'table',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'th', 'elem': {'text': 'Name'}},
                                    {'html': 'th', 'elem': {'text': 'Type'}},
                                    null,
                                    null
                                ]
                            },
                            [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'td', 'elem': {'text': 'd'}},
                                        {'html': 'td', 'elem': {'text': 'int'}},
                                        null,
                                        null
                                    ]
                                }
                            ]
                        ]
                    }
                ],
                [
                    {
                        'html': 'h2',
                        'attr': {'id': 'name=MyAction&type_MyAction_errors'},
                        'elem': {'text': 'Error Codes'}
                    },
                    null,
                    null,
                    [
                        {'html': 'p', 'elem': [{'text': 'If an application error occurs, the response is of the form:'}]},
                        {
                            'html': 'pre',
                            'elem': {
                                'html': 'code',
                                'elem': [
                                    {'text': '{\n'},
                                    {'text': '    "error": "<code>",\n'},
                                    {'text': '    "message": "<message>"\n'},
                                    {'text': '}\n'}
                                ]
                            }
                        },
                        {'html': 'p', 'elem': [{'text': '"message" is optional. "<code>" is one of the following values:'}]}
                    ],
                    {
                        'html': 'table',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'th', 'elem': {'text': 'Value'}},
                                    {'html': 'th', 'elem': {'text': 'Description'}}
                                ]
                            },
                            [
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'td', 'elem': {'text': 'MyError'}},
                                        {'html': 'td', 'elem': [{'html': 'p', 'elem': [{'text': 'My error'}]}]}
                                    ]
                                },
                                {
                                    'html': 'tr',
                                    'elem': [
                                        {'html': 'td', 'elem': {'text': 'UnexpectedError'}},
                                        {'html': 'td', 'elem': [
                                            {
                                                'html': 'p',
                                                'elem': [{'text': 'An unexpected error occurred while processing the request'}]
                                            }
                                        ]}
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            ],
            null
        ]
    );
});


const emptyActionErrorElements = [
    {
        'html': 'h2',
        'attr': {'id': 'name=MyAction&type_MyAction_errors'},
        'elem': {'text': 'Error Codes'}
    },
    null,
    null,
    [
        {'html': 'p', 'elem': [{'text': 'If an application error occurs, the response is of the form:'}]},
        {'html': 'pre', 'elem': {'html': 'code', 'elem': [
            {'text': '{\n'},
            {'text': '    "error": "<code>",\n'},
            {'text': '    "message": "<message>"\n'},
            {'text': '}\n'}
        ]}},
        {'html': 'p', 'elem': [{'text': '"message" is optional. "<code>" is one of the following values:'}]}
    ],
    {
        'html': 'table',
        'elem': [
            {'html': 'tr', 'elem': [
                {'html': 'th', 'elem': {'text': 'Value'}},
                {'html': 'th', 'elem': {'text': 'Description'}}
            ]},
            [
                {'html': 'tr', 'elem': [
                    {'html': 'td', 'elem': {'text': 'UnexpectedError'}},
                    {'html': 'td', 'elem': [
                        {'html': 'p', 'elem': [{'text': 'An unexpected error occurred while processing the request'}]}
                    ]}
                ]}
            ]
        ]
    }
];


test('schemaMarkdownDoc, action empty', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction'
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction'})),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                null,
                null,
                null,
                null,
                null,
                emptyActionErrorElements
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, action empty error values', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction',
                'errors': 'MyAction_errors'
            }
        },
        'MyAction_errors': {
            'enum': {
                'name': 'MyAction_errors'
            }
        }
    };
    validateTypeModel(types);
    const elements = validateElements(schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction'}));
    t.true(!('values' in types.MyAction_errors.enum));
    t.deepEqual(
        elements,
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                null,
                null,
                null,
                null,
                null,
                emptyActionErrorElements
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, action no URLs', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction'
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction'})),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                null,
                null,
                null,
                null,
                null,
                emptyActionErrorElements
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, action URL override', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction',
                'urls': [
                    {'method': 'GET'}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(
            schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction', 'actionURLs': [{'method': 'GET', 'url': '/my_action'}]})
        ),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                [
                    {'html': 'p', 'elem': [
                        {'html': 'b', 'elem': {'text': 'Note: '}},
                        {'text': 'The request is exposed at the following URL:'}
                    ]},
                    [
                        {'html': 'p', 'elem': [
                            {'text': `${nbsp}${nbsp}`},
                            {'html': 'a', 'attr': {'href': '/my_action'}, 'elem': {'text': 'GET /my_action'}}
                        ]}
                    ]
                ],
                null,
                null,
                null,
                null,
                emptyActionErrorElements
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, action URL override empty', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction',
                'urls': [
                    {'method': 'GET'}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction', 'actionURLs': []})),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                null,
                null,
                null,
                null,
                null,
                emptyActionErrorElements
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, action unexpected value defined', (t) => {
    const types = {
        'MyAction': {
            'action': {
                'name': 'MyAction',
                'errors': 'MyActionErrors'
            }
        },
        'MyActionErrors': {
            'enum': {
                'name': 'MyActionErrors',
                'values': [
                    {'name': 'UnexpectedError'}
                ]
            }
        }
    };
    validateTypeModel(types);
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'MyAction', {'params': 'name=MyAction', 'actionURLs': []})),
        [
            [
                {
                    'html': 'h1',
                    'attr': {'id': 'name=MyAction&type_MyAction'},
                    'elem': {'text': 'MyAction'}
                },
                null,
                null,
                null,
                null,
                null,
                null,
                [
                    {
                        'html': 'h2',
                        'attr': {'id': 'name=MyAction&type_MyActionErrors'},
                        'elem': {'text': 'Error Codes'}
                    },
                    null,
                    null,
                    [
                        {'html': 'p', 'elem': [{'text': 'If an application error occurs, the response is of the form:'}]},
                        {'html': 'pre', 'elem': {'html': 'code', 'elem': [
                            {'text': '{\n'},
                            {'text': '    "error": "<code>",\n'},
                            {'text': '    "message": "<message>"\n'},
                            {'text': '}\n'}
                        ]}},
                        {'html': 'p', 'elem': [{'text': '"message" is optional. "<code>" is one of the following values:'}]}
                    ],
                    {
                        'html': 'table',
                        'elem': [
                            {'html': 'tr', 'elem': [
                                {'html': 'th', 'elem': {'text': 'Value'}},
                                null
                            ]},
                            [
                                {'html': 'tr', 'elem': [
                                    {'html': 'td', 'elem': {'text': 'UnexpectedError'}},
                                    null
                                ]}
                            ]
                        ]
                    }
                ]
            ],
            null
        ]
    );
});


test('schemaMarkdownDoc, invalid', (t) => {
    const types = {
        'Invalid': {
            'invalid': {
                'name': 'Invalid'
            }
        }
    };
    t.deepEqual(
        validateElements(schemaMarkdownDoc(types, 'Invalid')),
        [null, null]
    );
});


test('schemaMarkdownDoc, unknown type', (t) => {
    const types = {};
    let errorMessage = null;
    try {
        validateElements(schemaMarkdownDoc(types, 'Unknown'));
    } catch ({message}) {
        errorMessage = message;
    }
    t.is(errorMessage, "Unknown type 'Unknown'");
});
