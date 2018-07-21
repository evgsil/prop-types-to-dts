declare module 'test-component' {

  import { Component, CSSProperties, PureComponent, ReactChild, ReactNode, SFC } from 'react';


  export interface TestProps {
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
  export class Test<T = any> extends PureComponent<TestProps & T> {}

}
