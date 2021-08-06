import React from 'react';
import { IValidationRule } from './Validator';

export interface IFieldData {
  value?: any;
  extendValue?: any;
}

interface ISchema {
  componentName: string;
  props: {
    id: string;
    bizAlias?: string;
    label: string;
    required: boolean;
    placeholder: string;
  };
}

interface IForm {
  // 获取对应字段实例
  getFieldInstance: (bizAlias: string) => IFieldInstance;
  // 获取对应字段的值
  getFieldValue: (bizAlias: string) => any;
  // 设置对应字段的值
  setFieldValue: (bizAlias: string, value: any) => void;
  // 获取对应字段的扩展值
  getFieldExtendValue: (bizAlias: string) => any;
  // 设置对应字段的扩展值
  setFieldExtendValue: (bizAlias: string, extendValue: any) => void;
  // 监听对应字段的值变化
  onFieldValueChange: (bizAlias: string, fn: (value?: any) => void) => void;
  // 监听对应字段的扩展值变化
  onFieldExtendValueChange: (
    bizAlias: string,
    fn: (extendValue?: any) => void,
  ) => void;
  // 设置对应字段的属性值
  setFieldProp: (bizAlias: string, propName: string, propValue: any) => void;
  // 获取对应字段的属性值
  getFieldProp: (bizAlias: string, propName: string) => any;
  // 获取对应字段的所有属性值
  getFieldProps: (bizAlias: string) => any;
  // 主动触发表单校验
  validate: () => { valid: boolean; message: string };
  // 获取整个表单值
  getFormData: () => any;
  // 获取所有表单实例
  getFields: () => IFieldInstance[];
  // 获取表单schema
  getFormSchema: () => ISchema[];
  // 获取套件的props
  getSuiteProps: () => any;
  // 获取套件指定属性值
  getSuiteProp: (propName: string) => any;
}

export interface IProps {
  // 表单实例
  form: IForm;
  // 套件开放的网关接口列表
  spi: { [key: string]: <T>(params: { [key: string]: any }) => Promise<T> };
}

export interface IFieldInstance {
  renderComponent: (opts?: { index?: number }) => any;
  getValue: () => any;
  getExtendValue: () => any;
  setExtendValue: (extendValue: any) => void;
  setValue: (
    value: any,
    extra?: {
      silent: boolean;
    },
  ) => void;
  setProp: (propName: string, propValue: any) => void;
  getProp: (propName: string) => any;
  onExtendValueChange: (
    fn: (
      extendValue?: any,
      FieldStore?: IFieldInstance,
      scopeContext?: IContext,
    ) => void,
  ) => () => void;
  show: () => void;
  hide: () => void;
  onValueChange: (
    fn: (
      value?: any,
      FieldStore?: IFieldInstance,
      scopeContext?: IContext,
      etra?: any,
    ) => void,
  ) => () => void;
  addValidator: (fieldValidation?: IValidationRule | string) => void;
  removeValidator: (fieldValidation?: IValidationRule | string) => void;
}

export interface IContext {
  getFieldByProp: (
    propName: string,
    propValue: any,
  ) => IFieldInstance | undefined;
  getFieldByBizAlias: (bizAlias: any) => IFieldInstance | undefined;
  getFieldById: (id: string) => IFieldInstance | undefined;
  getFieldsByComponentName: (componentName: string) => IFieldInstance[];
}

export interface ISuiteRuntime {
  props?: IProps;
  suiteWillMount?: () => void;
  suiteDidMount?: () => void;
  suiteDidUpdate?: () => void;
  suiteRender?: () => React.ReactElement;
}

export interface IFormField {
  props?: IProps;
  fieldWillMount?: () => void;
  fieldDidMount?: () => void;
  fieldDidUpdate?: () => void;
  fieldRender?: () => React.ReactElement;
}

export interface ISuiteDesignerSetter {
  props?: IProps;
  setterWillMount?: () => void;
  setterDidMount?: () => void;
  setterDidUpdate?: () => void;
  setterRender?: () => React.ReactElement;
  getSuiteProps?: () => any;
  setSuiteProps?: (props: any) => any;
  getFieldProps?: (bizAlias: string) => string;
  setFieldProps?: (bizAlias: string, props: any) => void;
  getAllFieldProps?: () => any;
  setAllFieldProps?: (children: any) => any;
}
