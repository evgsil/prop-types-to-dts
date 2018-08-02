# prop-types-to-dts

Generates TypeScript definition file for React components from [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html)

Example:
```javascript
const {injectPropTypes, generateTypes} = require('prop-types-to-dts');

injectPropTypes(require('prop-types'));

const moduleName = 'my-library';
const moduleExport = require('./my-library');

const types = generateTypes(moduleName, moduleExport,{
  //Custom imports, types and interfaces. Should be: string | Array<string>
  customDeclarations: [
    //Added CSSProperties to default import 
    `import { Component, PureComponent, ReactChild, ReactNode, SFC, CSSProperties } from 'react'`,
    '',
    //Added our custom Message interface that was used as PropTypes.instanceOf(Message)
    'export interface Message {',
    '  show: (str: string) => void;',
    '}',
    '',
  ], 

  //Possible mappers:
  //mapFunction:   (path, defValue) => defValue, //for each PropTypes.func
  //mapReactChild: (path, defValue) => defValue, //for each PropTypes.element
  //mapReactNode:  (path, defValue) => defValue, //for each PropTypes.node
  //mapArray:      (path, defValue) => defValue, //for each PropTypes.array
  //mapObject:     (path, defValue) => defValue, //for each PropTypes.object
  //mapAny:        (path, defValue) => defValue, //for each PropTypes.any

  //Generate function declaration
  mapFunction: (path, def)=> /validateString/.test(path) ? '(value: string) => boolean' : def,

  //Replace all style objects with CSSProperties
  mapObject: (path, defValue) => /style/i.test(path) ? 'CSSProperties' : defValue, 

  //Callback for getting whole component type
  getComponent: (name, props, parentName, defValue) => defValue,

  //Set this true if you specified customized import of react types in customDeclarations
  skipReactImport: true, //default: false
});

require('fs').writeFileSync(moduleName+'.d.ts', types);
```