declare module 'my-library' {

  import { Component, PureComponent, ReactChild, ReactNode, SFC, CSSProperties } from 'react'

  export interface Message {
    show: (str: string) => void;
  }

  export interface MyComponentProps {
    optionalArray?: Array<any>;
    optionalBool?: boolean;
    optionalFunc?: Function;
    optionalNumber?: number;
    optionalObject?: {[key: string]: any};
    optionalString?: string;
    optionalSymbol?: Symbol;
    optionalNode?: ReactNode;
    optionalElement?: ReactChild;
    optionalMessage?: Message;
    optionalEnum?: 'News' | 'Photos';
    optionalUnion?: string | number | Message;
    optionalArrayOf?: Array<number>;
    optionalObjectOf?: {[key: string]: number};
    optionalObjectWithShape?: {
      color?: string;
      fontSize?: number;
    };
    requiredFunc: Function;
    requiredAny: any;
    customProp?: any;
    customArrayProp?: Array<any>;
  }
  export class MyComponent<T = any> extends Component<MyComponentProps & T> {}

  export interface TestComponentProps {
    shape: {
      innerShape?: {
        validateString: (value: string) => boolean;
        style?: {
          header?: CSSProperties;
          body?: CSSProperties;
          footer?: CSSProperties;
        };
        x: number;
        date?: Date;
        oneMoreShape?: {
          arrayOf?: Array<{
            str: string;
            bool: boolean;
          } | number | Date | {
            str?: string;
            bool?: boolean;
          }>;
          oneOfType?: string | number | Date;
        };
      };
      exact: {
        str?: string;
      };
      oneOf?: 1 | 'a' | true | false | 2.5 | {'obj':'test'} | [1,'2',3];
      oneOfType?: {
        x?: number;
      } | boolean;
    };
  }
  export class TestComponent<T = any> extends PureComponent<TestComponentProps & T> {}



}
