// 选择项目

import React from 'react';
import { Input } from 'antd';
import { IFormField } from '../../types';
// import Pccc from './pccopy';
import './pc.less';
/**
 * 自定义控件运行态 PC 视图
 */
const FormField: ISwapFormField = {
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { form } = this.props;
    form.setFieldValue('SelectPro', e.target.value);
  },

  fieldRender() {
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    console.log('sssssssssss', viewMode);
    const field = form.getFieldInstance('SelectPro');
    const label = form.getFieldProp('SelectPro', 'label');
    const placeholder = form.getFieldProp('SelectPro', 'placeholders');
    if (viewMode) {
      return (
        <div className="pc-custom-field-wrap">
          <div className="label">详情页测试字段</div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="label">发起页测试字段</div>
        </div>
      );
    }
  },
};

export default FormField;
