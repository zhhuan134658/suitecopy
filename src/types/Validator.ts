declare type RuleType = 'maxLength' | 'required' | 'length';
interface IFieldProps {
  label?: string | string[];
  value?: any;
  extendValue?: any;
}
export interface IValidationRule {
  type?: RuleType;
  param?: any;
  message?: string;
  func?: (
    props: IFieldProps,
    param: any,
  ) => boolean | string | Promise<boolean | string>;
}
