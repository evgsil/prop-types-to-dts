const React = require('react');
const PropTypes = require('prop-types');

class MyComponent extends React.Component {
  render() {
    return React.createElement('div', null, 'Hello World!');
  }
}

class Message {
  show(str) {
    //some logic here
  }
}

MyComponent.propTypes = {
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,
  optionalNode: PropTypes.node,
  optionalElement: PropTypes.element,
  optionalMessage: PropTypes.instanceOf(Message),
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  requiredFunc: PropTypes.func.isRequired,
  requiredAny: PropTypes.any.isRequired,
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};

class TestComponent extends React.PureComponent {
  render() {
    return React.createElement('div', null, 'test');
  }
}

TestComponent.propTypes = {
  shape: PropTypes.shape({
    innerShape: PropTypes.shape({
      validateString: PropTypes.func.isRequired,
      style: PropTypes.shape({
        header: PropTypes.object,
        body: PropTypes.object,
        footer: PropTypes.object,
      }), 

      x: PropTypes.number.isRequired,
      date: PropTypes.instanceOf(Date),
      oneMoreShape: PropTypes.shape({
        arrayOf: PropTypes.arrayOf(PropTypes.oneOfType([
          PropTypes.shape({str: PropTypes.string.isRequired, bool: PropTypes.bool.isRequired}),
          PropTypes.number,
          PropTypes.instanceOf(Date),
          PropTypes.shape({str: PropTypes.string, bool: PropTypes.bool}),
        ])),
        oneOfType: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.instanceOf(Date)
        ])
      })
    }),
    exact: PropTypes.exact({str: PropTypes.string}).isRequired,
    oneOf: PropTypes.oneOf([1, 'a', true, false, 2.5, {obj: 'test'}, [1,'2',3], function Test(){}]),
    oneOfType: PropTypes.oneOfType([
      PropTypes.shape({x: PropTypes.number}),
      PropTypes.bool,
    ]),
  }).isRequired,
};


module.exports = {MyComponent, TestComponent};