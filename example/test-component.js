const React = require('react');
const PropTypes = require('prop-types');

class Test extends React.PureComponent {
  render() {
    return React.createElement('div', null, 'test');
  }
}

Test.propTypes = {
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

module.exports = Test;