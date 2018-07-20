'use strict';

function padStr(str) {
  const padding = ' '.repeat(2);
  return str.split('\n').map(s=>(padding+s).trimRight()).join('\n');
}

//Can't support custom validators
function isCustomValidator(type) {
  return typeof type === "function" && type.name !== '_fpr';
}  

function fakeProp(type, propToString, isRequired){
  if (isCustomValidator(type)) {
    type = 'any';
  }
  const _fpr = ()=>{};
  _fpr.toString = (path = '', options = {}) => {
    const result = propToString ? propToString(type, path, options) : type
    return result;
  };
  _fpr._type = type;
  _fpr._req = isRequired;
  if (!isRequired) {
    _fpr.isRequired = fakeProp(type, propToString, true);
  }
  return _fpr;
}

function oneOfToString(props) {
  return `${props.map(s=>typeof s === 'string' ? `'${s}'`: String(s)).join(' | ')}`;
}  

function oneOfTypeToString(props, path, options) {
  return `${props.map(prop=>prop.toString(path, options)).join(' | ')}`;
}  

function shapeToString(shape, path, options) {
  return `{\n`+padStr(
    Object.keys(shape)
      .map(key=>`${key}${shape[key]._req ? '' : '?'}: ${shape[key].toString(`${path}.${key}`, options)}`)
      .join(';\n')
  )+`;\n}`;
} 

function arrayOfToString(prop, path, options) {
  return `Array<${prop.toString(path, options)}>`;
}

function objectOfToString(prop, path, options) {
  return `{[key: string]: ${prop.toString(path, options)}}`;
}

function genericCallback(name) {
  return (prop, path, {[name]: cb})=> cb ? cb(path, prop) : prop;
}

const fakePropTypes = {
  //simple values
  bool: fakeProp('boolean'),
  number: fakeProp('number'),
  string: fakeProp('string'),
  symbol: fakeProp('Symbol'),

  //values that could be maped
  element: fakeProp('ReactChild', genericCallback('mapReactChild')),
  node: fakeProp('ReactNode', genericCallback('mapReactNode')),
  array: fakeProp('Array<any>', genericCallback('mapArray')),
  func: fakeProp('Function', genericCallback('mapFunction')),
  object: fakeProp('{[key: string]: any}', genericCallback('mapObject')),
  any: fakeProp('any', genericCallback('mapAny')),

  //complex values
  oneOf: (props)=>fakeProp(props, oneOfToString),
  oneOfType: (props)=>fakeProp(props, oneOfTypeToString),
  arrayOf: (prop)=>fakeProp(prop, arrayOfToString),
  objectOf: (prop)=>fakeProp(prop, objectOfToString),
  instanceOf: (func)=>fakeProp(func.name), //prop should be class|function
  shape: (shape)=>fakeProp(shape, shapeToString),
  exact: (shape)=>fakeProp(shape, shapeToString),
};

function getFunction(func) {
  const res = func.toString().match(/function\s.*?\(([^)]*)\)/);

  if (!res) {
    return 'Function';
  }

  const argStr = res[1].split(',')
    .map(arg=>arg.replace(/\/\*.*\*\//, '').trim())
    .filter(arg=>arg)
    .map(arg=>`${arg}?: any`).join(', ');

  return `(${argStr}) => any`;
}

function getSimpleValue(value) {
  switch (typeof value) {
    case 'function': return getFunction(value);
    case 'object': return '{\n'+
      padStr(
        Object.keys(value)
          .map(key=>getSimpleProperty(key, value[key]))
          .join(';\n')+';'
      )+
      '\n}';
    case 'string': return `'${value}'`;
    default: return value;
  }
}

function getSimpleProperty(name, value) {
  return `${name}: ${getSimpleValue(value)}`;
}

function getComponentProps(comp, path, options) {
  const parentPropTypes = comp.__proto__.propTypes || {};
  const parentDefaultProps = comp.__proto__.defaultProps || {};
  const parentKeys = [...Object.keys(parentPropTypes), ...Object.keys(parentDefaultProps)];

  const result = Object.keys(comp.propTypes)
    .filter(key=>!parentKeys.some(parentKey=>key===parentKey))
    .map((key)=>{
      const prop = isCustomValidator(comp.propTypes[key]) ? 'any' : comp.propTypes[key];
      const defaultProp = comp.defaultProps && comp.defaultProps[key];
      const required = prop._req && (defaultProp === undefined);
      const propValue = prop.toString(`${path}.${key}`, options), defaultProp, key;
      const defaultValue = defaultProp == null ? '' : ` //default: ${JSON.stringify(defaultProp)}`;
      const propKey = key + (required ? '' : '?');
      return `${propKey}: ${propValue};${defaultValue}`
    })
    .join('\n');

  return result ? `\n${result}\n` : '';
}

function getComponent(name, comp, options) {
  const parentName = comp.__proto__.name;
  const props = getComponentProps(comp, name, options);

  if (parentName) {
    return `export interface ${name}Props {${padStr(props)}}\n`+
           `export class ${name}<T = any> extends ${parentName}<${name}Props & T> {}\n`;
  } else {
    return `export interface ${name}Props {${padStr(props)}}\n`+
           `export const ${name}: SFC<${name}Props>;\n`;
  }
};

function generateTypes(moduleName, moduleExport, options = {}) {
  let customDeclarations = options.customDeclarations || '';
  if (Array.isArray(customDeclarations)) {
    customDeclarations = customDeclarations.join('\n');
  }
  return  `declare module '${moduleName}' {\n\n`+
    padStr(
      `import { Component, CSSProperties, PureComponent, ReactChild, ReactNode, SFC } from 'react';\n\n`+
      customDeclarations+'\n\n'+
      Object
        .keys(moduleExport)
        .filter(key=>moduleExport[key].propTypes)
        .map(key=>getComponent(key, moduleExport[key], options))
        .join('\n')+
      '\n\n'+
      Object
        .keys(moduleExport)
        .filter(key=>!moduleExport[key].propTypes)
        .map(key=>`export const ${getSimpleProperty(key, moduleExport[key])};`)
        .join('\n\n')+'\n'
    )+
  `}\n`;
}

const injectPropTypes = (propTypes) => { 
  Object.keys(propTypes).forEach(key=>propTypes[key] = fakePropTypes[key]);
  return propTypes;
}

module.exports = {injectPropTypes, generateTypes};