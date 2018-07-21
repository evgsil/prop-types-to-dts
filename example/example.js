const {injectPropTypes, generateTypes} = require('../index');
const fs = require('fs');

injectPropTypes(require('prop-types'));

fs.writeFileSync('my-library.d.ts', generateTypes('my-library', require('./my-library'),{
  customDeclarations: [
    'export interface Message {',
    '  show: (str: string) => void;',
    '}',
  ],
}));

fs.writeFileSync('test-component.d.ts', generateTypes('test-component', require('./test-component'),{
  //Replace all style objects with CSSProperties
  mapObject: (path, def)=> /style/i.test(path) ? 'CSSProperties' : def,

  //Generate function declaration
  mapFunction: (path, def)=> /validateString/.test(path) ? '(value: string) => boolean' : def,
}));
