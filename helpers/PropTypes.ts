import PropTypes from "prop-types";
import React from "react";

export { PropTypes as PropTypesTypes };

export default {
  ...PropTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any: PropTypes.any as PropTypes.Requireable<any> &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PropTypes.Validator<any | undefined>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  array: PropTypes.array as PropTypes.Requireable<any[]> &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PropTypes.Validator<any[] | undefined>,
  bool: PropTypes.bool as PropTypes.Requireable<boolean> &
    PropTypes.Validator<boolean | undefined>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: PropTypes.func as PropTypes.Requireable<(...args: any[]) => any> &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PropTypes.Validator<(...args: any[]) => any | undefined>,
  number: PropTypes.number as PropTypes.Requireable<number> &
    PropTypes.Validator<number | undefined>,
  object: PropTypes.object as PropTypes.Requireable<object> &
    PropTypes.Validator<object | undefined>,
  string: PropTypes.string as PropTypes.Requireable<string> &
    PropTypes.Validator<string | undefined>,
  node: PropTypes.node as PropTypes.Requireable<React.ReactNode> &
    PropTypes.Validator<React.ReactNode | undefined>,
  element: PropTypes.element as PropTypes.Requireable<React.ReactElement> &
    PropTypes.Validator<React.ReactElement | undefined>,
  symbol: PropTypes.symbol as PropTypes.Requireable<symbol> &
    PropTypes.Validator<symbol | undefined>,
  elementType: PropTypes.elementType as PropTypes.Requireable<
    React.ComponentType
  > &
    PropTypes.Validator<React.ComponentType | undefined>,
};
