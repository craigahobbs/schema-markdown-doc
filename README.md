# schema-markdown-doc

[![npm](https://img.shields.io/npm/v/schema-markdown-doc)](https://www.npmjs.com/package/schema-markdown-doc)
[![GitHub](https://img.shields.io/github/license/craigahobbs/schema-markdown-doc)](https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE)

[schema-markdown-doc API Documentation](https://craigahobbs.github.io/schema-markdown-doc/)

The schema-markdown-doc package generates documentation for
[Schema Markdown](https://github.com/craigahobbs/schema-markdown-js)
schemas.

The
[schemaMarkdownDoc](https://craigahobbs.github.io/schema-markdown-doc/module-lib_schemaMarkdownDoc.html#.schemaMarkdownDoc)
function generates the
[element-model](https://github.com/craigahobbs/element-model)
for a Schema Markdown user type's documentation. For example:

``` javascript
import {SchemaMarkdownParser} from 'schema-markdown/lib/parser.js';
import {schemaMarkdownDoc} from 'schema-markdown-doc/lib/schemaMarkdownDoc.js';

const parser = new SchemaMarkdownParser(`\
# My struct
struct MyStruct

    # My member
    string member
`);
const elements = schemaMarkdownDoc(parser.types, 'MyStruct');
```

The element model is rendered using element-model's
[renderElements](https://craigahobbs.github.io/element-model/module-lib_elementModel.html#.renderElements)
function.

``` javascript
import {renderElements} from 'element-model/lib/elementModel.js';

renderElements(window.document.body, elements);
```


## The Schema Markdown Documentation Viewer

[schema-markdown-doc Application](https://craigahobbs.github.io/schema-markdown-doc/app/)

To host your Schema Markdown type model's documentation, first, download the schema-markdown-doc
application stub to the directory containing your type model's Schema Markdown file (.smd) or JSON
file:

```
curl -O https://craigahobbs.github.io/schema-markdown-doc/static/index.html
```

To host locally, start a local static web server:

```
python3 -m http.server
```

By default, schema-markdown-doc renders the
[Schema Markdown Type Model](https://craigahobbs.github.io/schema-markdown-doc/app/).

To display documentation for your schema, set the "var.vURL" hash parameter (i.e., "#var.vURL=types.smd").

Alternatively, you can change the default file URL by updating the schema-markdown-doc application
stub. For example:

``` html
~~~ markdown-script
include 'app.mds'
await schemaMarkdownDoc(myTypes.smd, 'My Schema')
~~~
```


## Development

schema-markdown-doc is an [Element Application](https://github.com/craigahobbs/element-app#readme).
It is developed using [javascript-build](https://github.com/craigahobbs/javascript-build#readme)
and it was started using [javascript-template](https://github.com/craigahobbs/javascript-template#readme):

```
template-specialize javascript-template/template/ schema-markdown-doc/ -k package schema-markdown-doc -k name 'Craig A. Hobbs' -k email 'craigahobbs@gmail.com' -k github 'craigahobbs' -k noapp 1
```
