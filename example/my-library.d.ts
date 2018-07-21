declare module 'my-library' {

  import { Component, CSSProperties, PureComponent, ReactChild, ReactNode, SFC } from 'react';

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



}
