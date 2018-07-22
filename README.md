# prop-types-to-dts

Generates TypeScript definition file for React components from [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html)

Example:
```javascript
const {injectPropTypes, generateTypes} = require('prop-types-to-dts');

injectPropTypes(require('prop-types'));

console.log(generateTypes('my-library', require('./my-library'),{
  //Possible mappers:
  //mapFunction:   (path, defValue) => defValue, //for each PropTypes.func
  //mapReactChild: (path, defValue) => defValue, //for each PropTypes.element
  //mapReactNode:  (path, defValue) => defValue, //for each PropTypes.node
  //mapArray:      (path, defValue) => defValue, //for each PropTypes.array
  //mapObject:     (path, defValue) => defValue, //for each PropTypes.object
  //mapAny:        (path, defValue) => defValue, //for each PropTypes.any

  //Replace all style objects with CSSProperties
  mapObject: (path, defValue) => /style/i.test(path) ? 'CSSProperties' : defValue, 

  customDeclarations: [
    'export interface Message {',
    '  show: (str: string) => void;',
    '}',
  ],
}));
```