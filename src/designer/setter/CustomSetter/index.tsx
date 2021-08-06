import React from 'react';
import { Switch } from 'antd';
import { ISuiteDesignerSetter } from '../../../types';
import './style.less';

interface ISuiteSetterDemo extends ISuiteDesignerSetter {
  handleChange: (checked: boolean) => void;
}

const SuiteSetterDemo: ISuiteSetterDemo = {
  handleChange(checked) {
    this.setFieldProps('leaveReason', {
      hidden: !checked,
    });
  },

  setterRender() {
    return (
      <div>
        <div>{this.props.label}</div>
        <Switch defaultChecked onChange={this.handleChange} />
      </div>
    );
  },
};

export default SuiteSetterDemo;
